import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function verifyAuth() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }

    // Default to checking for admin role as the original function did
    if (session.user.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    return session.user;
}

export async function verifyStaffAuth() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }

    if (session.user.role !== 'staff' && session.user.role !== 'admin') {
         throw new Error('Unauthorized');
    }

    return session.user;
}
