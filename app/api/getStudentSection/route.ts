import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("batchId");

    const batch = await batchModel.find({
      _id: ids,
    });
    return batch;
  } catch (error) {
    console.error("Error in getting batch details: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
