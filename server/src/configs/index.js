const connectDB = require('./databaseConnection');
const { getGeminiAiResponse } = require('./aiClient');

module.exports={
    connectDB:connectDB,
    getGeminiAiResponse:getGeminiAiResponse
}