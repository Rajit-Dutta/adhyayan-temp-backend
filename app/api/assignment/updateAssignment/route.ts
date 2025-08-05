import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const {
      title,
      subject,
      grade,
      assignedTo,
      assignedBy,
      totalMarks,
      questionPaperLink,
      isSubmissionInClass,
      isSubmissionOpen,
    } = await request.json();

    const existingAssignment = await assignmentModel.findOne({
      title,
      questionPaperLink,
    });
    if (existingAssignment) {
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
    } else {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in updating an assignment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
