import jwt, { type JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { error: "The user ID is not valid." },
        { status: 400 },
      );
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in to look up a user." },
        { status: 401 },
      );
    }

    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      throw new Error("TOKEN_SECRET is not configured.");
    }

    let payload: string | JwtPayload;
    try {
      payload = jwt.verify(token, tokenSecret);
    } catch {
      return NextResponse.json(
        { error: "Your session has expired. Please log in again." },
        { status: 401 },
      );
    }

    if (typeof payload === "string" || typeof payload.id !== "string") {
      return NextResponse.json(
        { error: "Your login session is invalid. Please log in again." },
        { status: 401 },
      );
    }

    await connect();
    const user = await User.findById(id).select("username").lean();

    if (!user) {
      return NextResponse.json(
        { error: "No user was found with that ID." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "User found.",
      data: {
        _id: user._id.toString(),
        username: user.username,
      },
    });
  } catch (error: unknown) {
    console.error("User lookup failed:", error);
    return NextResponse.json(
      { error: "Unable to look up this user right now." },
      { status: 500 },
    );
  }
}
