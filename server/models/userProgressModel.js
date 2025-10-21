const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    totalQuizzes: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    subjectProgress: [{
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject'
        },
        quizzesTaken: {
            type: Number,
            default: 0
        },
        bestScore: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        }
    }],
    lastQuizDate: {
        type: Date
    }
}, { timestamps: true })

const UserProgress = mongoose.model('userProgress', userProgressSchema)

module.exports = UserProgress;