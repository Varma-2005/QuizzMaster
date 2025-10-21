const exp = require('express');
const quizResultApp = exp.Router();
const QuizResult = require("../models/quizResultModel");
const UserProgress = require("../models/userProgressModel");
const geminiService = require("../services/geminiService");
const expressAsyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

// Submit quiz result with AI explanations
quizResultApp.post("/submit", expressAsyncHandler(async (req, res) => {
    const { userId, quizId, userAnswers, score, percentage, timeTaken, questions, subject } = req.body;
    
    // Validate required fields
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ message: "Valid userId is required" });
    }
    
    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).send({ message: "Valid quizId is required" });
    }
    
    if (!Array.isArray(userAnswers)) {
        return res.status(400).send({ message: "userAnswers array is required" });
    }
    
    if (score === undefined || percentage === undefined) {
        return res.status(400).send({ message: "score and percentage are required" });
    }
    
    // Generate AI content in parallel
    const [aiExplanations, aiFeedback] = await Promise.allSettled([
        questions && userAnswers ? geminiService.generateExplanations(questions, userAnswers) : Promise.resolve([]),
        geminiService.generateFeedback(
            { score, percentage, timeSpent: timeTaken, totalQuestions: questions?.length || userAnswers.length },
            subject
        )
    ]).then(results => [
        results[0].status === 'fulfilled' ? results[0].value : [],
        results[1].status === 'fulfilled' ? results[1].value : 'Great effort! Keep practicing to improve your skills.'
    ]);
    
    // Save quiz result
    const savedResult = await new QuizResult({
        userId,
        quizId,
        userAnswers,
        score,
        percentage,
        timeTaken,
        aiExplanations
    }).save();
    
    // Update user progress
    try {
        const userProgress = await UserProgress.findOne({ userId });
        
        if (userProgress) {
            userProgress.totalQuizzes += 1;
            userProgress.totalScore += score;
            userProgress.averageScore = userProgress.totalScore / userProgress.totalQuizzes;
            userProgress.lastQuizDate = new Date();
            await userProgress.save();
        } else {
            await new UserProgress({
                userId,
                totalQuizzes: 1,
                totalScore: score,
                averageScore: score,
                lastQuizDate: new Date()
            }).save();
        }
    } catch (error) {
        // Continue even if progress update fails
    }
    
    res.status(201).send({ 
        message: "Quiz result submitted successfully", 
        success: true,
        payload: {
            result: savedResult,
            aiFeedback
        }
    });
}));

// Get quiz result by ID
quizResultApp.get("/:resultId", expressAsyncHandler(async (req, res) => {
    const { resultId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
        return res.status(400).send({ message: "Valid resultId is required" });
    }
    
    const result = await QuizResult.findById(resultId)
        .populate('userId', 'firstName lastName')
        .populate('quizId');
    
    if (!result) {
        return res.status(404).send({ message: "Quiz result not found" });
    }
    
    res.status(200).send({ 
        message: "Quiz result retrieved successfully", 
        payload: result 
    });
}));

// Get user's quiz results
quizResultApp.get("/user/:userId", expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ message: "Valid userId is required" });
    }
    
    const results = await QuizResult.find({ userId })
        .populate('quizId')
        .sort({ createdAt: -1 });
    
    res.status(200).send({ 
        message: "User quiz results retrieved successfully", 
        payload: results 
    });
}));

module.exports = quizResultApp;