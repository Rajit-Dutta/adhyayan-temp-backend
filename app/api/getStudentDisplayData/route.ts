import { dbConnect } from "@/lib/db";
import studentModel from "@/models/Student";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("studentIds"); 

    const students = await studentModel.find({
      _id: { $in: ids },
    });

    const studentMap: { [key: string]: string } = {};
    students.forEach((student) => {
      studentMap[student._id.toString()] = `${student.firstName} ${student.lastName}`;
    });

    return new Response(JSON.stringify(studentMap), { status: 200 });
  } catch (error) {
    console.error("Error in getting student display data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
