import cloudinary from "@/lib/config";
import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  const buffer = Buffer.from(await file.arrayBuffer());

  await dbConnect();

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "question-bank",
            public_id: Date.now().toString(),
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    const result = uploadResult as any;

    const newAssignment = new assignmentModel({
      title,
      subject,
      grade,
      assignedTo,
      assignedBy,
      totalMarks,
      questionPaperLink: result.secure_url,
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
        questionPaperLink: result.secure_url,
        isSubmissionInClass,
        isSubmissionOpen,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
