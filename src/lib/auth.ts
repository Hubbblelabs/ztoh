import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key-change-this-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export async function verifyAuth(request: Request) {
    const cookieStore = await cookies();
    let token = cookieStore.get('adminToken')?.value;

    // Also check for unified authToken if adminToken is missing
    if (!token) {
        token = cookieStore.get('authToken')?.value;
    }

    if (!token) {
        throw new Error('Unauthorized');
    }

    const payload = await verifyToken(token);

    if (!payload) {
        throw new Error('Unauthorized');
    }

    // If using unified token, ensure role is admin
    if (payload.role && payload.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    return payload;
}
