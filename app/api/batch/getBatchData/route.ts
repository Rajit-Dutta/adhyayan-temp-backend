import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";

export async function GET() {
  try {
    await dbConnect();
    const batchDetails = await batchModel.find();
    if (!batchDetails) {
      return new Response("No batch created so far", { status: 404 });
    }
    return new Response(JSON.stringify(batchDetails), { status: 201 });
  } catch (error) {
    console.error("Error in getting batch details:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
