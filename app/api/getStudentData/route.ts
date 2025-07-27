import { dbConnect } from "@/lib/db";
import studentModel from "@/models/Student";

export async function GET() {
  try {
    await dbConnect();
    const studentNames = await studentModel.find({}, "firstName lastName standard").lean();
     if (!studentNames || studentNames.length === 0) {
      return new Response("No students found", { status: 404 });
    }
    return new Response(JSON.stringify(studentNames), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
