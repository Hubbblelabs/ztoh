import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { name, studentIds, description } = await req.json();

        if (!name || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return NextResponse.json(
                { error: "Name and at least one student are required" },
                { status: 400 }
            );
        }

        const group = await Group.create({
            name,
            staffId: (session.user as any).id,
            studentIds,
            description,
        });

        return NextResponse.json({ group }, { status: 201 });
    } catch (error) {
        console.error("Error creating group:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const groups = await Group.find({ staffId: (session.user as any).id })
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
