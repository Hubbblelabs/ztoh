import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';

export async function GET() {
    try {
        await verifyAuth();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const feedback = await Feedback.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }
}
