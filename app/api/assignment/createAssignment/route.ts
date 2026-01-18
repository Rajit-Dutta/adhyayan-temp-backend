import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();

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

  const existingAssignment = await assignmentModel.findOne({ title });
  if (existingAssignment) {
    return new Response("Assignment already exists", { status: 409 });
  } else {
    try {
      await dbConnect();
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

      console.log("PDF link -> ", data.publicUrl);

      const newAssignment = new assignmentModel({
        title,
        subject,
        grade,
        assignedTo,
        assignedBy,
        totalMarks,
        questionPaperLink: data.publicUrl,
        isSubmissionInClass,
        isSubmissionOpen,
      });

      const savedAssignment = await newAssignment.save();

      return NextResponse.json(
        {
          _id: savedAssignment._id,
          title,
          subject,
          grade,
          assignedTo,
          assignedBy,
          totalMarks,
          questionPaperLink: data.publicUrl,
          isSubmissionInClass,
          isSubmissionOpen,
          createdAt: new Date().toISOString(),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Upload failed", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }
}
