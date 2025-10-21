const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = (temperature = 0.7) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required');
  }
  
  return genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  });
};

const parseJsonResponse = (text) => {
  const cleanText = text.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const jsonStart = cleanText.indexOf('[');
  const jsonEnd = cleanText.lastIndexOf(']');
  
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('AI did not return valid JSON format');
  }
  
  return JSON.parse(cleanText.substring(jsonStart, jsonEnd + 1));
};

const generateQuiz = async (subject, difficulty, questionCount) => {
  const model = getModel(0.7);

  const prompt = `Generate exactly ${questionCount} multiple choice questions about ${subject} for B.Tech Computer Science students with ${difficulty} difficulty.

STRICT REQUIREMENTS:
- Return ONLY valid JSON array
- Each question must have exactly 4 options
- One option must be clearly correct
- Questions should be relevant to B.Tech CS curriculum

JSON FORMAT:
[
  {
    "question": "What is the primary purpose of normalization in databases?",
    "options": ["Reduce data redundancy", "Increase data size", "Slow down queries", "Create backups"],
    "correctAnswer": "Reduce data redundancy"
  }
]

Subject: ${subject}
Difficulty: ${difficulty}
Generate ${questionCount} questions:`;

  const result = await model.generateContent(prompt);
  const aiQuestions = parseJsonResponse(result.response.text());

  return aiQuestions.map((aiQ, index) => {
    if (!aiQ.question || !Array.isArray(aiQ.options) || aiQ.options.length !== 4 || !aiQ.correctAnswer) {
      throw new Error(`AI question ${index + 1} has invalid structure`);
    }

    if (!aiQ.options.includes(aiQ.correctAnswer)) {
      throw new Error(`AI question ${index + 1} correct answer not in options`);
    }

    return {
      questionText: String(aiQ.question).trim(),
      options: aiQ.options.map(optionText => ({
        text: String(optionText).trim(),
        isCorrect: optionText === aiQ.correctAnswer
      })),
      correctAnswer: String(aiQ.correctAnswer).trim()
    };
  });
};

const calculateTimer = async (difficulty, questionCount, subject) => {
  const baseTimeMap = {
    'easy': 45,
    'medium': 60,
    'hard': 90
  };
  
  const subjectMultipliers = {
    'DSA': 1.3,
    'DBMS': 1.1,
    'OS': 1.2
  };
  
  const baseSeconds = (baseTimeMap[difficulty.toLowerCase()] || 60) * questionCount;
  const totalTime = Math.min(Math.max(baseSeconds * (subjectMultipliers[subject] || 1), 120), 1200);
  
  return {
    totalTime,
    timePerQuestion: Math.ceil(totalTime / questionCount),
    difficulty,
    questionCount,
    subject
  };
};

const generateExplanations = async (questions, userAnswers) => {
  const model = getModel(0.4);

  const questionsData = questions.map((q, index) => ({
    questionIndex: index,
    questionText: q.questionText,
    options: q.options.map(opt => opt.text),
    correctAnswer: q.correctAnswer,
    userAnswer: userAnswers[index] || null
  }));

  const prompt = `Generate detailed explanations for these B.Tech quiz questions:

${JSON.stringify(questionsData, null, 2)}

Return ONLY this JSON array:
[
  {
    "questionText": "<question>",
    "userAnswer": "<user_answer_or_null>",
    "correctAnswer": "<correct_answer>",
    "isCorrect": <boolean>,
    "explanation": "<detailed_explanation>"
  }
]`;

  const result = await model.generateContent(prompt);
  const explanations = parseJsonResponse(result.response.text());
  
  if (!Array.isArray(explanations) || explanations.length === 0) {
    throw new Error('AI returned invalid explanations format');
  }
  
  return explanations.map((exp, index) => ({
    ...exp,
    questionIndex: index
  }));
};

const generateFeedback = async (quizResult, subject) => {
  const model = getModel(0.6);
  const { percentage, score, totalQuestions, timeSpent } = quizResult;

  const prompt = `Generate personalized feedback for a B.Tech Computer Science student:

Performance:
- Subject: ${subject}
- Score: ${score}/${totalQuestions} (${percentage}%)
- Time: ${Math.round(timeSpent / 60)} minutes

Write encouraging, specific feedback (2-3 sentences) focusing on:
1. Performance acknowledgment
2. Subject-specific insights
3. Study recommendations
4. Motivation

Return only the feedback text (no JSON, no formatting):`;

  const result = await model.generateContent(prompt);
  const feedback = result.response.text().trim();

  if (!feedback || feedback.length < 10) {
    throw new Error('AI returned insufficient feedback');
  }

  return feedback;
};

module.exports = {
  generateQuiz,
  calculateTimer,
  generateExplanations,
  generateFeedback
};