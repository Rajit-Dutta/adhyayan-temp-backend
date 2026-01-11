import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    const existingTeacher = await teacherModel.findOne({ email });
    if (!existingTeacher) {
      return new Response("Teacher not found", { status: 404 });
    }
    const validPassword = await bcrypt.compare(
      password,
      existingTeacher.password
    );
    if (!validPassword) {
      return new Response("Invalid password", { status: 401 });
    }

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    for (const cookie of allCookies) {
      cookieStore.delete(cookie.name);
    }

    const tokenData = {
      id: existingTeacher._id,
      fullName: existingTeacher.fullName,
      email: existingTeacher.email,
      userType: "teacher",
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json(
      {
        id: existingTeacher._id,
        message: "Sign in successful",
        success: true,
      },
      {
        status: 200,
      }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    console.error("Error in teacher sign-up:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
