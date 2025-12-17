import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactRequest extends Document {
    name: string;
    email: string;
    message: string;
    trackingId: string;
    status: 'pending' | 'accepted' | 'declined';
    teleCallingStatus: 'pending' | 'called' | 'no_answer' | 'follow_up_needed' | 'converted' | 'not_interested';
    notes: { content: string; createdAt: Date }[];
    history: { action: string; details: string; performedBy: string; timestamp: Date }[];
    createdAt: Date;
}

const ContactRequestSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    trackingId: { type: String, unique: true },
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
if (mongoose.models.ContactRequest) {
    delete mongoose.models.ContactRequest;
}

const ContactRequest: Model<IContactRequest> = mongoose.model<IContactRequest>('ContactRequest', ContactRequestSchema);

export default ContactRequest;
