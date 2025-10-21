import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdQuiz, MdTimer, MdTrendingUp, MdArrowForward } from 'react-icons/md';
import { FaDatabase, FaDesktop, FaNetworkWired, FaCode, FaFire } from 'react-icons/fa';

function QuizCard({ quiz, onStart }) {
  const getSubjectIcon = (subjectName) => {
    const iconMap = {
      'DBMS': FaDatabase,
      'Database Management Systems': FaDatabase,
      'OS': FaDesktop,
      'Operating Systems': FaDesktop,
      'CN': FaNetworkWired,
      'Computer Networks': FaNetworkWired,
      'DSA': FaCode,
      'Data Structures': FaCode
    };
    return iconMap[subjectName] || MdQuiz;
  };

  const getDifficultyConfig = (difficulty) => {
    const configMap = {
      'Easy': {
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        gradient: 'from-green-400 to-green-500'
      },
      'Medium': {
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        gradient: 'from-orange-400 to-orange-500'
      },
      'Hard': {
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        gradient: 'from-red-400 to-red-500'
      }
    };
    return configMap[difficulty] || {
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      gradient: 'from-gray-400 to-gray-500'
    };
  };

  const getSubjectColor = (subjectName) => {
    const colorMap = {
      'DBMS': 'from-blue-400 to-blue-600',
      'Database Management Systems': 'from-blue-400 to-blue-600',
      'OS': 'from-green-400 to-green-600',
      'Operating Systems': 'from-green-400 to-green-600',
      'CN': 'from-purple-400 to-purple-600',
      'Computer Networks': 'from-purple-400 to-purple-600',
      'DSA': 'from-orange-400 to-orange-600',
      'Data Structures': 'from-orange-400 to-orange-600'
    };
    return colorMap[subjectName] || 'from-gray-400 to-gray-600';
  };

  const IconComponent = getSubjectIcon(quiz.subjectName);
  const difficultyConfig = getDifficultyConfig(quiz.difficulty);
  const subjectGradient = getSubjectColor(quiz.subjectName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${subjectGradient} p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <IconComponent className="text-4xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {quiz.title}
              </h3>
              <p className="text-white/90 text-sm font-medium">
                {quiz.subjectName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        
        {/* Difficulty Badge */}
        <div className="flex items-center justify-between mb-6">
          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${difficultyConfig.color} ${difficultyConfig.bg} border ${difficultyConfig.border} flex items-center space-x-2`}>
            <FaFire className="text-lg" />
            <span>{quiz.difficulty}</span>
          </span>
          
          {quiz.averageScore && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MdTrendingUp className="text-xl text-green-500" />
              <span className="text-sm font-semibold">Avg: {quiz.averageScore}%</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 bg-blue-50 rounded-2xl p-4">
            <div className="bg-blue-500 rounded-xl p-2">
              <MdQuiz className="text-xl text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Questions</p>
              <p className="text-lg font-bold text-gray-800">
                {quiz.questions?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-orange-50 rounded-2xl p-4">
            <div className="bg-orange-500 rounded-xl p-2">
              <MdTimer className="text-xl text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Duration</p>
              <p className="text-lg font-bold text-gray-800">
                {quiz.timeLimit}m
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <Link 
            to={`/quiz/${quiz._id}`}
            className={`group/btn bg-gradient-to-r ${difficultyConfig.gradient} text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2`}
          >
            <span>Start Quiz</span>
            <MdArrowForward className="text-xl group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          
          {onStart && (
            <button 
              onClick={() => onStart(quiz)}
              className="border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
            >
              Preview Details
            </button>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
}

export default QuizCard;