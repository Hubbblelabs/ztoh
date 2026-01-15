import { NextResponse } from 'next/server';
import { verifyStaffAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import MonthlyReport from '@/models/MonthlyReport';
import Staff from '@/models/Staff';

export async function GET(request: Request) {
    try {
        const payload = await verifyStaffAuth();

        await dbConnect();

        const staff = await Staff.findById(payload.id);
        if (!staff || !staff.isActive) {
            return NextResponse.json({ error: 'Staff not found or inactive' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        const query: any = { staffId: payload.id };

        if (year) {
            query.year = parseInt(year);
        }
        if (month) {
            query.month = parseInt(month);
        }

        const reports = await MonthlyReport.find(query).sort({ year: -1, month: -1 });

        return NextResponse.json({ reports });
    } catch (_error) {
        console.error('Error fetching monthly reports:', _error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
