const exp = require('express');
const quizApp = exp.Router(); 
const Quiz = require("../models/quizModel");
const expressAsyncHandler = require("express-async-handler");

// Create new quiz
quizApp.post("/create", expressAsyncHandler(async (req, res) => {
    const { userId, subjectId, difficulty, totalQuestions, timeLimit, questions } = req.body;
    
    const savedQuiz = await new Quiz({
        userId,
        subjectId,
        difficulty,
        totalQuestions,
        timeLimit,
        questions
    }).save();
    
    res.status(201).send({ message: "Quiz created", payload: savedQuiz });
}));

// Get quiz by ID
quizApp.get("/:quizId", expressAsyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId)
        .populate('userId', 'firstName lastName')
        .populate('subjectId', 'name fullName');
    
    res.status(200).send({ message: "Quiz details", payload: quiz });
}));

// Get user's quizzes
quizApp.get("/user/:userId", expressAsyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ userId: req.params.userId })
        .populate('subjectId', 'name fullName')
        .sort({ createdAt: -1 });
    
    res.status(200).send({ message: "User quizzes", payload: quizzes });
}));

// Mark quiz as completed
quizApp.put("/complete/:quizId", expressAsyncHandler(async (req, res) => {
    const completedQuiz = await Quiz.findByIdAndUpdate(
        req.params.quizId,
        { isCompleted: true },
        { new: true }
    );
    
    res.status(200).send({ message: "Quiz completed", payload: completedQuiz });
}));

// Delete quiz
quizApp.delete("/:quizId", expressAsyncHandler(async (req, res) => {
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.status(200).send({ message: "Quiz deleted successfully" });
}));

module.exports = quizApp;