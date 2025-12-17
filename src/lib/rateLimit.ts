import mongoose from 'mongoose';
import connectDB from '@/lib/db';

// Simple schema for rate limiting
const RateLimitSchema = new mongoose.Schema({
    identifier: { type: String, required: true, unique: true }, // e.g., IP address or email
    count: { type: Number, default: 0 },
    resetAt: { type: Date, required: true },
});

const RateLimit = mongoose.models.RateLimit || mongoose.model('RateLimit', RateLimitSchema);

/**
 * Checks if a request is allowed based on rate limits.
 * @param identifier Unique identifier for the client (e.g., IP address)
 * @param limit Max number of requests allowed
 * @param windowMs Time window in milliseconds
 * @returns {Promise<boolean>} True if allowed, False if limit exceeded
 */
export async function checkRateLimit(identifier: string, limit: number, windowMs: number): Promise<boolean> {
    try {
        await connectDB();

        const now = new Date();
        let record = await RateLimit.findOne({ identifier });

        if (!record) {
            // New record
            await RateLimit.create({
                identifier,
                count: 1,
                resetAt: new Date(now.getTime() + windowMs),
            });
            return true;
        }

        if (now > record.resetAt) {
            // Window expired, reset
            record.count = 1;
            record.resetAt = new Date(now.getTime() + windowMs);
            await record.save();
            return true;
        }

        if (record.count < limit) {
            // Within limit
            record.count += 1;
            await record.save();
            return true;
        }

        // Limit exceeded
        return false;

    } catch (error) {
        console.error("Rate limit error:", error);
        // Fail open (allow request) if rate limiter fails, to avoid blocking legitimate users due to DB errors
        return true;
    }
}
