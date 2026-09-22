import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';
import { isFeedbackStatus } from '@/lib/feedback';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await verifyAuth();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await props.params;
        if (!mongoose.isObjectIdOrHexString(id)) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }

        // Only the status is editable; the submission itself is kept as the user sent it.
        const body = await request.json().catch(() => null);
        const status = body?.status;
        if (!isFeedbackStatus(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await dbConnect();
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: 'after', runValidators: true },
        ).lean();

        if (!feedback) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }

        return NextResponse.json(feedback);
    } catch (error) {
        console.error('Error updating feedback:', error);
        return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
    }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await verifyAuth();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await props.params;
        if (!mongoose.isObjectIdOrHexString(id)) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }

        await dbConnect();
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Feedback deleted' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
    }
}
