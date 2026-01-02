import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import TeachingHours from '@/models/TeachingHours';

// GET - Get a single teaching hour record
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAuth();

        const { id } = await params;
        await dbConnect();

        const record = await TeachingHours.findById(id).populate('staffId', 'name email');
        
        if (!record) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ record });
    } catch (error) {
        console.error('Error fetching teaching hour record:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update a teaching hour record
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAuth();

        const { id } = await params;
        await dbConnect();

        const { date, hours, subject, course, description } = await request.json();

        const record = await TeachingHours.findById(id);
        
        if (!record) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        if (date) record.date = new Date(date);
        if (hours !== undefined) record.hours = parseFloat(hours);
        if (subject) record.subject = subject;
        if (course !== undefined) record.course = course;
        if (description !== undefined) record.description = description;

        await record.save();

        return NextResponse.json({ success: true, record });
    } catch (error: any) {
        console.error('Error updating teaching hour record:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete a teaching hour record
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAuth();

        const { id } = await params;
        await dbConnect();

        const record = await TeachingHours.findByIdAndDelete(id);
        
        if (!record) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting teaching hour record:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
