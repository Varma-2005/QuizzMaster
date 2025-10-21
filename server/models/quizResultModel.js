const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quiz',
        required: true
    },
    userAnswers: [{
        questionIndex: {
            type: Number,
            required: true
        },
        selectedOption: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    score: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true
    },
    aiExplanations: [{
        questionIndex: {
            type: Number,
            required: true
        },
        explanation: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true })

const QuizResult = mongoose.model('quizResult', quizResultSchema)

module.exports = QuizResult;