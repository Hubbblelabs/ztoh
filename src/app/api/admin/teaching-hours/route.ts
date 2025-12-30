import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import TeachingHours from '@/models/TeachingHours';
import Staff from '@/models/Staff';
import { cookies } from 'next/headers';

// Helper to verify admin token
async function verifyAdmin() {
    const cookieStore = await cookies();
    // Check for authToken first (unified login), then adminToken (legacy)
    let token = cookieStore.get('authToken')?.value;
    if (!token) {
        token = cookieStore.get('adminToken')?.value;
    }
    
    if (!token) {
        return null;
    }
    
    const payload = await verifyToken(token);
    return payload;
}

// GET - List teaching hours (all or by staff)
export async function GET(request: Request) {
    try {
        const payload = await verifyAdmin();
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const staffId = searchParams.get('staffId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query: any = {};
        
        if (staffId) {
            query.staffId = staffId;
        }
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;
        
        const [teachingHours, total] = await Promise.all([
            TeachingHours.find(query)
                .populate('staffId', 'name email')
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            TeachingHours.countDocuments(query)
        ]);

        return NextResponse.json({
            records: teachingHours,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching teaching hours:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Add teaching hours for a staff member
export async function POST(request: Request) {
    try {
        const payload = await verifyAdmin();
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { staffId, date, hours, subject, course, description } = await request.json();

        if (!staffId || !date || hours === undefined || !subject) {
            return NextResponse.json(
                { error: 'Staff ID, date, hours, and subject are required' },
                { status: 400 }
            );
        }

        // Verify staff exists
        const staff = await Staff.findById(staffId);
        if (!staff) {
            return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
        }

        const teachingHour = await TeachingHours.create({
            staffId,
            date: new Date(date),
            hours: parseFloat(hours),
            subject,
            course: course || '',
            description: description || '',
        });

        return NextResponse.json({ success: true, record: teachingHour }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating teaching hours:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}
