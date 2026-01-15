import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';
import TeachingHours from '@/models/TeachingHours';
import MonthlyReport, { ISubjectBreakdown } from '@/models/MonthlyReport';
import Settings from '@/models/Settings';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface GenerateReportOptions {
    month?: number; // 1-12
    year?: number;
    staffId?: string; // Optional: generate for specific staff only
}

interface ReportData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: any;
    staffName: string;
    staffEmail: string;
    totalHours: number;
    month: number;
    year: number;
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
    subjectBreakdown: ISubjectBreakdown[];
    emailSentAt?: Date;
}

export async function generateMonthlyReports(options: GenerateReportOptions = {}) {
    await dbConnect();

    const now = new Date();
    // Default to previous month
    let targetMonth = options.month || now.getMonth(); // getMonth() is 0-indexed
    let targetYear = options.year || now.getFullYear();

    // If no month specified, use previous month
    if (!options.month) {
        if (now.getMonth() === 0) {
            targetMonth = 12;
            targetYear = now.getFullYear() - 1;
        } else {
            targetMonth = now.getMonth(); // Previous month (0-indexed becomes 1-indexed)
        }
    }

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    // Get all active staff or specific staff
    const staffQuery = options.staffId ? { _id: options.staffId, isActive: true } : { isActive: true };
    const staffMembers = await Staff.find(staffQuery);

    const reports = [];

    for (const staff of staffMembers) {
        // Get teaching hours for the month
        const teachingHours = await TeachingHours.find({
            staffId: staff._id,
            date: { $gte: startDate, $lte: endDate }
        });

        // Calculate total hours
        const totalHours = teachingHours.reduce((sum, record) => sum + record.hours, 0);

        // Calculate subject breakdown
        const subjectMap = new Map<string, { subject: string; course?: string; hours: number }>();

        for (const record of teachingHours) {
            const key = `${record.subject}|${record.course || ''}`;
            if (subjectMap.has(key)) {
                subjectMap.get(key)!.hours += record.hours;
            } else {
                subjectMap.set(key, {
                    subject: record.subject,
                    course: record.course || undefined,
                    hours: record.hours
                });
            }
        }

        const subjectBreakdown: ISubjectBreakdown[] = Array.from(subjectMap.values());

        // Create or update the monthly report
        const report = await MonthlyReport.findOneAndUpdate(
            { staffId: staff._id, month: targetMonth, year: targetYear },
            {
                staffId: staff._id,
                staffName: staff.name,
                staffEmail: staff.email,
                month: targetMonth,
                year: targetYear,
                totalHours,
                subjectBreakdown,
                startDate,
                endDate,
                generatedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        reports.push(report);
    }

    return reports;
}

function getMonthName(month: number): string {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || '';
}

function generateConsolidatedEmailHtml(reports: ReportData[], monthName: string, year: number): string {
    // Sort reports by staff name
    const sortedReports = [...reports].sort((a, b) => a.staffName.localeCompare(b.staffName));

    const totalHoursAllStaff = sortedReports.reduce((sum, r) => sum + r.totalHours, 0);

    const rows = sortedReports.map(report => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${report.staffName}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${report.staffEmail}</td>
            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;"><strong>${report.totalHours.toFixed(1)}</strong></td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Monthly Teaching Hours Report - All Staff</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Monthly Teaching Hours Report</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">${monthName} ${year} - All Staff</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="margin-top: 0;">Dear Admin,</p>
            
            <p>Here is the consolidated teaching hours summary for all staff for <strong>${monthName} ${year}</strong>.</p>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #64748b;">Total Staff Reported:</span>
                    <span style="font-weight: 600;">${reports.length}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span style="color: #64748b;">Total Hours (All Staff):</span>
                    <span style="font-weight: 600; color: #1d4ed8;">${totalHoursAllStaff.toFixed(1)}</span>
                </div>
            </div>
            
            <h3 style="color: #334155; margin-top: 24px; margin-bottom: 12px;">Staff Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f1f5f9;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Staff Name</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Email</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Total Hours</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
                This is an automated report generated on ${new Date().toLocaleDateString()}. 
            </p>
        </div>
    </body>
    </html>
    `;
}

export async function sendAdminConsolidatedReport(reports: ReportData[]) {
    await dbConnect();

    if (!reports || reports.length === 0) {
        return { success: true, message: 'No reports to send' };
    }

    const settings = await Settings.findOne();
    const adminEmail = settings?.emailSettings?.adminEmail;
    const fromEmail = settings?.emailSettings?.fromEmail || process.env.FROM_EMAIL || 'Zero To Hero <onboarding@resend.dev>';

    if (!adminEmail) {
        console.error('Admin email not configured in settings');
        return { success: false, error: 'Admin email not configured' };
    }

    const monthName = getMonthName(reports[0].month);
    const year = reports[0].year;
    const subject = `Monthly Teaching Hours Report - All Staff - ${monthName} ${year}`;

    const html = generateConsolidatedEmailHtml(reports, monthName, year);

    try {
        const data = await resend.emails.send({
            from: `Zero To Hero <${fromEmail}>`,
            to: adminEmail,
            subject,
            html,
        });

        if (!data.error) {
            // Mark all reports as email sent
            const reportIds = reports.map(r => r._id);
            await MonthlyReport.updateMany(
                { _id: { $in: reportIds } },
                { emailSentAt: new Date() }
            );

            return {
                success: true,
                adminEmail,
                count: reports.length
            };
        } else {
            return {
                success: false,
                adminEmail,
                error: data.error
            };
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error sending consolidated email to ${adminEmail}:`, error);
        return {
            success: false,
            adminEmail,
            error: errorMessage
        };
    }
}

export async function generateAndSendMonthlyReports(options: GenerateReportOptions = {}) {
    // Generate reports
    const reports = await generateMonthlyReports(options);

    // Send consolidated email to admin instead of individual emails
    const emailResults = await sendAdminConsolidatedReport(reports);

    return {
        reportsGenerated: reports.length,
        emailResults
    };
}
