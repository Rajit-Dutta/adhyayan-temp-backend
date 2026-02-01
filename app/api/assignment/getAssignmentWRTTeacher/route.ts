import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import teacherModel from "@/models/Teacher";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const emailID = searchParams.get("email");
    console.log("Email got: ", emailID);
    console.log("typeof email: ", typeof emailID);

    const teacherDetails = await teacherModel.find({ email: emailID });
    const teacherID = teacherDetails[0]._id;

    const assignmentDetails = await assignmentModel.find({
      assignedBy: teacherID,
    });
    
    if (!assignmentDetails) {
      return new Response("No assignment created so far", { status: 404 });
    }
    return new Response(JSON.stringify(assignmentDetails), { status: 201 });
  } catch (error) {
    console.error("Error in getting assignment details:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
