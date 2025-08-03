import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";

export async function GET() {
  try {
    await dbConnect();
    const assignmentDetails = await assignmentModel.find();
    if (!assignmentDetails) {
      return new Response("No assignment created so far", { status: 404 });
    }
    return new Response(JSON.stringify(assignmentDetails), { status: 201 });
  } catch (error) {
    console.error("Error in getting assignment details:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
