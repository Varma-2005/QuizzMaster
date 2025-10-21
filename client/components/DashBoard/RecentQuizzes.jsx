import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdQuiz, MdCheckCircle, MdCancel, MdArrowForward } from 'react-icons/md';
import { FaHistory, FaClock } from 'react-icons/fa';

const RecentQuizzes = ({ quizzes = [] }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString), now = new Date();
    const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m 0s';
    const m = Math.floor(seconds / 60), s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getScoreColor = (p) => (p >= 80 ? 'text-green-600' : p >= 60 ? 'text-orange-600' : 'text-rose-600');
  const handleViewResults = (id) => navigate(`/results/${id}`);

  if (!quizzes.length)
    return (
      <motion.div className="bg-white rounded-3xl shadow-lg p-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-orange-100 p-3 rounded-2xl"><FaHistory className="text-3xl text-orange-500" /></div>
          <h2 className="text-3xl font-bold text-gray-800">Recent Quizzes</h2>
        </div>
        <div className="text-center py-16">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <MdQuiz className="text-8xl text-gray-300 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl font-bold text-gray-800 mb-2">No quizzes taken yet</p>
          <p className="text-gray-500">Start taking quizzes to see your progress here 🚀</p>
        </div>
      </motion.div>
    );

  return (
    <motion.div className="bg-white rounded-3xl shadow-lg p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <motion.div className="flex items-center space-x-3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="bg-orange-100 p-3 rounded-2xl"><FaHistory className="text-3xl text-orange-500" /></div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Recent Quizzes</h2>
            <p className="text-gray-600">Your latest attempts</p>
          </div>
        </motion.div>
        <motion.div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white px-5 py-2 rounded-full font-bold text-lg shadow-lg"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          {quizzes.length}
        </motion.div>
      </div>

      <div className="space-y-4">
        {quizzes.map((q, i) => (
          <motion.div key={q._id} onClick={() => handleViewResults(q._id)}
            className="relative bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-orange-600">{q.quizTitle || q.quizId?.title || 'Quiz'}</h3>
                  <p className="text-sm text-gray-600 font-semibold bg-orange-50 inline-block px-3 py-1 rounded-lg">
                    📚 {q.quizId?.subjectName || q.subject || 'Subject'}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <span className={`text-4xl font-bold ${getScoreColor(q.percentage)}`}>{q.percentage}%</span>
                  <span className="text-sm text-gray-500 font-medium block">{q.score}/{q.totalQuestions || q.userAnswers?.length || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-xl p-3 hover:bg-green-50 transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-2 rounded-lg"><MdCheckCircle className="text-green-600" /></div>
                    <div><p className="text-xs text-gray-600 font-semibold">Correct</p><p className="text-base font-bold">{q.score}</p></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 hover:bg-blue-50 transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-2 rounded-lg"><FaClock className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-600 font-semibold">Time</p><p className="text-base font-bold">{formatTime(q.timeTaken)}</p></div>
                  </div>
                </div>

                <div className={`bg-white rounded-xl p-3 transition-all ${q.percentage >= 60 ? 'hover:bg-green-50' : 'hover:bg-rose-50'}`}>
                  <div className="flex items-center space-x-2">
                    <div className={`${q.percentage >= 60 ? 'bg-green-100' : 'bg-rose-100'} p-2 rounded-lg`}>
                      {q.percentage >= 60 ? <MdCheckCircle className="text-green-600" /> : <MdCancel className="text-rose-600" />}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Status</p>
                      <p className={`text-base font-bold ${q.percentage >= 60 ? 'text-green-600' : 'text-rose-600'}`}>
                        {q.percentage >= 60 ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500 font-medium">🕐 {formatDate(q.createdAt || q.completedAt)}</span>
                <motion.button className="text-sm bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 shadow-md hover:from-orange-500 hover:to-orange-600 transition-all"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <span>View Details</span><MdArrowForward />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {quizzes.length >= 5 && (
        <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.button onClick={() => navigate('/history')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all text-lg"
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <span>View All Quizzes</span><MdArrowForward />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecentQuizzes;
