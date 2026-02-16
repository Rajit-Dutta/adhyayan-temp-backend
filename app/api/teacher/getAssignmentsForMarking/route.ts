import { dbConnect } from "@/lib/db";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Batch from "@/models/Batch";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return new Response(
        JSON.stringify({ error: "Teacher ID is required" }),
        { status: 400 }
      );
    }

    // Get all batches for this teacher
    const batches = await Batch.find({ teacher: teacherId });
    const batchIds = batches.map((batch) => batch._id);

    // Get all assignments assigned to these batches
    const assignments = await Assignment.find({
      assignedBy: teacherId,
      assignedTo: { $in: batchIds },
    })
      .populate("assignedBy", "fullName email")
      .populate("assignedTo", "name subject");

    // For each assignment, get all submissions
    const assignmentsWithSubmissions = await Promise.all(
      assignments.map(async (assignment) => {
        const submissions = await AssignmentSubmission.find({
          assignment: assignment._id,
        })
          .populate("submittedBy", "firstName lastName email")
          .populate("assignedBy", "fullName email")
          .sort({ submissionDate: -1 });

        return {
          ...assignment.toObject(),
          submissions,
        };
      })
    );

    return new Response(JSON.stringify(assignmentsWithSubmissions), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
