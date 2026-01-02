import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import MonthlyReport from '@/models/MonthlyReport';
import dbConnect from '@/lib/db';
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

// GET - Get a specific report
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAdmin();
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const report = await MonthlyReport.findById(id).populate('staffId', 'name email');
        
        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        return NextResponse.json({ report });
    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a specific report
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAdmin();
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const report = await MonthlyReport.findByIdAndDelete(id);
        
        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
