const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    surpriseType: {
        type: String,
        enum: ['text', 'image', 'video'],
        default: 'text'
    },
    content: {
        type: String, // URL or text content
        required: true
    },
    isRedeemed: {
        type: Boolean,
        default: false
    },
    redeemedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Code', CodeSchema);
