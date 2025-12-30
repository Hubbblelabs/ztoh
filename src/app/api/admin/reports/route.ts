import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import MonthlyReport from '@/models/MonthlyReport';
import { generateMonthlyReports, sendMonthlyReportEmails, generateAndSendMonthlyReports } from '@/lib/monthlyReports';
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

// GET - List all monthly reports
export async function GET(request: Request) {
    try {
        const payload = await verifyAdmin();
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const staffId = searchParams.get('staffId');
        const year = searchParams.get('year');
        const month = searchParams.get('month');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const query: any = {};
        
        if (staffId) query.staffId = staffId;
        if (year) query.year = parseInt(year);
        if (month) query.month = parseInt(month);

        const skip = (page - 1) * limit;
        
        const [reports, total] = await Promise.all([
            MonthlyReport.find(query)
                .populate('staffId', 'name email')
                .sort({ year: -1, month: -1 })
                .skip(skip)
                .limit(limit),
            MonthlyReport.countDocuments(query)
        ]);

        return NextResponse.json({
            reports,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching monthly reports:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Generate monthly reports and optionally send emails
export async function POST(request: Request) {
    try {
        const payload = await verifyAdmin();
        
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { month, year, staffId, sendEmails } = await request.json();

        if (sendEmails) {
            // Generate and send emails
            const result = await generateAndSendMonthlyReports({ month, year, staffId });
            return NextResponse.json({
                success: true,
                message: `Generated ${result.reportsGenerated} reports`,
                emailResults: result.emailResults
            });
        } else {
            // Just generate reports
            const reports = await generateMonthlyReports({ month, year, staffId });
            return NextResponse.json({
                success: true,
                message: `Generated ${reports.length} reports`,
                reports
            });
        }
    } catch (error: any) {
        console.error('Error generating monthly reports:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}
