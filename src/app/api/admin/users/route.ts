import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { error: 'Admin with this email already exists' },
                { status: 400 }
            );
        }

        const newAdmin = await Admin.create({
            name,
            email,
            password,
        });

        return NextResponse.json(
            { message: 'Admin created successfully', admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email } },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error creating admin:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create admin' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await dbConnect();
        const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });
        return NextResponse.json(admins);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch admins' },
            { status: 500 }
        );
    }
}
