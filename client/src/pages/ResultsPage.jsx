import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Loading from '../../components/common/Loading';
import { MdHome, MdRefresh, MdTimer } from 'react-icons/md';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaBrain, FaLightbulb } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ResultsPage() {
  const { resultId } = useParams();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId && resultId !== 'undefined') {
      fetchResult();
    } else {
      toast.error('Invalid result ID');
      setLoading(false);
    }
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await api.get(`/quiz-result-api/${resultId}`);
      setResult(response.data.payload);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const safeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return isNaN(num) || num === null || num === undefined ? fallback : num;
  };

  const getScoreColor = (percentage) => {
    const pct = safeNumber(percentage);
    if (pct >= 80) return 'text-green-600';
    if (pct >= 60) return 'text-orange-600';
    return 'text-rose-600';
  };

  const getGradeLabel = (percentage) => {
    const pct = safeNumber(percentage);
    if (pct >= 90) return 'Excellent';
    if (pct >= 80) return 'Very Good';
    if (pct >= 70) return 'Good';
    if (pct >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const formatTime = (seconds) => {
    const sec = safeNumber(seconds);
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) return <Loading fullScreen variant="logo" text="Loading results..." />;

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center pt-32">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-800 text-xl font-bold mb-4">Results not found</p>
          <Link to="/dashboard">
            <motion.button
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const { quizId, score: rawScore, percentage: rawPercentage, timeTaken, userAnswers, aiExplanations = [], aiFeedback = 'Great effort! Keep practicing to improve your skills.' } = result;
  const quizTitle = quizId?.title || 'Quiz';
  const subjectName = quizId?.subjectName || 'Subject';
  const score = safeNumber(rawScore);
  const percentage = safeNumber(rawPercentage);
  const timeSpent = safeNumber(timeTaken);
  const totalQuestions = userAnswers?.length || 0;
  const incorrectCount = totalQuestions - score;
  const quizQuestions = quizId?.questions || [];

  const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div 
      className={`text-center p-6 bg-${color}-50 rounded-2xl transition-all duration-200 hover:shadow-md`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className={`bg-${color}-500 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
        <Icon className="text-3xl text-white" />
      </div>
      <p className="text-sm text-gray-600 font-semibold mb-1">{label}</p>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 pt-32">
      
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg p-10 mb-8 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50" />
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaTrophy className="mx-auto text-7xl text-yellow-500 mb-4" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Quiz Completed!</h1>
            <p className="text-gray-600 text-xl">
              <span className="font-semibold">{quizTitle}</span> - {subjectName}
            </p>
          </div>
        </motion.div>

        {/* Score Summary */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className={`text-7xl font-bold mb-3 ${getScoreColor(percentage)}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 150 }}
            >
              {percentage}%
            </motion.div>
            <div className="text-2xl text-gray-700 mb-4 font-semibold">
              {score} out of {totalQuestions} correct
            </div>
            <motion.div 
              className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg ${
                percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-orange-500' : 'bg-rose-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 150 }}
            >
              {getGradeLabel(percentage)}
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <StatCard icon={MdTimer} label="Time Taken" value={formatTime(timeSpent)} color="blue" delay={0.2} />
            <StatCard icon={FaCheckCircle} label="Correct Answers" value={score} color="green" delay={0.3} />
            <StatCard icon={FaTimesCircle} label="Incorrect Answers" value={incorrectCount} color="rose" delay={0.4} />
          </div>
        </motion.div>

        {/* AI Feedback */}
        {aiFeedback && (
          <motion.div 
            className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl shadow-lg p-8 mb-8 text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <FaBrain className="text-3xl text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI Feedback</h2>
              </div>
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">{aiFeedback.overall || aiFeedback}</p>
                {aiFeedback.strengths?.length > 0 && (
                  <div>
                    <strong className="text-lg">✅ Strengths:</strong>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      {aiFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {aiFeedback.improvements?.length > 0 && (
                  <div>
                    <strong className="text-lg">🎯 Areas for Improvement:</strong>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      {aiFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {aiFeedback.recommendation && (
                  <p className="text-lg"><strong>💡 Recommendation:</strong> {aiFeedback.recommendation}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Question Review */}
        {userAnswers?.length > 0 && (
          <motion.div 
            className="bg-white rounded-3xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <FaLightbulb className="text-3xl text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Question Review</h2>
            </div>
            
            <div className="space-y-6">
              {userAnswers.map((userAnswer, index) => {
                const question = quizQuestions[index];
                const questionText = question?.questionText || question?.question || 'Question not available';
                const correctAnswer = question?.correctAnswer || 'N/A';
                const explanation = aiExplanations.find(exp => exp.questionIndex === index) || {};
                const isCorrect = userAnswer.isCorrect;
                
                return (
                  <motion.div 
                    key={index} 
                    className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800 flex-1 mr-4">
                        {index + 1}. {questionText}
                      </h3>
                      <div className={`${isCorrect ? 'bg-green-100' : 'bg-rose-100'} p-2 rounded-full`}>
                        {isCorrect ? (
                          <FaCheckCircle className="text-green-500 text-2xl" />
                        ) : (
                          <FaTimesCircle className="text-rose-500 text-2xl" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <span className="text-sm text-gray-600 font-semibold block mb-1">Your Answer:</span>
                        <span className={`font-bold text-lg ${isCorrect ? 'text-green-600' : 'text-rose-600'}`}>
                          {userAnswer.selectedOption || 'Not answered'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="bg-green-50 p-4 rounded-xl">
                          <span className="text-sm text-gray-600 font-semibold block mb-1">Correct Answer:</span>
                          <span className="font-bold text-lg text-green-600">{correctAnswer}</span>
                        </div>
                      )}
                    </div>

                    {explanation.explanation && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                          <p className="text-gray-800"><strong className="text-blue-600">💡 Explanation:</strong> {explanation.explanation}</p>
                        </div>
                        {explanation.keyPoints?.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                            <strong className="text-green-600 block mb-2">🎯 Key Points:</strong>
                            <ul className="list-disc ml-6 space-y-1 text-gray-800">
                              {explanation.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                          </div>
                        )}
                        {explanation.tip && (
                          <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-500">
                            <p className="text-gray-800"><strong className="text-yellow-600">✨ Tip:</strong> {explanation.tip}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard">
              <motion.button
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 flex items-center space-x-2 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdHome className="text-xl" />
                <span>Dashboard</span>
              </motion.button>
            </Link>
            <Link to="/quiz-selection">
              <motion.button
                className="bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdRefresh className="text-xl" />
                <span>Take Another Quiz</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ResultsPage;