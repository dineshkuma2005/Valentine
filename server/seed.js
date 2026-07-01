const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Code = require('./models/Code');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/valentine-app')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        await Code.deleteMany({}); // Clear existing

        const createdCode = await Code.create({
            code: 'LOVE123',
            surpriseType: 'text',
            content: 'Happy Valentine\'s Day! You are the CSS to my HTML. ❤️'
        });

        console.log('Seed Data Created:', createdCode);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
