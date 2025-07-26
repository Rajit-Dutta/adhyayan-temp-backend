import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { assign } from "nodemailer/lib/shared";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const {
      title,
      startDate,
      endDate,
      subject,
      assignedTo,
      assignedBy,
      totalMarks,
      questionPaperLink,
      isSubmissionInClass = false,
      isSubmissionOpen = true,
    } = await request.json();

    const existingAssignment = await assignmentModel.findOne({
      questionPaperLink,
    });
    if (existingAssignment) {
      return new Response("Assignment already exists", { status: 409 });
    } else {
      const newAssignment = new assignmentModel({
        title,
        startDate,
        endDate,
        subject,
        assignedTo,
        assignedBy,
        totalMarks,
        questionPaperLink,
        isSubmissionInClass,
        isSubmissionOpen,
      });
      const savedAssignment = await newAssignment.save();
      const response = NextResponse.json(
        {
          link: savedAssignment.questionPaperLink,
          message: "Created Assignment",
          success: true,
        },
        {
          status: 200,
        }
      );
      return response;
    }
  } catch (error) {
    console.error("Error in POST /api/admin/postAssignment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
