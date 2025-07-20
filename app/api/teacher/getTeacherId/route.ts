import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";
import { NextRequest } from "next/server";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const extractedTeacherId = await teacherModel.findOne({ email });
    if (!extractedTeacherId) {
      return new Response("Teacher not found", { status: 404 });
    }
    return new Response(JSON.stringify({ teacherId: extractedTeacherId._id }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET /api/teacher/getTeacherId:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
