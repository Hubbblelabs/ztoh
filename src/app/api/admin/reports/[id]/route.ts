import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import MonthlyReport from '@/models/MonthlyReport';
import dbConnect from '@/lib/db';

// GET - Get a specific report
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAuth();

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
        await verifyAuth();

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
