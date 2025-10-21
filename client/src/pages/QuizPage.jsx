import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../src/hooks/useAuth';
import useQuiz from '../../src/hooks/useQuiz';
import api from '../services/api';
import Loading from '../../components/common/Loading';
import Timer from '../../components/Quiz/Timer';
import { MdNavigateNext, MdNavigateBefore, MdFlag, MdCheckCircle } from 'react-icons/md';
import { FaCheckCircle, FaClock, FaQuestionCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

function QuizPage() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const { submitQuizResult } = useQuiz();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const startTimeRef = useRef(null);
  const quizSessionKey = `quiz_session_${quizId}`;

  useEffect(() => {
    if (!quizId || quizId === 'undefined') {
      toast.error('Invalid quiz ID');
      navigate('/quiz-selection');
      return;
    }
    fetchQuiz();
    loadQuizSession();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz-api/${quizId}`);
      const quizData = response.data.payload;
      setQuiz(quizData);
      
      const timeInSeconds = quizData.timeLimit > 60 
        ? quizData.timeLimit 
        : quizData.timeLimit * 60;
      
      const savedSession = localStorage.getItem(quizSessionKey);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        const elapsedTime = Math.floor((Date.now() - session.startTime) / 1000);
        const remainingTime = Math.max(0, timeInSeconds - elapsedTime);
        
        setInitialTime(remainingTime);
        startTimeRef.current = session.startTime;
        
        if (session.answers) {
          setAnswers(session.answers);
        }
      } else {
        setInitialTime(timeInSeconds);
        const now = Date.now();
        startTimeRef.current = now;
        
        localStorage.setItem(quizSessionKey, JSON.stringify({
          startTime: now,
          answers: {},
          quizId: quizId
        }));
      }
    } catch (error) {
      console.error('Fetch quiz error:', error);
      toast.error('Failed to load quiz');
      navigate('/quiz-selection');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizSession = () => {};

  const handleAnswerSelect = (questionId, selectedOption) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: selectedOption
    };
    setAnswers(updatedAnswers);
    
    const savedSession = localStorage.getItem(quizSessionKey);
    if (savedSession) {
      const session = JSON.parse(savedSession);
      session.answers = updatedAnswers;
      localStorage.setItem(quizSessionKey, JSON.stringify(session));
    }
  };

  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting your quiz...');
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const timeTaken = startTimeRef.current 
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : initialTime;

    const userAnswers = quiz.questions.map((question, index) => {
      const userAnswer = answers[question._id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      return {
        questionIndex: index,
        selectedOption: userAnswer || null,
        isCorrect: isCorrect
      };
    });

    const correctCount = userAnswers.filter(ans => ans.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const resultData = {
      userId: user._id,
      quizId: quizId,
      userAnswers: userAnswers,
      score: correctCount,
      percentage: percentage,
      timeTaken: timeTaken,
      questions: quiz.questions,
      subject: quiz.subjectName
    };

    try {
      const result = await submitQuizResult(resultData);
      localStorage.removeItem(quizSessionKey);
      
      let resultId = null;
      if (result?.payload?.result?._id) {
        resultId = result.payload.result._id;
      } else if (result?.result?._id) {
        resultId = result.result._id;
      } else if (result?._id) {
        resultId = result._id;
      }
      
      if (resultId) {
        navigate(`/results/${resultId}`);
      } else {
        toast.error('Quiz submitted but cannot load results.');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Submit quiz error:', error);
      toast.error('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  }, [submitting, user._id, quiz, answers, initialTime, startTimeRef, submitQuizResult, navigate, quizSessionKey, quizId]);

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) return <Loading />;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No quiz data available</p>
          <button onClick={() => navigate('/quiz-selection')} className="px-6 py-3 bg-orange-500 text-white rounded-2xl">
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <p className="text-gray-600">Question not available</p>
      </div>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {quiz.title || `${quiz.subjectName} Quiz`}
              </h1>
              <p className="text-gray-600 flex items-center space-x-3">
                <span className="font-medium">{quiz.subjectName}</span>
                <span className="text-gray-400">•</span>
                <span className={`font-semibold ${
                  quiz.difficulty === 'Easy' ? 'text-green-600' :
                  quiz.difficulty === 'Hard' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {quiz.difficulty}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <Timer 
                  initialTime={initialTime}
                  onTimeUp={handleTimeUp}
                  isActive={!submitting}
                />
              </div>
              <div className="bg-orange-50 px-4 py-3 rounded-2xl">
                <p className="text-xs text-gray-600 mb-1">Answered</p>
                <p className="text-lg font-bold text-orange-600">
                  {getAnsweredCount()}/{quiz.questions.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-bold text-gray-800">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full"
            ></motion.div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl px-4 py-2">
                    <span className="text-white font-bold text-lg">Q{currentQuestionIndex + 1}</span>
                  </div>
                  {answers[currentQuestion._id] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-green-100 rounded-full p-2"
                    >
                      <MdCheckCircle className="text-green-500 text-xl" />
                    </motion.div>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
                  {currentQuestion.questionText || currentQuestion.question || 'Question not available'}
                </h2>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options && currentQuestion.options.map((option, index) => {
                const optionText = typeof option === 'object' 
                  ? (option.text || option.option || `Option ${index + 1}`)
                  : String(option);
                
                const isSelected = answers[currentQuestion._id] === optionText;
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(currentQuestion._id, optionText)}
                    className={`p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full border-2 mr-4 flex items-center justify-center font-bold transition-all ${
                        isSelected
                          ? 'bg-orange-500 border-orange-500 text-white scale-110'
                          : 'border-gray-300 text-gray-500'
                      }`}>
                        {optionLabels[index]}
                      </div>
                      <span className={`text-lg ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                        {optionText}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Previous Button */}
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={isFirstQuestion}
              className={`px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 transition-all ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MdNavigateBefore className="text-xl" />
              <span>Previous</span>
            </button>

            {/* Question Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white scale-110 shadow-lg'
                      : answers[quiz.questions[index]._id]
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Next/Submit Button */}
            {isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting || getAnsweredCount() === 0}
                className={`px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all ${
                  submitting || getAnsweredCount() === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
                }`}
              >
                <MdFlag className="text-xl" />
                <span>{submitting ? 'Submitting...' : 'Submit Quiz'}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl font-semibold flex items-center space-x-2 hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Next</span>
                <MdNavigateNext className="text-xl" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default QuizPage;