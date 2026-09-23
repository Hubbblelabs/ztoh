// Shared by the public feedback form, the API routes and the admin panel.
// Keep this file free of server-only imports so client components can use it too.

export const REGISTRATION_TYPES = ['student', 'parent', 'teacher', 'institution'] as const;
export const FEEDBACK_NEEDS = ['demo', 'enquiry', 'faculty_support', 'product'] as const;
export const CURRICULUMS = [
    'cbse',
    'state_board',
    'igcse',
    'ib',
    'myp',
    'as_a_level',
    'ap',
    'isc',
] as const;
export const COMPETITIVE_EXAMS = [
    'jee',
    'neet',
    'sat',
    'clat',
    'gre',
    'cat',
    'tancet',
    'deemed_university',
] as const;
export const ACADEMIC_SUPPORT = [
    'lesson_plan',
    'test_series',
    'question_papers',
    'faculty_support',
    'product_support',
] as const;
export const JOB_TYPES = ['full_time', 'part_time'] as const;
export const FEEDBACK_STATUSES = [
    'new',
    'contacted',
    'no_answer',
    'follow_up',
    'converted',
    'not_interested',
] as const;

export type RegistrationType = (typeof REGISTRATION_TYPES)[number];
export type FeedbackNeed = (typeof FEEDBACK_NEEDS)[number];
export type Curriculum = (typeof CURRICULUMS)[number];
export type CompetitiveExam = (typeof COMPETITIVE_EXAMS)[number];
export type AcademicSupport = (typeof ACADEMIC_SUPPORT)[number];
export type JobType = (typeof JOB_TYPES)[number];
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const REGISTRATION_TYPE_LABELS: Record<RegistrationType, string> = {
    student: 'Student',
    parent: 'Parent',
    teacher: 'Teacher',
    institution: 'Institution or Company',
};

export const NEED_LABELS: Record<FeedbackNeed, string> = {
    demo: 'Demo',
    enquiry: 'Enquiry',
    faculty_support: 'Faculty support',
    product: 'Product or software',
};

export const CURRICULUM_LABELS: Record<Curriculum, string> = {
    cbse: 'CBSE',
    state_board: 'State Board',
    igcse: 'IGCSE',
    ib: 'IB',
    myp: 'MYP',
    as_a_level: 'AS & A Level',
    ap: 'AP',
    isc: 'ISC',
};

export const EXAM_LABELS: Record<CompetitiveExam, string> = {
    jee: 'JEE',
    neet: 'NEET',
    sat: 'SAT',
    clat: 'CLAT',
    gre: 'GRE',
    cat: 'CAT',
    tancet: 'TANCET',
    deemed_university: 'Deemed university entrance exam',
};

export const ACADEMIC_SUPPORT_LABELS: Record<AcademicSupport, string> = {
    lesson_plan: 'Lesson plan',
    test_series: 'Test series',
    question_papers: 'Question paper arrangement',
    faculty_support: 'Faculty support',
    product_support: 'Product or software support',
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
    full_time: 'Full time',
    part_time: 'Part time',
};

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
    new: 'New',
    contacted: 'Contacted',
    no_answer: 'No Answer',
    follow_up: 'Follow-up',
    converted: 'Converted',
    not_interested: 'Not Interested',
};

export const FEEDBACK_LIMITS = {
    name: { min: 2, max: 100 },
    phone: { max: 20 },
    email: { max: 254 },
    address: { max: 500 },
} as const;

export interface FeedbackInput {
    registrationType: RegistrationType;
    name: string;
    phone: string;
    alternativePhone?: string;
    whatsapp: string;
    email: string;
    address?: string;
    needs: FeedbackNeed[];
    curriculums: Curriculum[];
    exams: CompetitiveExam[];
    academicSupport: AcademicSupport[];
    // Only asked of teachers; empty when they aren't looking for a job
    jobTypes: JobType[];
    // Only asked of institutions
    partnershipInterest?: boolean;
    productDemoInterest?: boolean;
}

export type FeedbackField = keyof FeedbackInput;
export type FeedbackErrors = Partial<Record<FeedbackField, string>>;

export type FeedbackValidationResult =
    { success: true; data: FeedbackInput } | { success: false; errors: FeedbackErrors };

// Short labels for the admin panel and the notification email
export const FEEDBACK_FIELD_LABELS: Record<FeedbackField, string> = {
    registrationType: 'Registration Type',
    name: 'Name',
    phone: 'Phone',
    alternativePhone: 'Alternative Number',
    whatsapp: 'WhatsApp',
    email: 'Email',
    address: 'Address',
    needs: 'Need',
    curriculums: 'Curriculum & Board Support',
    exams: 'Competitive Exam Support',
    academicSupport: 'Academic Support',
    jobTypes: 'Looking for a Teaching Job',
    partnershipInterest: 'Partnership Support',
    productDemoInterest: 'Product Demo',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARACTERS = /^\+?[\d\s()-]+$/;
const INVALID_CHOICE = 'Please choose from the listed options';

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
    return typeof value === 'string' && (options as readonly string[]).includes(value);
}

