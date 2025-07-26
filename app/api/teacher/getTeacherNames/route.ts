import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";

export async function GET() {
  try {
    await dbConnect();
    const teacherNames = await teacherModel.find({}, "fullName").lean();
    if (!teacherNames || teacherNames.length === 0) {
      return new Response("No teachers found", { status: 404 });
    }
    return new Response(JSON.stringify(teacherNames), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/teacher/getTeacherNames:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
