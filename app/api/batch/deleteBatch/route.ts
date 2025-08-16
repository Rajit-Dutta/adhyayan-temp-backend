import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import studentModel from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("id");

    if (!batchId) {
      return NextResponse.json(
        { error: "Batch ID is required" },
        { status: 400 }
      );
    }

    const objectId = new mongoose.Types.ObjectId(batchId);
    const deletedBatch = await batchModel.findByIdAndDelete(objectId);

    if (deletedBatch) {
      await studentModel.updateMany(
        { batch: objectId },
        {
          $unset: {
            batch: {
              _id: "",
              name: "",
              subject: "",
              standard: "",
              teacher: "",
              status: "",
            },
          },
        }
      );
    }

    if (!deletedBatch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Batch deleted successfully", deletedBatch },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting batch:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
