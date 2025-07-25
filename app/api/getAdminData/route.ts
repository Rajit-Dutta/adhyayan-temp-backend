import { dbConnect } from "@/lib/db";
import adminModel from "@/models/Admin";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    console.log(email);

    if (!email) {
      return new Response("Email issue", { status: 400 });
    }

    const adminData = await adminModel.findOne({ email });

    if (!adminData) {
      return new Response("Admin not found", { status: 404 });
    }
    return new Response(JSON.stringify({adminData}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
