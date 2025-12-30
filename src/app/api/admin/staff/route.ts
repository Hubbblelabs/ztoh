import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
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
        return { error: 'No token found' };
    }
    
    const payload = await verifyToken(token);
    
    if (!payload) {
        return { error: 'Invalid token' };
    }

    return payload;
}

// GET - List all staff members
export async function GET(request: Request) {
    try {
        const result = await verifyAdmin();
        
        if ('error' in result) {
            return NextResponse.json({ error: `Unauthorized: ${result.error}` }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const query = includeInactive ? {} : { isActive: true };
        const staff = await Staff.find(query).select('-password').sort({ createdAt: -1 });

        return NextResponse.json({ staff });
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create a new staff member
export async function POST(request: Request) {
    try {
        const result = await verifyAdmin();
        
        if ('error' in result) {
            return NextResponse.json({ error: `Unauthorized: ${result.error}` }, { status: 401 });
        }

        await dbConnect();

        const { name, email, password, phone, subjects } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return NextResponse.json(
                { error: 'A staff member with this email already exists' },
                { status: 400 }
            );
        }

        const staff = await Staff.create({
            name,
            email,
            password,
            phone: phone || '',
            subjects: subjects || [],
            isActive: true,
        });

        const staffResponse = staff.toObject();
        delete staffResponse.password;

        return NextResponse.json({ success: true, staff: staffResponse }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating staff:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}
