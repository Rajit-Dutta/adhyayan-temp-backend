import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { name, subject, standard, teacher, status, students } =
      await request.json();

    const existingBatch = await batchModel.findOne({ name, subject, standard });
    console.log(existingBatch);
    if (existingBatch) {
      const _id = existingBatch._id;
      const updatedBatch = await batchModel.findByIdAndUpdate(
        _id,
        {
          name,
          subject,
          standard,
          teacher,
          status,
          students,
        },
        { new: true }
      );
      console.log("UpdatedBatch: ", updatedBatch);
      if (!updatedBatch) {
        return NextResponse.json({ error: "Batch not found" }, { status: 404 });
      }

      // ✅ Send back the updated batch
      return NextResponse.json(
        { message: "Batch updated successfully", updatedBatch },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in updating a batch:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
