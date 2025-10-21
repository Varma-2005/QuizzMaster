const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true,
        max: 24
    },
    timeLimit: {
        type: Number,
        required: true,
        max: 1200 // 20 minutes in seconds
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }],
        correctAnswer: {
            type: String,
            required: true
        }
    }],
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Quiz = mongoose.model('quiz', quizSchema)

module.exports = Quiz;