import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const teacherDetails = await teacherModel.findOne({
      email: email,
    });
    if (!teacherDetails) {
      return new Response("No teacher found", { status: 404 });
    }
    return new Response(JSON.stringify(teacherDetails), {
      status: 201,
    });
  } catch (error) {
    console.error("Error in getting batch details:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
