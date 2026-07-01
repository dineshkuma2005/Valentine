const mongoose = require('mongoose');

const valentineSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['BF', 'GF'],
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    partnerName: {
        type: String,
        required: true
    },
    partnerPhone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    questions: {
        type: [{
            question: { type: String, required: true },
            answer: { type: String, required: true },
            matchType: {
                type: String,
                enum: ['strict', 'case-insensitive'],
                default: 'case-insensitive'
            },
            photoId: String,
            photoViewLink: String
        }],
        validate: [v => Array.isArray(v) && v.length > 0, 'At least one question is required']
    },
    surprise: {
        message: String,
        songUrl: String,
        photoId: String, // Google Drive File ID
        photoViewLink: String, // WebViewLink
        finalNote: String
    },
    status: {
        type: String,
        enum: ['CREATED', 'LOCKED', 'OPENED'],
        default: 'LOCKED'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Valentine', valentineSchema);
