import mongoose from 'mongoose';

const VerificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '10m' }, // Automatically delete documents after 10 minutes
    },
}, { timestamps: true });

// Prevent recompilation of model
const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema);

export default VerificationCode;
