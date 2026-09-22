// Shared by the public feedback form, the API routes and the admin panel.
// Keep this file free of server-only imports so client components can use it too.

export const FEEDBACK_TYPES = ['general', 'suggestion', 'complaint', 'praise'] as const;
export const FEEDBACK_TOPICS = [
    'teaching',
    'courses',
    'schedule',
    'fees',
    'website',
    'other',
] as const;
export const FEEDBACK_STATUSES = ['new', 'in_review', 'planned', 'resolved', 'dismissed'] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];
export type FeedbackTopic = (typeof FEEDBACK_TOPICS)[number];
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const FEEDBACK_TYPE_LABELS: Record<FeedbackType, string> = {
    general: 'General',
    suggestion: 'Suggestion',
    complaint: 'Complaint',
    praise: 'Praise',
};

export const FEEDBACK_TOPIC_LABELS: Record<FeedbackTopic, string> = {
    teaching: 'Teaching & Tutors',
    courses: 'Courses & Material',
    schedule: 'Class Schedule',
    fees: 'Fees & Payments',
    website: 'Website & Portal',
    other: 'Other',
};

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
    new: 'New',
    in_review: 'In Review',
    planned: 'Planned',
    resolved: 'Resolved',
    dismissed: 'Dismissed',
};

// Indexed by rating - 1
export const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] as const;

export const FEEDBACK_LIMITS = {
    name: { min: 2, max: 100 },
    email: { max: 254 },
    subject: { min: 3, max: 150 },
    message: { min: 10, max: 2000 },
} as const;

export interface FeedbackInput {
    type: FeedbackType;
    topic: FeedbackTopic;
    rating?: number;
    subject: string;
    message: string;
    name: string;
    email: string;
}

export type FeedbackField = keyof FeedbackInput;
export type FeedbackErrors = Partial<Record<FeedbackField, string>>;

export type FeedbackValidationResult =
    | { success: true; data: FeedbackInput }
    | { success: false; errors: FeedbackErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
    return typeof value === 'string' && (options as readonly string[]).includes(value);
}

export function isFeedbackStatus(value: unknown): value is FeedbackStatus {
    return isOneOf(FEEDBACK_STATUSES, value);
}

function isValidRating(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
}

// Single-line fields: trim and collapse runs of whitespace (including newlines).
function cleanLine(value: unknown): string {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function lengthError(
    value: string,
    label: string,
    { min, max }: { min: number; max: number },
    emptyMessage: string,
): string | undefined {
    if (!value) return emptyMessage;
    if (value.length < min) return `${label} must be at least ${min} characters`;
    if (value.length > max) return `${label} must be ${max} characters or fewer`;
    return undefined;
}

export function validateFeedbackInput(input: unknown): FeedbackValidationResult {
    const body: Record<string, unknown> =
        typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {};

    const type = isOneOf(FEEDBACK_TYPES, body.type) ? body.type : null;
    const topic = isOneOf(FEEDBACK_TOPICS, body.topic) ? body.topic : null;
    const { rating } = body;
    const subject = cleanLine(body.subject);
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const name = cleanLine(body.name);
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    // Keys are in form order so the first error matches the first invalid field.
    const errors = Object.fromEntries(
        Object.entries({
            type: type ? undefined : 'Please choose a feedback type',
            rating:
                rating == null || isValidRating(rating)
                    ? undefined
                    : 'Rating must be a whole number from 1 to 5',
            topic: topic ? undefined : 'Please choose a topic',
            subject: lengthError(
                subject,
                'Subject',
                FEEDBACK_LIMITS.subject,
                'Please add a subject',
            ),
            message: lengthError(
                message,
                'Your message',
                FEEDBACK_LIMITS.message,
                'Please write your feedback',
            ),
            name: lengthError(name, 'Name', FEEDBACK_LIMITS.name, 'Please enter your name'),
            email: !email
                ? 'Please enter your email address'
                : email.length > FEEDBACK_LIMITS.email.max || !EMAIL_PATTERN.test(email)
                  ? 'Please enter a valid email address'
                  : undefined,
        }).filter(([, error]) => error),
    ) as FeedbackErrors;

    if (!type || !topic || Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    return {
        success: true,
        data: {
            type,
            topic,
            ...(isValidRating(rating) ? { rating } : {}),
            subject,
            message,
            name,
            email,
        },
    };
}
