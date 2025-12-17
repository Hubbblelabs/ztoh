import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    emailSettings: {
        fromEmail: {
            type: String,
            required: true,
            default: 'noreply@example.com'
        },
        adminEmail: {
            type: String,
            required: true,
            default: 'admin@example.com'
        }
    }
}, { timestamps: true });

// Prevent recompilation of model
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
