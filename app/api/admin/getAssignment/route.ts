import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";

export async function GET() {
  try {
    await dbConnect();

    const assignmentData = await assignmentModel.find();

    if (!assignmentData || assignmentData.length === 0) {
      return new Response("No assignments found", { status: 404 });
    }

    return new Response(JSON.stringify({ assignmentData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/getAssignment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
