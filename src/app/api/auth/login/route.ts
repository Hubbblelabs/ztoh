import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import Staff from '@/models/Staff';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Try admin first
        const admin = await Admin.findOne({ email });
        if (admin) {
            const isMatch = await admin.comparePassword(password);
            if (isMatch) {
                const token = await signToken({ 
                    id: admin._id.toString(), 
                    email: admin.email,
                    role: 'admin'
                });

                const response = NextResponse.json({ 
                    success: true, 
                    role: 'admin',
                    redirect: '/admin'
                });
                
                response.cookies.set('authToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                });

                return response;
            }
        }

        // Try staff
        const staff = await Staff.findOne({ email, isActive: true });
        if (staff) {
            const isMatch = await staff.comparePassword(password);
            if (isMatch) {
                const token = await signToken({ 
                    id: staff._id.toString(), 
                    email: staff.email,
                    role: 'staff'
                });

                const response = NextResponse.json({ 
                    success: true, 
                    role: 'staff',
                    redirect: '/staff'
                });
                
                response.cookies.set('authToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                });

                return response;
            }
        }

        // No match found
        return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
        );

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
