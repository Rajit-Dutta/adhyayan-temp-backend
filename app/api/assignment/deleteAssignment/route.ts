import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("id");

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    const deletedAssignment = await assignmentModel.findByIdAndDelete(assignmentId);

    if (!deletedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Assignment deleted successfully", deletedAssignment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
