const router = require('express').Router();
const Code = require('../models/Code');

// @route   POST /api/verify
// @desc    Verify a code
// @access  Public
router.post('/', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: 'Please enter a code' });
    }

    try {
        const validCode = await Code.findOne({ code: code });

        if (!validCode) {
            return res.status(400).json({ success: false, message: 'Invalid code' });
        }

        // Optional: Check if already redeemed
        // if (validCode.isRedeemed) {
        //   return res.status(400).json({ success: false, message: 'Code already redeemed' });
        // }

        res.json({
            success: true,
            surpriseType: validCode.surpriseType,
            content: validCode.content
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
