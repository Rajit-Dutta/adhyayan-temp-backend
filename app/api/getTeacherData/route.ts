import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";

export async function GET() {
  try {
    await dbConnect();

    const teacherData = await teacherModel.find({}, "fullName").lean();

    if (!teacherData || teacherData.length === 0) {
      return new Response("No teachers found", { status: 404 });
    }
    return new Response(JSON.stringify({ teacherData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
