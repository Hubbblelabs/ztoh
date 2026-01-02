import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';

export async function GET(request: Request) {
    try {
        const payload = await verifyAuth();

        await dbConnect();
        const admin = await Admin.findById(payload.id).select('-password');

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json(admin);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
