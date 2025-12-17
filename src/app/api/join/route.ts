import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JoinRequest from '@/models/JoinRequest';
import { Resend } from 'resend';
import { verifyTurnstileToken } from '@/lib/turnstile';
import Settings from '@/models/Settings';
import { checkRateLimit } from '@/lib/rateLimit';
import { generateTrackingId } from '@/lib/utils';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const {
            type, email, name, gender, mobile, address,
            // Student fields
            applyingAs, currentStatus, gradeYear, boardUniversity, subjectDetails, modeOfStudy,
            // Teacher fields
            qualification, nationality, state, city, currentJobDetails, experience, subjectWillingToHandle, modeOfTutoring, workType,
            token
        } = body;

        // Rate Limiting: 5 requests per hour per IP
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const isAllowed = await checkRateLimit(`join_${ip}`, 5, 60 * 60 * 1000);

        if (!isAllowed) {
            return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        // Verify Turnstile Token
        if (token) {
            const isVerified = await verifyTurnstileToken(token);
            if (!isVerified) {
                return NextResponse.json({ success: false, error: 'Invalid captcha token' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ success: false, error: 'Captcha token is required' }, { status: 400 });
        }

        // 1. Validate Common Fields
        if (!type || !['student', 'teacher'].includes(type)) {
            return NextResponse.json({ success: false, error: 'Invalid or missing user type' }, { status: 400 });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
        }
        if (!name || name.trim().length < 2) {
            return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
        }
        if (!gender) {
            return NextResponse.json({ success: false, error: 'Gender is required' }, { status: 400 });
        }
        if (!mobile || !/^\+?[\d\s-]{10,15}$/.test(mobile)) { // Allow international formats
            return NextResponse.json({ success: false, error: 'Valid mobile number is required' }, { status: 400 });
        }
        if (!address || address.trim().length < 5) {
            return NextResponse.json({ success: false, error: 'Address is required' }, { status: 400 });
        }

        // 2. Validate Type-Specific Fields
        if (type === 'student') {
            const missingFields = [];
            if (!applyingAs) missingFields.push('Applying As');
            if (!currentStatus) missingFields.push('Current Status');
            if (!gradeYear) missingFields.push('Grade/Year');
            if (!boardUniversity) missingFields.push('Board/University');
            if (!subjectDetails) missingFields.push('Subject Details');
            if (!modeOfStudy) missingFields.push('Mode of Study');

            if (missingFields.length > 0) {
                return NextResponse.json({
                    success: false,
                    error: `Missing required fields for student: ${missingFields.join(', ')}`
                }, { status: 400 });
            }
        } else if (type === 'teacher') {
            const missingFields = [];
            if (!qualification) missingFields.push('Qualification');
            if (!nationality) missingFields.push('Nationality');
            if (!state) missingFields.push('State');
            if (!city) missingFields.push('City');
            if (!currentJobDetails) missingFields.push('Current Job Details');
            if (!experience) missingFields.push('Experience');
            if (!subjectWillingToHandle) missingFields.push('Subject Willing to Handle');
            if (!modeOfTutoring) missingFields.push('Mode of Tutoring');
            if (!workType) missingFields.push('Work Type');

            if (missingFields.length > 0) {
                return NextResponse.json({
                    success: false,
                    error: `Missing required fields for teacher: ${missingFields.join(', ')}`
                }, { status: 400 });
            }
        }

        const joinRequest = new JoinRequest({
            ...body,
            trackingId: generateTrackingId('join')
        });
        await joinRequest.save();

        // Send email notification
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);

                // Format details for email
                const detailsHtml = Object.entries(body)
                    .filter(([key]) => key !== 'type' && key !== 'name' && key !== 'email' && key !== 'token')
                    .map(([key, value]) => `<p><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</p>`)
                    .join('');

                const settings = await Settings.findOne();
                const adminEmail = settings?.emailSettings?.adminEmail || process.env.ADMIN_EMAIL;
                const fromEmail = settings?.emailSettings?.fromEmail || process.env.FROM_EMAIL;

                if (!adminEmail || !fromEmail) {
                    console.warn("ADMIN_EMAIL or FROM_EMAIL not set in .env");
                    // We continue to return success even if email fails, as the data is saved.
                } else {
                    // Send email to Admin
                    await resend.emails.send({
                        from: `Zero To Hero <${fromEmail}>`,
                        to: adminEmail,
                        subject: `New ${type === 'student' ? 'Student' : 'Teacher'} Application: ${name}`,
                        html: `
                        <h3>New ${type === 'student' ? 'Student' : 'Teacher'} Application</h3>
                        <p><strong>Tracking Number:</strong> ${joinRequest.trackingId}</p>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Type:</strong> ${type}</p>
                        <hr>
                        <h4>Details:</h4>
                        ${detailsHtml}
                    `,
                    });

                    // Send acknowledgement email to User
                    await resend.emails.send({
                        from: `Zero To Hero <${fromEmail}>`,
                        to: email,
                        subject: `Application Received - Zero to Hero`,
                        html: `
                        <h3>Hi ${name},</h3>
                        <p>Thank you for applying to join <strong>Zero to Hero</strong> as a ${type}.</p>
                        <p>We have received your application and our team will review it shortly.</p>
                        <p>Your tracking number is: <strong>${joinRequest.trackingId}</strong></p>
                        <br>
                        <p>Best regards,</p>
                        <p>The Zero to Hero Team</p>
                    `,
                    });
                }

            } catch (emailError) {
                console.error("Error sending email:", emailError);
            }
        }

        return NextResponse.json({ success: true, data: joinRequest }, { status: 201 });
    } catch (error) {
        console.error('Error submitting join request:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit request' }, { status: 500 });
    }
}
