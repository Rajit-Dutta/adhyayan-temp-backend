import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();

    const id = formData.get("_id") as string;
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const grade = formData.get("grade") as string;
    const assignedBy = formData.get("assignedBy") as string;
    const assignedTo = JSON.parse(formData.get("assignedTo") as string);
    const totalMarks = Number(formData.get("totalMarks"));
    const isSubmissionInClass = formData.get("isSubmissionInClass") === "true";
    const isSubmissionOpen = formData.get("isSubmissionOpen") === "true";
    const submitCount = formData.get("submitCount") as string;
    const checkCount = formData.get("checkCount") as string;
    const questionPaperLink = formData.get("questionPaperLink");

    const existingAssignment = await assignmentModel.findOne({ _id: id });
    if (!existingAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    let fileUrl = existingAssignment.questionPaperLink; 

    if (questionPaperLink instanceof File) {
      const dateTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const filePath = `questionPapers/${questionPaperLink.name}-${dateTime}`;
      const { error } = await supabase.storage
        .from("Adhyayan-Backend")
        .upload(filePath, questionPaperLink);

      if (error) {
        console.error("Error uploading file: ", error);
        return NextResponse.json(
          { error: "File upload failed" },
          { status: 500 }
        );
      }

      const { data } = supabase.storage
        .from("Adhyayan-Backend")
        .getPublicUrl(filePath);

      fileUrl = data.publicUrl; // Use new URL
    }

    const updatedAssignment = await assignmentModel.findByIdAndUpdate(
      existingAssignment._id,
      {
        title,
        subject,
        grade,
        assignedTo,
        assignedBy,
        totalMarks,
        questionPaperLink: fileUrl, // ✅ Use either new or existing URL
        isSubmissionInClass,
        isSubmissionOpen,
        submitCount,
        checkCount,
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Assignment updated successfully", updatedAssignment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating an assignment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
