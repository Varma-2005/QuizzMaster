import api from './api';

const quizService = {
  createQuiz: async (quizData) => {
    return await api.post('/quiz-api/create', quizData);
  },

  getQuiz: async (quizId) => {
    return await api.get(`/quiz-api/${quizId}`);
  },

  getUserQuizzes: async (userId) => {
    return await api.get(`/quiz-api/user/${userId}`);
  },

  completeQuiz: async (quizId) => {
    return await api.put(`/quiz-api/complete/${quizId}`);
  },

  deleteQuiz: async (quizId) => {
    return await api.delete(`/quiz-api/${quizId}`);
  },

  submitResult: async (resultData) => {
    return await api.post('/quiz-result-api/submit', resultData);
  },

  getResult: async (resultId) => {
    return await api.get(`/quiz-result-api/${resultId}`);
  },

  getUserResults: async (userId) => {
    return await api.get(`/quiz-result-api/user/${userId}`);
  }
};

export default quizService;