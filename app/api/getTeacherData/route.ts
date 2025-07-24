import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";
import { NextRequest } from "next/server";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

     const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response("Email issue", { status: 400 });
    }

    const teacherData = await teacherModel.findOne({ email });

    if (!teacherData) {
      return new Response("Teacher not found", { status: 404 });
    }
    return new Response(JSON.stringify({teacherData}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
