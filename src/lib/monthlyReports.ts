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

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function generateEmailHtml(report: any): string {
    const monthName = getMonthName(report.month);
    
    let subjectBreakdownHtml = '';
    if (report.subjectBreakdown && report.subjectBreakdown.length > 0) {
        subjectBreakdownHtml = `
            <h3 style="color: #334155; margin-top: 24px; margin-bottom: 12px;">Hours by Subject/Course</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f1f5f9;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Subject</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Course</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Hours</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.subjectBreakdown.map((item: ISubjectBreakdown) => `
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.subject}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.course || '-'}</td>
                            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">${item.hours.toFixed(1)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Monthly Teaching Hours Report</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Monthly Teaching Hours Report</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">${monthName} ${report.year}</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="margin-top: 0;">Dear ${report.staffName},</p>
            
            <p>Here is your teaching hours summary for <strong>${monthName} ${report.year}</strong>.</p>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h2 style="color: #1e40af; margin: 0 0 16px 0; font-size: 18px;">Summary</h2>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #64748b;">Report Period:</span>
                    <span style="font-weight: 600;">${formatDate(new Date(report.startDate))} - ${formatDate(new Date(report.endDate))}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 16px; border-radius: 8px; margin-top: 16px;">
                    <span style="color: rgba(255,255,255,0.9); font-size: 14px;">Total Teaching Hours</span>
                    <span style="color: white; font-size: 28px; font-weight: 700;">${report.totalHours.toFixed(1)}</span>
                </div>
            </div>
            
            ${subjectBreakdownHtml}
            
            <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
                This is an automated report generated on ${formatDate(new Date(report.generatedAt))}. 
                If you have any questions about this report, please contact your administrator.
            </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">Zero to Hero Education</p>
            <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
    </body>
    </html>
    `;
}

export async function sendMonthlyReportEmails(reports?: any[]) {
    await dbConnect();

    // If no reports provided, get all unsent reports for the previous month
    if (!reports) {
        const now = new Date();
        let targetMonth = now.getMonth();
        let targetYear = now.getFullYear();
        
        if (now.getMonth() === 0) {
            targetMonth = 12;
            targetYear = now.getFullYear() - 1;
        }

        reports = await MonthlyReport.find({
            month: targetMonth,
            year: targetYear,
            emailSentAt: { $exists: false }
        });
    }

    const settings = await Settings.findOne();
    const fromEmail = settings?.emailSettings?.fromEmail || process.env.FROM_EMAIL || 'Zero To Hero <onboarding@resend.dev>';

    const results = [];

    for (const report of reports) {
        try {
            const monthName = getMonthName(report.month);
            const subject = `Your Teaching Hours Report - ${monthName} ${report.year}`;
            const html = generateEmailHtml(report);

            const data = await resend.emails.send({
                from: `Zero To Hero <${fromEmail}>`,
                to: report.staffEmail,
                subject,
                html,
            });

            if (!data.error) {
                // Mark the report as email sent
                await MonthlyReport.findByIdAndUpdate(report._id, {
                    emailSentAt: new Date()
                });

                results.push({
                    success: true,
                    staffEmail: report.staffEmail,
                    reportId: report._id
                });
            } else {
                results.push({
                    success: false,
                    staffEmail: report.staffEmail,
                    error: data.error
                });
            }
        } catch (error: any) {
            console.error(`Error sending email to ${report.staffEmail}:`, error);
            results.push({
                success: false,
                staffEmail: report.staffEmail,
                error: error.message
            });
        }
    }

    return results;
}

export async function generateAndSendMonthlyReports(options: GenerateReportOptions = {}) {
    // Generate reports
    const reports = await generateMonthlyReports(options);
    
    // Send emails
    const emailResults = await sendMonthlyReportEmails(reports);
    
    return {
        reportsGenerated: reports.length,
        emailResults
    };
}
