const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

interface TurnstileVerifyResponse {
    success: boolean;
    "error-codes"?: string[];
    challenge_ts?: string;
    hostname?: string;
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
    if (!TURNSTILE_SECRET_KEY) {
        console.error("TURNSTILE_SECRET_KEY is not defined");
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('secret', TURNSTILE_SECRET_KEY);
        formData.append('response', token);

        const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const outcome: TurnstileVerifyResponse = await result.json();

        if (!outcome.success) {
            console.error("Turnstile verification failed:", outcome["error-codes"]);
        }

        return outcome.success;
    } catch (error) {
        console.error("Error verifying Turnstile token:", error);
        return false;
    }
}
