import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const requestBody: unknown = await request.json();
        if (
            typeof requestBody !== "object" ||
            requestBody === null ||
            !("email" in requestBody) ||
            !("password" in requestBody) ||
            typeof requestBody.email !== "string" ||
            typeof requestBody.password !== "string"
        ) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 },
            );
        }

        const email = requestBody.email.trim().toLowerCase();
        const password = requestBody.password;
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 },
            );
        }

        const tokenSecret = process.env.TOKEN_SECRET;
        if (!tokenSecret) {
            throw new Error("TOKEN_SECRET is not configured.");
        }

        await connect();

        //check if user exists
        const user = await User.findOne({ email })
        if(!user){
            return NextResponse.json({error: "Invalid email or password."}, {status: 401})
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid email or password."}, {status: 401})
        }

        //create token data
        const tokenData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        }
        //create token
        const token = jwt.sign(tokenData, tokenSecret, { expiresIn: "1d" })

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        })
        return response;

    } catch (error: unknown) {
        console.error("Login request failed:", error);
        return NextResponse.json(
            { error: "Unable to complete login right now. Please try again later." },
            { status: 500 },
        )
    }
}