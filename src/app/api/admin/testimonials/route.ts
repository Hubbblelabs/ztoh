import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await verifyAuth();
        await dbConnect();
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await verifyAuth();
        await dbConnect();
        const body = await request.json();
        const testimonial = await Testimonial.create(body);
        return NextResponse.json(testimonial, { status: 201 });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
