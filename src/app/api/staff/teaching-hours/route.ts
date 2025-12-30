import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import TeachingHours from '@/models/TeachingHours';
import Staff from '@/models/Staff';
import { cookies } from 'next/headers';

// Helper to get date ranges
function getDateRanges() {
    const now = new Date();
    
    // Today (start and end of today)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    // This week (Sunday to Saturday)
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return { todayStart, todayEnd, weekStart, weekEnd, monthStart, monthEnd };
}

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
        const period = searchParams.get('period') || 'all'; // 'daily', 'weekly', 'monthly', 'all'
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const { todayStart, todayEnd, weekStart, weekEnd, monthStart, monthEnd } = getDateRanges();

        let dateFilter: any = {};

        if (period === 'daily') {
            dateFilter = { $gte: todayStart, $lte: todayEnd };
        } else if (period === 'weekly') {
            dateFilter = { $gte: weekStart, $lte: weekEnd };
        } else if (period === 'monthly') {
            dateFilter = { $gte: monthStart, $lte: monthEnd };
        } else if (startDate && endDate) {
            dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const query: any = { staffId: payload.id };
        if (Object.keys(dateFilter).length > 0) {
            query.date = dateFilter;
        }

        const teachingHours = await TeachingHours.find(query).sort({ date: -1 });

        // Calculate summaries
        const dailyHours = await TeachingHours.aggregate([
            { $match: { staffId: staff._id, date: { $gte: todayStart, $lte: todayEnd } } },
            { $group: { _id: null, total: { $sum: '$hours' } } }
        ]);

        const weeklyHours = await TeachingHours.aggregate([
            { $match: { staffId: staff._id, date: { $gte: weekStart, $lte: weekEnd } } },
            { $group: { _id: null, total: { $sum: '$hours' } } }
        ]);

        const monthlyHours = await TeachingHours.aggregate([
            { $match: { staffId: staff._id, date: { $gte: monthStart, $lte: monthEnd } } },
            { $group: { _id: null, total: { $sum: '$hours' } } }
        ]);

        // Subject breakdown for current month
        const subjectBreakdown = await TeachingHours.aggregate([
            { $match: { staffId: staff._id, date: { $gte: monthStart, $lte: monthEnd } } },
            { 
                $group: { 
                    _id: { subject: '$subject', course: '$course' }, 
                    total: { $sum: '$hours' } 
                } 
            },
            { $sort: { total: -1 } }
        ]);

        return NextResponse.json({
            records: teachingHours,
            summary: {
                daily: dailyHours[0]?.total || 0,
                weekly: weeklyHours[0]?.total || 0,
                monthly: monthlyHours[0]?.total || 0,
            },
            subjectBreakdown: subjectBreakdown.map(item => ({
                subject: item._id.subject,
                course: item._id.course || null,
                hours: item.total
            })),
            dateRanges: {
                today: { start: todayStart, end: todayEnd },
                week: { start: weekStart, end: weekEnd },
                month: { start: monthStart, end: monthEnd }
            }
        });
    } catch (error) {
        console.error('Error fetching teaching hours:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
