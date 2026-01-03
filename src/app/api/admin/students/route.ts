import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { name, email, password, phone } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return NextResponse.json(
                { error: "Student with this email already exists" },
                { status: 400 }
            );
        }

        const student = await Student.create({
            name,
            email,
            password,
            phone,
        });

        return NextResponse.json({ student }, { status: 201 });
    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const students = await Student.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ students }, { status: 200 });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
