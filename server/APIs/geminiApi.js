const exp = require('express');
const geminiApp = exp.Router();
const geminiService = require('../services/geminiService');
const Quiz = require('../models/quizModel');
const Subject = require('../models/subjectModel');
const expressAsyncHandler = require('express-async-handler');

// ✅ Test Gemini API connection
geminiApp.get('/test', expressAsyncHandler(async (req, res) => {
  try {
    const testResult = await geminiService.generateQuiz('DBMS', 'Easy', 2);
    res.status(200).json({
      success: true,
      message: 'Gemini API test successful',
      payload: {
        questionsGenerated: testResult.length,
        sample: testResult[0],
      },
    });
  } catch (error) {
    console.error('Gemini test failed:', error);
    res.status(500).json({ success: false, message: 'Gemini API test failed', error: error.message });
  }
}));

// ✅ Generate quiz with AI
geminiApp.post('/generate-quiz', expressAsyncHandler(async (req, res) => {
  const { userId, subjectId, difficulty, questionCount } = req.body;

  if (!userId || !subjectId || !difficulty || !questionCount) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (questionCount > 24 || questionCount < 1) {
    return res.status(400).json({ success: false, message: 'Question count must be between 1 and 24' });
  }

  const subjectData = await Subject.findById(subjectId);
  if (!subjectData) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  if (!subjectData.name || !subjectData.fullName) {
    return res.status(400).json({
      success: false,
      message: 'Subject data is incomplete',
      missingFields: {
        name: !subjectData.name,
        fullName: !subjectData.fullName,
      },
    });
  }

  try {
    const [questions, timerData] = await Promise.all([
      geminiService.generateQuiz(subjectData.name, difficulty, questionCount),
      geminiService.calculateTimer(difficulty, questionCount, subjectData.name),
    ]);

    if (!questions?.length) {
      return res.status(500).json({ success: false, message: 'Failed to generate questions' });
    }

    const savedQuiz = await new Quiz({
      userId,
      subjectId,
      title: `${subjectData.fullName} - ${difficulty} Quiz`,
      subjectName: subjectData.fullName,
      difficulty,
      totalQuestions: questionCount,
      timeLimit: Math.round(timerData.totalTime || 1200),
      questions,
      isCompleted: false,
    }).save();

    const quizResponse = savedQuiz.toObject();
    delete quizResponse.__v;

    res.status(201).json({
      success: true,
      message: 'AI Quiz generated successfully',
      payload: {
        quiz: quizResponse,
        timerInfo: timerData,
        questionsGenerated: questions.length,
      },
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ success: false, message: 'Error generating quiz', error: error.message });
  }
}));

// ✅ Calculate timer
geminiApp.post('/calculate-timer', expressAsyncHandler(async (req, res) => {
  const { difficulty, questionCount, subjectId } = req.body;

  if (!difficulty || !questionCount || !subjectId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const subjectData = await Subject.findById(subjectId);
  if (!subjectData) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  try {
    const timerData = await geminiService.calculateTimer(difficulty, questionCount, subjectData.name);
    res.status(200).json({ success: true, message: 'Timer calculated by AI', payload: timerData });
  } catch (error) {
    console.error('AI timer generation failed, using fallback:', error);

    const multipliers = { Easy: 45, Medium: 60, Hard: 90 };
    const baseSeconds = (multipliers[difficulty] || 60) * questionCount;
    const totalTime = Math.max(120, Math.min(baseSeconds, 1200));

    res.status(200).json({
      success: true,
      message: 'Timer calculated (fallback)',
      payload: {
        totalTime,
        timePerQuestion: Math.ceil(totalTime / questionCount),
        difficulty,
        questionCount,
      },
    });
  }
}));

// ✅ Debug subject data (disable on production)
geminiApp.get('/debug-subject/:id', expressAsyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Debug endpoint disabled in production' });
  }

  const subjectData = await Subject.findById(req.params.id);
  if (!subjectData) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Subject debug info',
    payload: {
      id: subjectData._id,
      name: subjectData.name,
      fullName: subjectData.fullName,
      description: subjectData.description,
      icon: subjectData.icon,
      isActive: subjectData.isActive,
      createdAt: subjectData.createdAt,
      updatedAt: subjectData.updatedAt,
    },
  });
}));

// ✅ Generate AI explanations
geminiApp.post('/generate-explanations', expressAsyncHandler(async (req, res) => {
  const { questions, userAnswers } = req.body;

  if (!questions || !userAnswers || questions.length !== userAnswers.length) {
    return res.status(400).json({ success: false, message: 'Questions and userAnswers must match in length' });
  }

  try {
    const explanations = await geminiService.generateExplanations(questions, userAnswers);
    res.status(200).json({ success: true, message: 'AI explanations generated', payload: explanations });
  } catch (error) {
    console.error('Error generating explanations:', error);
    res.status(500).json({ success: false, message: 'Error generating explanations', error: error.message });
  }
}));

// ✅ Generate personalized feedback
geminiApp.post('/generate-feedback', expressAsyncHandler(async (req, res) => {
  const { quizResult, subject } = req.body;

  if (!quizResult || !subject) {
    return res.status(400).json({ success: false, message: 'Quiz result and subject are required' });
  }

  try {
    const feedback = await geminiService.generateFeedback(quizResult, subject);
    res.status(200).json({ success: true, message: 'AI feedback generated', payload: feedback });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ success: false, message: 'Error generating feedback', error: error.message });
  }
}));

// ✅ Check database subjects
geminiApp.get('/check-database', expressAsyncHandler(async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.status(200).json({ success: true, message: 'Subjects fetched successfully', payload: subjects });
  } catch (error) {
    console.error('Database check failed:', error);
    res.status(500).json({ success: false, message: 'Database check failed', error: error.message });
  }
}));

module.exports = geminiApp;
