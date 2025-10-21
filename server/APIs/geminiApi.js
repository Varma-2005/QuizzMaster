const exp = require('express');
const geminiApp = exp.Router();
const geminiService = require('../services/geminiService');
const Quiz = require('../models/quizModel');
const Subject = require('../models/subjectModel');
const expressAsyncHandler = require('express-async-handler');

// Test Gemini API connection
geminiApp.get('/test', expressAsyncHandler(async (req, res) => {
    const testResult = await geminiService.generateQuiz('DBMS', 'Easy', 2);
    
    res.status(200).send({
        message: 'Gemini API test successful',
        payload: {
            questionsGenerated: testResult.length,
            sample: testResult[0]
        }
    });
}));

// Generate quiz with AI
geminiApp.post('/generate-quiz', expressAsyncHandler(async (req, res) => {
    const { userId, subjectId, difficulty, questionCount } = req.body;
    
    // Validate inputs
    if (!userId || !subjectId || !difficulty || !questionCount) {
        return res.status(400).send({ message: 'All fields are required' });
    }
    
    if (questionCount > 24 || questionCount < 1) {
        return res.status(400).send({ message: 'Question count must be between 1 and 24' });
    }
    
    // Get subject details
    const subjectData = await Subject.findById(subjectId);
    
    if (!subjectData) {
        return res.status(404).send({ message: 'Subject not found' });
    }
    
    if (!subjectData.name || !subjectData.fullName) {
        return res.status(400).send({ 
            message: 'Subject data is incomplete',
            missingFields: {
                name: !subjectData.name,
                fullName: !subjectData.fullName
            }
        });
    }
    
    // Generate AI questions and timer in parallel
    const [questions, timerData] = await Promise.all([
        geminiService.generateQuiz(subjectData.name, difficulty, questionCount),
        geminiService.calculateTimer(difficulty, questionCount, subjectData.name)
    ]);
    
    if (!questions?.length) {
        return res.status(500).send({ message: 'Failed to generate questions' });
    }
    
    // Create and save quiz
    const savedQuiz = await new Quiz({
        userId,
        subjectId,
        title: `${subjectData.fullName} - ${difficulty} Quiz`,
        subjectName: subjectData.fullName,
        difficulty,
        totalQuestions: questionCount,
        timeLimit: Math.round(timerData.totalTime || 1200),
        questions,
        isCompleted: false
    }).save();
    
    res.status(201).send({
        message: 'AI Quiz generated successfully',
        payload: {
            quiz: savedQuiz,
            timerInfo: timerData,
            questionsGenerated: questions.length
        }
    });
}));

// Calculate timer
geminiApp.post('/calculate-timer', expressAsyncHandler(async (req, res) => {
    const { difficulty, questionCount, subjectId } = req.body;
    
    if (!difficulty || !questionCount || !subjectId) {
        return res.status(400).send({ message: 'All fields are required' });
    }
    
    const subjectData = await Subject.findById(subjectId);
    
    if (!subjectData) {
        return res.status(404).send({ message: 'Subject not found' });
    }
    
    try {
        const timerData = await geminiService.calculateTimer(difficulty, questionCount, subjectData.name);
        
        res.status(200).send({
            message: 'Timer calculated by AI',
            payload: timerData
        });
    } catch (error) {
        // Fallback timer calculation
        const baseSeconds = {
            'Easy': questionCount * 45,
            'Medium': questionCount * 60,
            'Hard': questionCount * 90
        }[difficulty] || questionCount * 60;
        
        const totalTimeSeconds = Math.min(Math.max(baseSeconds, 120), 1200);
        
        res.status(200).send({
            message: 'Timer calculated (fallback)',
            payload: {
                totalTime: totalTimeSeconds,
                timePerQuestion: Math.ceil(totalTimeSeconds / questionCount),
                difficulty,
                questionCount
            }
        });
    }
}));

// Debug subject data
geminiApp.get('/debug-subject/:id', expressAsyncHandler(async (req, res) => {
    const subjectData = await Subject.findById(req.params.id);
    
    if (!subjectData) {
        return res.status(404).send({ message: 'Subject not found' });
    }
    
    res.status(200).send({
        message: 'Subject debug info',
        payload: {
            id: subjectData._id,
            name: subjectData.name,
            fullName: subjectData.fullName,
            description: subjectData.description,
            icon: subjectData.icon,
            isActive: subjectData.isActive,
            createdAt: subjectData.createdAt,
            updatedAt: subjectData.updatedAt
        }
    });
}));

// Generate AI explanations
geminiApp.post('/generate-explanations', expressAsyncHandler(async (req, res) => {
    const { questions, userAnswers } = req.body;
    
    if (!questions || !userAnswers || questions.length !== userAnswers.length) {
        return res.status(400).send({ message: 'Questions and userAnswers must match in length' });
    }
    
    const explanations = await geminiService.generateExplanations(questions, userAnswers);
    
    res.status(200).send({
        message: 'AI explanations generated',
        payload: explanations
    });
}));

// Generate personalized feedback
geminiApp.post('/generate-feedback', expressAsyncHandler(async (req, res) => {
    const { quizResult, subject } = req.body;
    
    if (!quizResult || !subject) {
        return res.status(400).send({ message: 'Quiz result and subject are required' });
    }
    
    const feedback = await geminiService.generateFeedback(quizResult, subject);
    
    res.status(200).send({
        message: 'AI feedback generated',
        payload: feedback
    });
}));

// Check database subjects
geminiApp.get('/check-database', expressAsyncHandler(async (req, res) => {
    const subjects = await Subject.find({});
    res.json(subjects);
}));

module.exports = geminiApp;