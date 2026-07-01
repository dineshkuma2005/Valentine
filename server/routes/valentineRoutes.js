const express = require('express');
const router = express.Router();
const multer = require('multer');
const { nanoid } = require('nanoid');
const Valentine = require('../models/Valentine');
const { uploadFileToDrive } = require('../utils/driveService');

// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper to generate short ID
const generateId = () => {
    return Math.random().toString(36).substring(2, 8);
};

// CREATE a new Valentine Surprise
router.post('/create', upload.any(), async (req, res) => {
    try {
        const { role, creatorName, partnerName, partnerPhone, questions: questionsStr, message, songUrl, finalNote } = req.body;
        const questions = JSON.parse(questionsStr);

        let photoId = '';
        let photoViewLink = '';

        const files = req.files || [];

        // 1. Main surprise photo
        const mainPhoto = files.find(f => f.fieldname === 'photo');
        if (mainPhoto) {
            console.log('Uploading main photo to Drive...');
            const driveResponse = await uploadFileToDrive(mainPhoto);
            if (driveResponse) {
                photoId = driveResponse.id;
                photoViewLink = driveResponse.webViewLink;
            }
        }

        // 2. Question photos
        for (let i = 0; i < questions.length; i++) {
            const qFile = files.find(f => f.fieldname === `questionPhoto_${i}`);
            if (qFile) {
                console.log(`Uploading photo for question ${i} to Drive...`);
                const driveResponse = await uploadFileToDrive(qFile);
                if (driveResponse) {
                    questions[i].photoId = driveResponse.id;
                    questions[i].photoViewLink = driveResponse.webViewLink;
                }
            }
        }

        const newValentine = new Valentine({
            id: generateId(),
            role,
            creatorName,
            partnerName,
            partnerPhone,
            questions,
            surprise: {
                message,
                songUrl,
                photoId,
                photoViewLink,
                finalNote
            }
        });

        await newValentine.save();
        res.status(201).json({ success: true, id: newValentine.id, link: `/valentine/${newValentine.id}` });

    } catch (error) {
        console.error('Error creating Valentine:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// GET Public Info (for Receiver)
router.get('/:id', async (req, res) => {
    try {
        const valentine = await Valentine.findOne({ id: req.params.id });
        if (!valentine) return res.status(404).json({ success: false, message: 'Not Found' });

        // Return only non-sensitive info
        res.json({
            success: true,
            creatorName: valentine.creatorName,
            partnerName: valentine.partnerName,
            role: valentine.role,
            questions: valentine.questions.map(q => ({
                _id: q._id,
                question: q.question,
                photoViewLink: q.photoViewLink,
                matchType: q.matchType
            }))
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// UNLOCK Surprise (Verify Answers)
router.post('/unlock', async (req, res) => {
    try {
        const { id, answers } = req.body; // answers: { questionId: userAnswer }
        const valentine = await Valentine.findOne({ id });
        if (!valentine) return res.status(404).json({ success: false, message: 'Not Found' });

        let allCorrect = true;

        valentine.questions.forEach(q => {
            const userAnswer = answers[q._id];
            const correctAnswer = q.answer;

            if (!userAnswer) {
                allCorrect = false;
                return;
            }

            if (q.matchType === 'strict') {
                if (userAnswer.trim() !== correctAnswer.trim()) allCorrect = false;
            } else {
                if (userAnswer.trim().toLowerCase() !== correctAnswer.trim().toLowerCase()) allCorrect = false;
            }
        });

        if (allCorrect) {
            valentine.status = 'OPENED';
            await valentine.save();
            res.json({ success: true, surprise: valentine.surprise });
        } else {
            res.json({ success: false, message: 'Incorrect answers. Try again!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
