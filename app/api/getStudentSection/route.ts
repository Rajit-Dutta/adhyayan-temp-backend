import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { batchIds } = await request.json();

    if (!batchIds || !Array.isArray(batchIds)) {
      return new Response("Invalid batchIds payload", { status: 400 });
    }

    const batches = await batchModel.find({
      _id: { $in: batchIds },
    });

    return new Response(JSON.stringify(batches), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fetching batches:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
