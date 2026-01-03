import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import TeachingHours from "@/models/TeachingHours";
import Group from "@/models/Group";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "student") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const studentId = (session.user as any).id;

        // Find groups the student is part of
        const studentGroups = await Group.find({ studentIds: studentId }).distinct('_id');

        // Find hours logged for the student specifically or their groups
        const teachingHours = await TeachingHours.find({
            $or: [
                { studentIds: studentId },
                { groupId: { $in: studentGroups } }
            ]
        }).populate('staffId', 'name').sort({ date: -1 });

        const totalHours = teachingHours.reduce((acc, curr) => acc + curr.hours, 0);

        return NextResponse.json({
            totalHours,
            recentLogs: teachingHours
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching student dashboard:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
