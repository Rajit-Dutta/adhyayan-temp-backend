import { dbConnect } from "@/lib/db";
import Batch from "@/models/Batch";
import Student from "@/models/Student";

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
    const batches = await Batch.find({ teacher: teacherId }).populate({
      path: "students",
      select: "firstName lastName email phone standard",
    });

    // Flatten all students from all batches and remove duplicates
    const studentsMap = new Map();
    batches.forEach((batch) => {
      batch.students.forEach((student: any) => {
        if (!studentsMap.has(student._id.toString())) {
          studentsMap.set(student._id.toString(), {
            ...student.toObject(),
            batchId: batch._id,
            batchName: batch.name,
          });
        }
      });
    });

    const students = Array.from(studentsMap.values());

    return new Response(JSON.stringify({ students, batches }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
