import { NextResponse } from 'next/server';
import { generateAndSendMonthlyReports } from '@/lib/monthlyReports';

// This endpoint should be called by a cron service at the end of each month
// For security, it requires a CRON_SECRET to be set in environment variables
// Example cron schedule: 0 0 1 * * (At 00:00 on day-of-month 1)
// This means it runs at the start of each month to generate reports for the previous month

export async function GET(request: Request) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (!cronSecret) {
            console.warn('CRON_SECRET not set - cron endpoint is disabled');
            return NextResponse.json(
                { error: 'Cron endpoint not configured' },
                { status: 503 }
            );
        }

        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Generate and send reports for the previous month
        const result = await generateAndSendMonthlyReports();

        console.log(`Monthly report cron completed: ${result.reportsGenerated} reports generated`);

        return NextResponse.json({
            success: true,
            message: `Generated and sent ${result.reportsGenerated} monthly reports`,
            timestamp: new Date().toISOString(),
            results: result.emailResults
        });
    } catch (error: any) {
        console.error('Monthly report cron error:', error);
        return NextResponse.json(
            { error: 'Failed to generate monthly reports: ' + error.message },
            { status: 500 }
        );
    }
}

// Also support POST for flexibility with different cron services
export async function POST(request: Request) {
    return GET(request);
}
