import { dbConnect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import adminModel from "@/models/Admin";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
      email,
      password,
      phoneNumber,
      isVerified = false,
      verifyToken,
      verifyTokenExpiry = new Date(),
    } = await request.json();

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return new Response("Admin already exists", { status: 409 });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newAdmin = new adminModel({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        isVerified,
        verifyToken,
        verifyTokenExpiry,
      });
      const savedAdmin = await newAdmin.save();
      const tokenData = {
        id: savedAdmin._id,
        email: newAdmin.email,
        userType: "admin",
      };
      const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      const response = NextResponse.json(
        {
          id: savedAdmin._id,
          message: "Sign up successful",
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
    }
  } catch (error) {
    console.error("Error in admin sign-up:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
