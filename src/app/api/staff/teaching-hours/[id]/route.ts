
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
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
        const resolvedParams = await params;
        const { id } = resolvedParams;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const data = await req.json();
        const { date, hours, subject, course, description, groupId, studentIds } = data;

        // Ensure the record belongs to the staff member
        const record = await TeachingHours.findOne({ _id: id, staffId: (session.user as any).id });

        if (!record) {
            return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
        }

        record.date = new Date(date);
        record.hours = Number(hours);
        record.subject = subject;
        record.course = course;
        record.description = description;

        // Handle logical assignment: clear the other field based on what's being updated
        // Note: The frontend should send either groupId or studentIds based on the mode.
        if (groupId) {
            record.groupId = groupId;
            record.studentIds = undefined; // Clear student list if switching to group
        } else if (studentIds && studentIds.length > 0) {
            record.studentIds = studentIds;
            record.groupId = undefined; // Clear group if switching to student list
        }

        await record.save();

        return NextResponse.json({ record }, { status: 200 });

    } catch (error) {
        console.error("Error updating teaching hour:", error);
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

        const record = await TeachingHours.findOneAndDelete({
            _id: id,
            staffId: (session.user as any).id
        });

        if (!record) {
            return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting teaching hour:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
