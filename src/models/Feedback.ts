import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    FEEDBACK_LIMITS,
    FEEDBACK_STATUSES,
    FEEDBACK_TOPICS,
    FEEDBACK_TYPES,
    type FeedbackStatus,
    type FeedbackTopic,
    type FeedbackType,
} from '@/lib/feedback';

export interface IFeedback extends Document {
    type: FeedbackType;
    topic: FeedbackTopic;
    rating?: number;
    subject: string;
    message: string;
    name: string;
    email: string;
    status: FeedbackStatus;
    trackingId: string;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
    {
        type: { type: String, required: true, enum: FEEDBACK_TYPES },
        topic: { type: String, required: true, enum: FEEDBACK_TOPICS },
        rating: { type: Number, min: 1, max: 5 },
        subject: { type: String, required: true, maxlength: FEEDBACK_LIMITS.subject.max },
        message: { type: String, required: true, maxlength: FEEDBACK_LIMITS.message.max },
        name: { type: String, required: true, maxlength: FEEDBACK_LIMITS.name.max },
        email: { type: String, required: true, maxlength: FEEDBACK_LIMITS.email.max },
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
