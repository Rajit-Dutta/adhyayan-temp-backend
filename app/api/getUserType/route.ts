import { dbConnect } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

dbConnect();
const jwtSecret = process.env.JWT_SECRET!;

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const requiredToken = cookieStore.get("token")?.value;

    if (!requiredToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const jwtDecoded = jwt.verify(requiredToken, jwtSecret);
    console.log("JWT Decoded:", jwtDecoded);

    return new Response(JSON.stringify({ jwtDecoded }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET /getUserType:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
