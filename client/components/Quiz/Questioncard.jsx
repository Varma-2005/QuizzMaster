import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdQuestionMark } from 'react-icons/md';

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showCorrectAnswer = false,
  correctAnswer = null
}) {
  const getOptionStyle = (option) => {
    if (showCorrectAnswer) {
      if (option === correctAnswer)
        return 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700 text-gray-800 dark:text-gray-200 shadow-sm';
      if (option === selectedAnswer && option !== correctAnswer)
        return 'border-rose-300 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 dark:border-rose-700 text-gray-800 dark:text-gray-200 shadow-sm';
      return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 opacity-60';
    }
    return selectedAnswer === option
      ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-600 text-gray-800 dark:text-white shadow-md'
      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 text-gray-800 dark:text-gray-200 hover:shadow-sm';
  };

  const getRadioStyle = (option) => {
    if (showCorrectAnswer) {
      if (option === correctAnswer) return 'bg-gradient-to-br from-green-400 to-green-600 border-green-500 shadow-sm';
      if (option === selectedAnswer && option !== correctAnswer) return 'bg-gradient-to-br from-rose-400 to-rose-600 border-rose-500 shadow-sm';
      return 'border-gray-300 dark:border-gray-600';
    }
    return selectedAnswer === option
      ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-500 shadow-sm'
      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500';
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 dark:bg-purple-900/10 rounded-full blur-3xl opacity-30 -ml-16 -mb-16"></div>

      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div className="flex items-center space-x-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-bold border-2 border-blue-200 dark:border-blue-800 shadow-sm">
              Question {questionNumber} / {totalQuestions}
            </span>
            {selectedAnswer && !showCorrectAnswer && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                </div>
              </motion.div>
            )}
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-sm"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MdQuestionMark className="text-2xl text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>
        <motion.h2
          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-100 bg-clip-text text-transparent leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {question.questionText || question.question || 'Question not available'}
        </motion.h2>
      </div>

      <div className="space-y-3 relative z-10">
        {question.options.map((option, index) => (
          <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }} whileHover={{ scale: showCorrectAnswer ? 1 : 1.02, x: showCorrectAnswer ? 0 : 5 }} whileTap={{ scale: showCorrectAnswer ? 1 : 0.98 }}>
            <div
              onClick={() => !showCorrectAnswer && onAnswerSelect(option)}
              className={`p-4 md:p-5 border-2 rounded-xl transition-all duration-200 ${showCorrectAnswer ? getOptionStyle(option) : `cursor-pointer ${getOptionStyle(option)}`}`}
            >
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <div className={`relative w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${getRadioStyle(option)}`}>
                    {(selectedAnswer === option || (option === correctAnswer && showCorrectAnswer)) && (
                      <motion.div
                        className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}
                  </div>
                  <span className="ml-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <span className="flex-1 font-medium text-base md:text-lg">{option}</span>
                {showCorrectAnswer && (
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
                    {option === correctAnswer ? (
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                      </div>
                    ) : option === selectedAnswer ? (
                      <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                        <FaTimesCircle className="text-rose-600 dark:text-rose-400 text-xl" />
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!selectedAnswer && !showCorrectAnswer && (
        <motion.div
          className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium flex items-center justify-center">
            <span className="mr-2">💡</span> Select an option to continue
          </p>
        </motion.div>
      )}

      {showCorrectAnswer && (
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-xl shadow-sm relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {selectedAnswer === correctAnswer ? (
              <span className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                  <FaCheckCircle className="text-green-600 dark:text-green-400" />
                </div>
                <span><span className="font-bold text-green-700 dark:text-green-400">Excellent!</span><span className="ml-2">✨ You got it right!</span></span>
              </span>
            ) : (
              <span className="flex items-center">
                <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full mr-3">
                  <FaTimesCircle className="text-rose-600 dark:text-rose-400" />
                </div>
                <span><span className="font-bold text-rose-700 dark:text-rose-400">Not quite.</span><span className="ml-2">📚 The correct answer is: <strong className="text-blue-700 dark:text-blue-400">{correctAnswer}</strong></span></span>
              </span>
            )}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default QuestionCard;
