import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';
import TeachingHours from '@/models/TeachingHours';
import bcrypt from 'bcryptjs';

// Helper to verify admin token
async function verifyAdmin(request: Request) {
    const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
    
    if (!token) {
        return null;
    }
    
    const payload = await verifyToken(token);
    return payload;
}

// GET - Get a single staff member with their teaching hours summary
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

        const staff = await Staff.findById(id).select('-password');
        
        if (!staff) {
            return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
        }

        // Get teaching hours summary
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const totalHours = await TeachingHours.aggregate([
            { $match: { staffId: staff._id } },
            { $group: { _id: null, total: { $sum: '$hours' } } }
        ]);

        const monthlyHours = await TeachingHours.aggregate([
            { $match: { staffId: staff._id, date: { $gte: monthStart, $lte: monthEnd } } },
            { $group: { _id: null, total: { $sum: '$hours' } } }
        ]);

        return NextResponse.json({
            staff,
            summary: {
                totalHours: totalHours[0]?.total || 0,
                monthlyHours: monthlyHours[0]?.total || 0,
            }
        });
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update a staff member
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

        const { name, email, password, phone, subjects, isActive } = await request.json();

        const staff = await Staff.findById(id);
        
        if (!staff) {
            return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
        }

        // Check if email is being changed to one that already exists
        if (email && email !== staff.email) {
            const existingStaff = await Staff.findOne({ email });
            if (existingStaff) {
                return NextResponse.json(
                    { error: 'A staff member with this email already exists' },
                    { status: 400 }
                );
            }
        }

        if (name) staff.name = name;
        if (email) staff.email = email;
        if (phone !== undefined) staff.phone = phone;
        if (subjects) staff.subjects = subjects;
        if (isActive !== undefined) staff.isActive = isActive;
        
        // If password is being updated, hash it manually to avoid double hashing
        if (password) {
            const salt = await bcrypt.genSalt(10);
            staff.password = await bcrypt.hash(password, salt);
        }

        await staff.save();

        const staffResponse = staff.toObject();
        delete staffResponse.password;

        return NextResponse.json({ success: true, staff: staffResponse });
    } catch (error: any) {
        console.error('Error updating staff:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete a staff member
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

        const staff = await Staff.findByIdAndDelete(id);
        
        if (!staff) {
            return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
        }

        // Also delete all teaching hours for this staff member
        await TeachingHours.deleteMany({ staffId: id });

        return NextResponse.json({ success: true, message: 'Staff member deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
