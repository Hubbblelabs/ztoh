import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { sendMonthlyReportEmails } from '@/lib/monthlyReports';
import MonthlyReport from '@/models/MonthlyReport';
import dbConnect from '@/lib/db';

// Helper to verify admin token
async function verifyAdmin(request: Request) {
    const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
    
    if (!token) {
        return null;
    }
    
    const payload = await verifyToken(token);
    return payload;
}

// POST - Resend email for a specific report
export async function POST(
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

        const report = await MonthlyReport.findById(id);
        
        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        // Reset emailSentAt to allow resending
        report.emailSentAt = undefined;
        await report.save();

        const results = await sendMonthlyReportEmails([report]);

        return NextResponse.json({
            success: true,
            results
        });
    } catch (error: any) {
        console.error('Error resending report email:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}

// GET - Get a specific report
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
