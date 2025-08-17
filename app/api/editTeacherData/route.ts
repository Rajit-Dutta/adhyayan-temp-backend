import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const {
      fullName,
      subject,
      email,
      password,
      phoneNumber,
      classesToTeach,
      isVerified,
    } = await request.json();

    const existingStudent = await teacherModel.findOne({ email });
    if (existingStudent) {
      const _id = existingStudent._id;
      const updatedStudent = await teacherModel.findByIdAndUpdate(
        _id,
        {
          fullName,
          subject,
          email,
          password,
          phoneNumber,
          classesToTeach,
          isVerified,
        },
        { new: true }
      );
      if (!updatedStudent) {
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Student updated successfully", updatedStudent },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in editing student data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
