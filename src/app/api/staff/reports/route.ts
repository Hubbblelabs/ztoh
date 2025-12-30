import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import MonthlyReport from '@/models/MonthlyReport';
import Staff from '@/models/Staff';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        let token = cookieStore.get('authToken')?.value;
        if (!token) {
            token = cookieStore.get('staffToken')?.value;
        }

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'staff') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
    } catch (error) {
        console.error('Error fetching monthly reports:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
