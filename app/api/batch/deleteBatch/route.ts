import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("id");

    if (!batchId) {
      return NextResponse.json({ error: "Batch ID is required" }, { status: 400 });
    }

    const deletedBatch = await batchModel.findByIdAndDelete(batchId);

    if (!deletedBatch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Batch deleted successfully", deletedBatch }, { status: 200 });
  } catch (error) {
    console.error("Error deleting batch:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
