import {connect} from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import { sendEmail } from "../../../../helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    let requestBody: unknown;

    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    }

    if (
      typeof requestBody !== "object" ||
      requestBody === null ||
      Array.isArray(requestBody)
    ) {
      return NextResponse.json(
        { error: "Request body must contain signup details." },
        { status: 400 },
      );
    }

    const body = requestBody as Record<string, unknown>;
    const { username, email, password } = body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 },
      );
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedUsername || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await connect();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    })
      .select("email username")
      .lean();

    if (existingUser?.email === normalizedEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    if (existingUser?.username === normalizedUsername) {
      return NextResponse.json(
        { error: "This username is already taken." },
        { status: 409 },
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const savedUser = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        success: true,
        user: {
          id: savedUser._id.toString(),
          username: savedUser.username,
          email: savedUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "An account with this email or username already exists." },
        { status: 409 },
      );
    }

    console.error("Signup request failed:", error);
    return NextResponse.json(
      { error: "Unable to complete signup right now. Please try again later." },
      { status: 500 },
    );
  }
}