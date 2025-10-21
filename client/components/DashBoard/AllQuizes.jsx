import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdQuiz, MdCheckCircle, MdCancel, MdAccessTime, MdArrowBack, MdSearch, MdVisibility } from 'react-icons/md';
import { FaStar, FaCrown, FaBook } from 'react-icons/fa';
import useAuth from '../../src/hooks/useAuth';
import api from '../../src/services/api';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';

const AllQuizzes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (user?._id) fetchAllQuizzes();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [allQuizzes, searchTerm, filterSubject, filterStatus, sortBy]);

  const fetchAllQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quiz-result-api/user/${user._id}`);
      const results = response.data.payload || [];
      setAllQuizzes(results);
      setFilteredQuizzes(results);
    } catch (error) {
      toast.error('Failed to load quiz history');
      setAllQuizzes([]);
      setFilteredQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allQuizzes];

    if (searchTerm) {
      filtered = filtered.filter(quiz => {
        const title = quiz.quizId?.title || '';
        const subject = quiz.quizId?.subjectName || '';
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (filterSubject !== 'all') {
      filtered = filtered.filter(quiz => (quiz.quizId?.subjectName || '') === filterSubject);
    }

    if (filterStatus === 'passed') {
      filtered = filtered.filter(quiz => quiz.percentage >= 60);
    } else if (filterStatus === 'failed') {
      filtered = filtered.filter(quiz => quiz.percentage < 60);
    }

    const sortFunctions = {
      recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      highest: (a, b) => b.percentage - a.percentage,
      lowest: (a, b) => a.percentage - b.percentage
    };

    filtered.sort(sortFunctions[sortBy] || sortFunctions.recent);
    setFilteredQuizzes(filtered);
  };

  const getUniqueSubjects = () => {
    const subjects = allQuizzes.map(q => q.quizId?.subjectName).filter(Boolean);
    return [...new Set(subjects)];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m 0s';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-rose-600';
  };

  const stats = {
    total: allQuizzes.length,
    passed: allQuizzes.filter(q => q.percentage >= 60).length,
    failed: allQuizzes.filter(q => q.percentage < 60).length,
    avgScore: allQuizzes.length > 0 
      ? Math.round(allQuizzes.reduce((sum, q) => sum + q.percentage, 0) / allQuizzes.length)
      : 0
  };

  const bestScore = allQuizzes.length > 0 ? Math.max(...allQuizzes.map(q => q.percentage)) : 0;

  const StatCard = ({ icon: Icon, label, value, color, delay, gradient = false }) => (
    <motion.div 
      className={`${gradient ? 'bg-gradient-to-br from-orange-400 to-orange-500' : 'bg-white'} rounded-3xl shadow-${gradient ? 'xl' : 'lg'} p-8 relative overflow-hidden group transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient ? 'bg-white/20' : `bg-${color}-100`} rounded-full blur-2xl opacity-50 ${!gradient && 'group-hover:opacity-70'} transition-opacity duration-300`} />
      <div className="relative">
        <motion.div 
          className={`${gradient ? 'bg-white/20' : `bg-${color}-100`} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
          {...(gradient && {
            animate: { rotate: [0, 360] },
            transition: { duration: 20, repeat: Infinity, ease: "linear" }
          })}
        >
          <Icon className={`text-3xl ${gradient ? 'text-white' : `text-${color}-600`}`} />
        </motion.div>
        <p className={`${gradient ? 'text-white/90' : 'text-gray-600'} font-semibold mb-2`}>{label}</p>
        <p className={`text-4xl font-bold ${gradient ? 'text-white' : `text-${color}-600`}`}>{value}{gradient && '%'}</p>
      </div>
    </motion.div>
  );

  const FilterSelect = ({ value, onChange, options, placeholder }) => (
    <select
      value={value}
      onChange={onChange}
      className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 font-medium text-base"
    >
      <option value="all">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );

  if (loading) return <Loading fullScreen variant="logo" text="Loading quiz history..." />;

  const hasActiveFilters = searchTerm || filterSubject !== 'all' || filterStatus !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="container mx-auto px-4 max-w-7xl pt-32 pb-20">
        
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-orange-500 mb-8 transition-all duration-200 font-semibold text-lg group"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className="mr-2 text-2xl transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </motion.button>
          
          <div className="flex items-center space-x-4 mb-4">
            <motion.div 
              className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 shadow-xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaBook className="text-4xl text-white" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">Quiz History</h1>
              <p className="text-xl text-gray-600 mt-2">Track your learning journey and celebrate your progress</p>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={MdQuiz} label="Total Quizzes" value={stats.total} color="blue" delay={0.1} />
          <StatCard icon={MdCheckCircle} label="Passed" value={stats.passed} color="green" delay={0.2} />
          <StatCard icon={MdCancel} label="Failed" value={stats.failed} color="rose" delay={0.3} />
          <StatCard icon={FaStar} label="Average Score" value={stats.avgScore} delay={0.4} gradient />
        </div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="grid md:grid-cols-4 gap-5">
            <div className="relative">
              <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-base"
              />
            </div>

            <FilterSelect 
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              options={getUniqueSubjects().map(s => ({ value: s, label: s }))}
              placeholder="All Subjects"
            />

            <FilterSelect 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'passed', label: 'Passed (≥60%)' },
                { value: 'failed', label: 'Failed (<60%)' }
              ]}
              placeholder="All Status"
            />

            <FilterSelect 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'recent', label: 'Most Recent' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'highest', label: 'Highest Score' },
                { value: 'lowest', label: 'Lowest Score' }
              ]}
              placeholder="Sort By"
            />
          </div>

          {hasActiveFilters && (
            <motion.div 
              className="mt-6 pt-6 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base text-gray-600">
                Showing <span className="font-bold text-orange-600">{filteredQuizzes.length}</span> of {allQuizzes.length} quizzes
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <motion.div 
            className="bg-white rounded-3xl shadow-lg p-16 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <MdQuiz className="text-5xl text-orange-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No quizzes found</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results'
                : 'Start taking quizzes to build your learning history and track your progress'}
            </p>
            {hasActiveFilters && (
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setFilterSubject('all');
                  setFilterStatus('all');
                }}
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-600 transform transition-all duration-200 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => navigate(`/results/${quiz._id}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-500" />

                {quiz.percentage === bestScore && allQuizzes.length > 1 && (
                  <div className="absolute top-6 right-6">
                    <motion.div
                      className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-xl"
                      animate={{ rotate: [0, 3, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaCrown className="text-base" />
                      <span className="text-sm font-bold">BEST SCORE</span>
                    </motion.div>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-2xl mb-4 group-hover:text-orange-600 transition-colors duration-300">
                      {quiz.quizId?.title || 'Quiz'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-orange-100">
                        <MdQuiz className="mr-2 text-base" />
                        {quiz.quizId?.subjectName || 'Subject'}
                      </span>
                      <span className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-blue-100">
                        <MdAccessTime className="mr-2 text-base" />
                        {formatTime(quiz.timeTaken)}
                      </span>
                      <span className="text-gray-500 text-sm font-medium">
                        📅 {formatDate(quiz.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className={`text-4xl font-bold ${getScoreColor(quiz.percentage)} block`}>
                        {quiz.percentage}%
                      </span>
                      <span className="text-sm text-gray-500 font-medium mt-1 block">
                        {quiz.score}/{quiz.totalQuestions || quiz.userAnswers?.length} correct
                      </span>
                    </div>

                    <motion.button
                      className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MdVisibility className="text-2xl" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllQuizzes;