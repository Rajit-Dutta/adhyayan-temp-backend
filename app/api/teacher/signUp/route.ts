import { dbConnect } from "@/lib/db";
import teacherModel from "@/models/Teacher";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    for (const cookie of allCookies) {
      cookieStore.delete(cookie.name);
    }
    const {
      fullName,
      subject,
      email,
      password,
      phoneNumber,
      classesToTeach,
      isVerified = false,
      verifyToken,
      verifyTokenExpiry = new Date(),
    } = await request.json();

    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return new Response("Teacher already exists", { status: 409 });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newTeacher = new teacherModel({
        fullName,
        subject,
        email,
        password: hashedPassword,
        phoneNumber,
        classesToTeach,
        isVerified,
        verifyToken,
        verifyTokenExpiry,
      });
      const savedTeacher = await newTeacher.save();
      // try {
      //   await sendEmail({
      //     email: savedTeacher.email,
      //     emailType: "VERIFY",
      //     userId: savedTeacher._id,
      //   });
      // } catch (emailErr) {
      //   console.error("Email sending failed:", emailErr);
      // }

      const tokenData = {
        id: savedTeacher._id,
        email: newTeacher.email,
        userType: "teacher",
      };
      const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      const response = NextResponse.json(
        {
          id: savedTeacher._id,
          message: "Sign Up successful",
          success: true,
        },
        {
          status: 201,
        }
      );
      response.cookies.set("token", token, {
        httpOnly: true,
      });
      return response;
    }
  } catch (error) {
    console.error("Error in teacher sign-up:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