export function isFeedbackStatus(value: unknown): value is FeedbackStatus {
    return isOneOf(FEEDBACK_STATUSES, value);
}

// Multi-select answers: known options only, deduplicated and kept in the form's order.
// Returns null when the value isn't a list of known options.
function parseOptions<T extends string>(options: readonly T[], value: unknown): T[] | null {
    if (value == null) return [];
    if (!Array.isArray(value) || !value.every((item) => isOneOf(options, item))) return null;
    return options.filter((option) => value.includes(option));
}

// Yes/no questions are optional, so an unanswered one is null or missing.
function isYesNo(value: unknown): value is boolean | null | undefined {
    return value == null || typeof value === 'boolean';
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

// Accepts local and international formats: 10 to 15 digits with an optional leading +,
// and spaces, dashes or brackets between them.
function phoneError(value: string, emptyMessage?: string): string | undefined {
    if (!value) return emptyMessage;
    const digitCount = value.replace(/\D/g, '').length;
    const isValid =
        value.length <= FEEDBACK_LIMITS.phone.max &&
        PHONE_CHARACTERS.test(value) &&
        digitCount >= 10 &&
        digitCount <= 15;
    return isValid ? undefined : 'Please enter a valid phone number';
}

export function validateFeedbackInput(input: unknown): FeedbackValidationResult {
    const body: Record<string, unknown> =
        typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {};

    const registrationType = isOneOf(REGISTRATION_TYPES, body.registrationType)
        ? body.registrationType
        : null;
    const name = cleanLine(body.name);
    const phone = cleanLine(body.phone);
    const alternativePhone = cleanLine(body.alternativePhone);
    const whatsapp = cleanLine(body.whatsapp);
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const address = typeof body.address === 'string' ? body.address.trim() : '';
    const needs = parseOptions(FEEDBACK_NEEDS, body.needs);
    const curriculums = parseOptions(CURRICULUMS, body.curriculums);
    const exams = parseOptions(COMPETITIVE_EXAMS, body.exams);
    const academicSupport = parseOptions(ACADEMIC_SUPPORT, body.academicSupport);
    const jobTypes = parseOptions(JOB_TYPES, body.jobTypes);
    const { partnershipInterest, productDemoInterest } = body;

    // Keys are in form order so the first error matches the first invalid field.
    const errors = Object.fromEntries(
        Object.entries({
            registrationType: registrationType ? undefined : 'Please choose a registration type',
            name: lengthError(name, 'Name', FEEDBACK_LIMITS.name, 'Please enter your name'),
            phone: phoneError(phone, 'Please enter your phone number'),
            alternativePhone: phoneError(alternativePhone),
            whatsapp: phoneError(whatsapp, 'Please enter your WhatsApp number'),
            email: !email
                ? 'Please enter your email address'
                : email.length > FEEDBACK_LIMITS.email.max || !EMAIL_PATTERN.test(email)
                  ? 'Please enter a valid email address'
                  : undefined,
            address:
                address.length > FEEDBACK_LIMITS.address.max
                    ? `Address must be ${FEEDBACK_LIMITS.address.max} characters or fewer`
                    : undefined,
            needs: !needs
                ? INVALID_CHOICE
                : needs.length === 0
                  ? 'Please choose at least one option'
                  : undefined,
            curriculums: curriculums ? undefined : INVALID_CHOICE,
            exams: exams ? undefined : INVALID_CHOICE,
            academicSupport: academicSupport ? undefined : INVALID_CHOICE,
            jobTypes: jobTypes ? undefined : INVALID_CHOICE,
            partnershipInterest: isYesNo(partnershipInterest)
                ? undefined
                : 'Please answer yes or no',
            productDemoInterest: isYesNo(productDemoInterest)
                ? undefined
                : 'Please answer yes or no',
        }).filter(([, error]) => error),
    ) as FeedbackErrors;

    if (
        !registrationType ||
        !needs ||
        !curriculums ||
        !exams ||
        !academicSupport ||
        !jobTypes ||
        Object.keys(errors).length > 0
    ) {
        return { success: false, errors };
    }

    return {
        success: true,
        data: {
            registrationType,
            name,
            phone,
            ...(alternativePhone ? { alternativePhone } : {}),
            whatsapp,
            email,
            ...(address ? { address } : {}),
            needs,
            curriculums,
            exams,
            academicSupport,
            // The form only shows these questions for the matching registration type, so drop
            // answers left behind after switching to another type.
            jobTypes: registrationType === 'teacher' ? jobTypes : [],
            ...(registrationType === 'institution' && typeof partnershipInterest === 'boolean'
                ? { partnershipInterest }
                : {}),
            ...(typeof productDemoInterest === 'boolean' ? { productDemoInterest } : {}),
        },
    };
}
