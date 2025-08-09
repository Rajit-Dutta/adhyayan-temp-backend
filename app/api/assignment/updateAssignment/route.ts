import { dbConnect } from "@/lib/db";
import cloudinary from "@/lib/config";
import assignmentModel from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        { status: 404 }
      );
    }

    let questionPaperLink= existingAssignment.questionPaperLink;

    if (file && file.size > 0) {
      const fileNameWithoutExtension = path.parse(file.name).name;
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: file.type === "application/pdf" ? "image" : "auto",
              folder: "question-bank",
              public_id: fileNameWithoutExtension,
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(buffer);
      });

      questionPaperLink = (uploadResult as any).secure_url;
    }
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
        questionPaperLink,
        isSubmissionInClass,
        isSubmissionOpen,
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }
    // ✅ Send back the updated asssignment
    return NextResponse.json(
      { message: "Assignment updated successfully", updatedAssignment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating an assignment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
