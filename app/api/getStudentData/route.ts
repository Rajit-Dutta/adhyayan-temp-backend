import { dbConnect } from "@/lib/db";
import studentModel from "@/models/Student";

export async function GET() {
  try {
    await dbConnect();
    const studentNames = await studentModel
      .find(
        {},
        "firstName address lastName standard email age DOB isVerified courseEnrolled phone remarks subjects batch bloodGroup createdAt parentPhone parentName"
      )
      .lean();
    if (!studentNames || studentNames.length === 0) {
      return new Response("No students found", { status: 404 });
    }
    return new Response(JSON.stringify(studentNames), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
