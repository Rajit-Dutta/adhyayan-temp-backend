import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, subject, standard, students, teacher } = await request.json();

    const existingBatch = await batchModel.findOne({ name, subject, standard });
    if (existingBatch) {
      return new Response("Batch already exists", { status: 409 });
    } else {
      const newBatch = new batchModel({
        name,
        subject,
        standard,
        students,
        teacher,
      });
      const savedBatch = await newBatch.save();
      return new Response(JSON.stringify(savedBatch), { status: 201 });
    }
  } catch (error) {
    console.error("Error in creating a batch:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
