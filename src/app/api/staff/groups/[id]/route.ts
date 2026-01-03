
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Group from "@/models/Group";
import TeachingHours from "@/models/TeachingHours";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Await the params
        const resolvedParams = await params;
        const { id } = resolvedParams;
        if (!id) {
            return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
        }

        const { name, studentIds, description } = await req.json();

        if (!name || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return NextResponse.json(
                { error: "Name and at least one student are required" },
                { status: 400 }
            );
        }

        // Ensure the group belongs to the staff member
        const group = await Group.findOneAndUpdate(
            { _id: id, staffId: (session.user as any).id },
            { name, studentIds, description },
            { new: true, runValidators: true }
        );

        if (!group) {
            return NextResponse.json({ error: "Group not found or unauthorized" }, { status: 404 });
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
        if (!session || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const resolvedParams = await params;
        const { id } = resolvedParams;

        if (!id) {
            return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
        }

        const group = await Group.findOneAndDelete({
            _id: id,
            staffId: (session.user as any).id,
        });

        if (!group) {
            return NextResponse.json({ error: "Group not found or unauthorized" }, { status: 404 });
        }

        // Remove group reference from any teaching hours
        await TeachingHours.updateMany(
            { groupId: id },
            { $unset: { groupId: "" } }
        );

        return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting group:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
