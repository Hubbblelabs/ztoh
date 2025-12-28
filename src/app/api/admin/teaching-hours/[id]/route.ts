import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import TeachingHours from '@/models/TeachingHours';

// Helper to verify admin token
async function verifyAdmin(request: Request) {
    const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
    
    if (!token) {
        return null;
    }
    
    const payload = await verifyToken(token);
    return payload;
}

// GET - Get a single teaching hour record
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAdmin(request);
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
        const payload = await verifyAdmin(request);
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
        const payload = await verifyAdmin(request);
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
