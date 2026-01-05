import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        // Find groups where staffIds array contains the current user's ID
        const groups = await Group.find({ staffIds: (session.user as any).id })
            .populate('studentIds', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ groups }, { status: 200 });
    } catch (error) {
        console.error("Error fetching groups:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
