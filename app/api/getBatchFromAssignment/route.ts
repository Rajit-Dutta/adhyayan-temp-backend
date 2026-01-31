import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const assignedTo = searchParams.get("assignedTo");
    const assignedToData = await batchModel.findOne({ _id: assignedTo });

    if (!assignedToData || assignedToData.length === 0) {
      return new Response("No batches found", { status: 404 });
    }
    return new Response(JSON.stringify({ assignedToData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in getting batch details: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
