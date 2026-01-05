import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Updated to match Next.js 15+ patterns where params might be a promise or async access
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();
        const group = await Group.findById(id)
            .populate('staffIds', 'name email')
            .populate('studentIds', 'name email');

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json({ group }, { status: 200 });
    } catch (error) {
        console.error("Error fetching group:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();
        const { name, staffIds, studentIds, description } = await req.json();

        if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
            return NextResponse.json(
                { error: "At least one Staff member is required" },
                { status: 400 }
            );
        }

        const group = await Group.findByIdAndUpdate(
            id,
            { name, staffIds, studentIds, description },
            { new: true }
        ).populate('staffIds', 'name email').populate('studentIds', 'name email');

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json({ group }, { status: 200 });
    } catch (error) {
        console.error("Error updating group:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();
        const group = await Group.findByIdAndDelete(id);

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting group:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
