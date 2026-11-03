import jwt, { type JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

connect()

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "You must be logged in to view your profile." },
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
        const user = await User.findById(payload.id)
            .select("username email")
            .lean();

        if (!user) {
            return NextResponse.json(
                { error: "The account for this session could not be found." },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: "User found.",
            data: {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
        });
    } catch (error: unknown) {
        console.error("Profile request failed:", error);
        return NextResponse.json(
            { error: "Unable to load your profile right now." },
            { status: 500 },
        );
    }
}
