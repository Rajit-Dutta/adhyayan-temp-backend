import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";

export async function GET() {
  try {
    await dbConnect();
    const teacherDetails = await teacherModel.find({});
    if (!teacherDetails || teacherDetails.length === 0) {
      return new Response("No teachers found", { status: 404 });
    }
    return new Response(JSON.stringify(teacherDetails), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
