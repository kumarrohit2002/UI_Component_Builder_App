const mongoose = require('mongoose');
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/mydatabase';


const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully---> 🟢\n');
    } catch (error) {
        console.error('Issue in Database Connection---> 🔴\n', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;