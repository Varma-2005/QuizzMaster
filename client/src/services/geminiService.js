import api from './api';

const geminiService = {
  generateQuiz: async (quizData) => {
    return await api.post('/gemini-api/generate-quiz', quizData);
  },

  calculateTimer: async (timerData) => {
    return await api.post('/gemini-api/calculate-timer', timerData);
  },

  generateExplanations: async (explanationData) => {
    return await api.post('/gemini-api/generate-explanations', explanationData);
  },

  generateFeedback: async (feedbackData) => {
    return await api.post('/gemini-api/generate-feedback', feedbackData);
  }
};

export default geminiService;