
const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

module.exports = connectDB;


// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB_NAME;