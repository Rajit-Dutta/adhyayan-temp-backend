import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";

export async function GET() {
  try {
    await dbConnect();
    const batchData = await batchModel.find({}, "name standard subject").lean();
    if (!batchData || batchData.length === 0) {
      return new Response("No batches found", { status: 404 });
    }
    return new Response(JSON.stringify({ batchData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in getting batch details: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
