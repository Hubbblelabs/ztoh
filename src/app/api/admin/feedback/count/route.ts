import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';

// Lightweight count for the admin sidebar badge and dashboard.
export async function GET() {
    try {
        await verifyAuth();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const newCount = await Feedback.countDocuments({ status: 'new' });
        return NextResponse.json({ newCount });
    } catch (error) {
        console.error('Error counting feedback:', error);
        return NextResponse.json({ error: 'Failed to count feedback' }, { status: 500 });
    }
}
