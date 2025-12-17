import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJoinRequest extends Document {
    type: 'student' | 'teacher';
    // Common fields
    email: string;
    name: string;
    gender: string;
    mobile: string;
    address: string;

    // Student specific
    applyingAs?: string;
    currentStatus?: string;
    gradeYear?: string;
    boardUniversity?: string;
    subjectDetails?: string;
    modeOfStudy?: string;
    specificNeeds?: string;

    // Teacher specific
    qualification?: string;
    nationality?: string;
    state?: string;
    city?: string;
    currentJobDetails?: string;
    experience?: string;
    subjectWillingToHandle?: string;
    modeOfTutoring?: string;
    workType?: string;

    status: 'pending' | 'accepted' | 'declined';
    teleCallingStatus: 'pending' | 'called' | 'no_answer' | 'follow_up_needed' | 'converted' | 'not_interested';
    notes: { content: string; createdAt: Date }[];
    history: { action: string; details: string; performedBy: string; timestamp: Date }[];

    createdAt: Date;
    trackingId: string;
}

const JoinRequestSchema: Schema = new Schema({
    type: { type: String, required: true, enum: ['student', 'teacher'] },
    email: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    trackingId: { type: String, unique: true },

    // Student
    applyingAs: { type: String },
    currentStatus: { type: String },
    gradeYear: { type: String },
    boardUniversity: { type: String },
    subjectDetails: { type: String },
    modeOfStudy: { type: String },
    specificNeeds: { type: String },

    // Teacher
    qualification: { type: String },
    nationality: { type: String },
    state: { type: String },
    city: { type: String },
    currentJobDetails: { type: String },
    experience: { type: String },
    subjectWillingToHandle: { type: String },
    modeOfTutoring: { type: String },
    workType: { type: String },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    teleCallingStatus: {
        type: String,
        enum: ['pending', 'called', 'no_answer', 'follow_up_needed', 'converted', 'not_interested'],
        default: 'pending'
    },
    notes: [{
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    history: [{
        action: String,
        details: String,
        performedBy: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true,
});

// Force recompilation if schema changed (for dev)
if (mongoose.models.JoinRequest) {
    delete mongoose.models.JoinRequest;
}

const JoinRequest: Model<IJoinRequest> = mongoose.model<IJoinRequest>('JoinRequest', JoinRequestSchema);

export default JoinRequest;
