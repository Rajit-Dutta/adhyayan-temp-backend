import { dbConnect } from "@/lib/db";
import studentModel from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const {
      firstName,
      address,
      lastName,
      standard,
      email,
      age,
      DOB,
      isVerified,
      courseEnrolled,
      phone,
      remarks,
      subjects,
      bloodGroup,
      parentPhone,
      parentName,
    } = await request.json();

    const existingStudent = await studentModel.findOne({ email });
    if (existingStudent) {
      const _id = existingStudent._id;
      const updatedStudent = await studentModel.findByIdAndUpdate(
        _id,
        {
          firstName,
          address,
          lastName,
          standard,
          email,
          age,
          DOB,
          isVerified,
          courseEnrolled,
          phone,
          remarks,
          subjects,
          bloodGroup,
          parentPhone,
          parentName,
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
