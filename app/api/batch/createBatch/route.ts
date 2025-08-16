import { dbConnect } from "@/lib/db";
import batchModel from "@/models/Batch";
import studentModel from "@/models/Student";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, subject, standard, teacher, status, students } =
      await request.json();

    const existingBatch = await batchModel.findOne({ name, subject, standard });
    if (existingBatch) {
      return new Response("Batch already exists", { status: 409 });
    } else {
      const newBatch = new batchModel({
        name,
        subject,
        standard,
        teacher,
        status,
        students,
      });
      const savedBatch = await newBatch.save();

      console.log("Saved batch -> ", savedBatch);

      savedBatch.students.forEach(async (element: any) => {
        await studentModel.findByIdAndUpdate(element, {
          $push: {
            batch: {
              _id: savedBatch._id,
              name: savedBatch.name,
              subject: savedBatch.subject,
              standard: savedBatch.standard,
              teacher: savedBatch.teacher,
              status: savedBatch.status,
            },
          },
        });
      });

      return new Response(JSON.stringify(savedBatch), { status: 201 });
    }
  } catch (error) {
    console.error("Error in creating a batch:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
