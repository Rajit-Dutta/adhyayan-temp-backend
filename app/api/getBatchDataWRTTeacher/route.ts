import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("teacherID");
    const teacherDetails = await batchModel.find({
      teacher: id,
    });
    console.log(teacherDetails)
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