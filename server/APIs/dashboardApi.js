const exp = require('express');
const dashboardApp = exp.Router();
const UserProgress = require("../models/userProgressModel");
const QuizResult = require("../models/quizResultModel");
const expressAsyncHandler = require("express-async-handler");

// Get user dashboard data
dashboardApp.get("/:userId", expressAsyncHandler(async (req, res) => {
    const [userProgress, recentResults] = await Promise.all([
        UserProgress.findOne({ userId: req.params.userId })
            .populate('subjectProgress.subjectId', 'name fullName'),
        QuizResult.find({ userId: req.params.userId })
            .populate('quizId')
            .sort({ createdAt: -1 })
            .limit(5)
    ]);
    
    res.status(200).send({ 
        message: "Dashboard data", 
        payload: { progress: userProgress, recentResults } 
    });
}));

// Update subject progress
dashboardApp.put("/update-subject/:userId", expressAsyncHandler(async (req, res) => {
    const { subjectId, score } = req.body;
    const userProgress = await UserProgress.findOne({ userId: req.params.userId });
    
    const subjectProgress = userProgress.subjectProgress.find(
        sp => sp.subjectId.toString() === subjectId
    );
    
    if (subjectProgress) {
        const prevTotal = subjectProgress.averageScore * (subjectProgress.quizzesTaken - 1);
        subjectProgress.quizzesTaken += 1;
        subjectProgress.bestScore = Math.max(subjectProgress.bestScore, score);
        subjectProgress.averageScore = (prevTotal + score) / subjectProgress.quizzesTaken;
    } else {
        userProgress.subjectProgress.push({
            subjectId,
            quizzesTaken: 1,
            bestScore: score,
            averageScore: score
        });
    }
    
    await userProgress.save();
    res.status(200).send({ message: "Subject progress updated", payload: userProgress });
}));

module.exports = dashboardApp;