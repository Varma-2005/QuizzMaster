import { createContext, useContext, useState } from 'react';
import quizService from '../services/quizService';
import geminiService from '../services/geminiService';
import { toast } from 'react-toastify';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const generateAIQuiz = async (quizData) => {
    setLoading(true);
    try {
      const { data } = await geminiService.generateQuiz(quizData);
      const quiz = data.payload?.quiz;

      if (!quiz) throw new Error('No quiz returned from AI');

      setCurrentQuiz(quiz);
      setTimeLeft(quiz.timeLimit);
      toast.success('AI Quiz generated successfully!');
      return { success: true, quiz };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate quiz';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const submitQuizResult = async (resultData) => {
    setLoading(true);
    try {
      const { data } = await quizService.submitResult(resultData);
      const { payload, message } = data || {};

      if (payload?.result) setQuizResults((prev) => [...prev, payload.result]);

      endQuiz();
      toast.success('Quiz submitted successfully!');
      return { success: true, payload, message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit quiz';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    if (!quiz) return;
    setCurrentQuiz(quiz);
    setTimeLeft(quiz.timeLimit || 0);
    setIsQuizActive(true);
  };

  const endQuiz = () => {
    setCurrentQuiz(null);
    setTimeLeft(0);
    setIsQuizActive(false);
  };

  const fetchUserQuizzes = async (userId) => {
    setLoading(true);
    try {
      const { data } = await quizService.getUserQuizzes(userId);
      setQuizzes(data.payload || []);
    } catch {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentQuiz,
    quizzes,
    quizResults,
    loading,
    timeLeft,
    isQuizActive,
    generateAIQuiz,
    submitQuizResult,
    startQuiz,
    endQuiz,
    fetchUserQuizzes,
    setTimeLeft,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within QuizProvider');
  return context;
};

export default QuizContext;
