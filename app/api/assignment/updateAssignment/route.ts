import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const grade = formData.get("grade") as string;
    const assignedBy = formData.get("assignedBy") as string;
    const assignedTo = JSON.parse(formData.get("assignedTo") as string);
    const totalMarks = Number(formData.get("totalMarks"));
    const isSubmissionInClass = formData.get("isSubmissionInClass") === "true";
    const isSubmissionOpen = formData.get("isSubmissionOpen") === "true";
    const file = formData.get("questionPaperLink") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const existingAssignment = await assignmentModel.findOne({
      title,
    });
    if (!existingAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    let questionPaperLink = existingAssignment.questionPaperLink;

    const dateTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const filePath = `questionPapers/${file.name}-${dateTime}`;
    const { error } = await supabase.storage
      .from("Adhyayan-Backend")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image: ", error);
      return null;
    }

    const { data } = supabase.storage
      .from("Adhyayan-Backend")
      .getPublicUrl(filePath);

    const _id = existingAssignment._id;
    const updatedAssignment = await assignmentModel.findByIdAndUpdate(
      _id,
      {
        title,
        subject,
        grade,
        assignedTo,
        assignedBy,
        totalMarks,
        questionPaperLink: data.publicUrl,
        isSubmissionInClass,
        isSubmissionOpen,
        submitCount: 0,
        checkCount: 0,
      },
      { new: true },
    );

    if (!updatedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }
    // ✅ Send back the updated asssignment
    return NextResponse.json(
      { message: "Assignment updated successfully", updatedAssignment },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in updating an assignment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
