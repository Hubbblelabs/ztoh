import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    ACADEMIC_SUPPORT,
    COMPETITIVE_EXAMS,
    CURRICULUMS,
    FEEDBACK_LIMITS,
    FEEDBACK_NEEDS,
    FEEDBACK_STATUSES,
    JOB_TYPES,
    REGISTRATION_TYPES,
    type FeedbackInput,
    type FeedbackStatus,
} from '@/lib/feedback';

export interface IFeedback extends Document, FeedbackInput {
    status: FeedbackStatus;
    trackingId: string;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
    {
        registrationType: { type: String, required: true, enum: REGISTRATION_TYPES },
        name: { type: String, required: true, maxlength: FEEDBACK_LIMITS.name.max },
        phone: { type: String, required: true, maxlength: FEEDBACK_LIMITS.phone.max },
        alternativePhone: { type: String, maxlength: FEEDBACK_LIMITS.phone.max },
        whatsapp: { type: String, required: true, maxlength: FEEDBACK_LIMITS.phone.max },
        email: { type: String, required: true, maxlength: FEEDBACK_LIMITS.email.max },
        address: { type: String, maxlength: FEEDBACK_LIMITS.address.max },
        needs: [{ type: String, enum: FEEDBACK_NEEDS }],
        curriculums: [{ type: String, enum: CURRICULUMS }],
        exams: [{ type: String, enum: COMPETITIVE_EXAMS }],
        academicSupport: [{ type: String, enum: ACADEMIC_SUPPORT }],
        jobTypes: [{ type: String, enum: JOB_TYPES }],
        partnershipInterest: { type: Boolean },
        productDemoInterest: { type: Boolean },
        // Indexed for the "new feedback" count shown in the admin sidebar
        status: { type: String, enum: FEEDBACK_STATUSES, default: 'new', index: true },
        trackingId: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    },
);

const Feedback: Model<IFeedback> =
    mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
