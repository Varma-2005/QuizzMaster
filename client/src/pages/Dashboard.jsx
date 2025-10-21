import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';

// Import Dashboard Components
import StatusCard from '../../components/DashBoard/StatusCard';
import ProgressChart from '../../components/DashBoard/ProgressChart';
import RecentQuizzes from '../../components/DashBoard/RecentQuizzes';

// Import Icons
import { MdQuiz, MdTrendingUp, MdHistory, MdAccessTime } from 'react-icons/md';
import { FaTrophy, FaBook, FaChartLine, FaRocket } from 'react-icons/fa';

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data for user:', user._id);
      
      const response = await api.get(`/dashboard-api/${user._id}`);
      console.log('✅ Dashboard API response:', response.data);
      
      const { progress, recentResults } = response.data.payload;
      const stats = calculateStats(progress, recentResults);
      
      setDashboardData({
        overallStats: stats.overallStats,
        subjectProgress: stats.subjectProgress,
        recentResults: recentResults || []
      });
      
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      setDashboardData({
        overallStats: {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0
        },
        subjectProgress: [],
        recentResults: []
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (progress, recentResults) => {
    let overallStats = {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0
    };

    let subjectProgress = [];

    if (progress) {
      overallStats = {
        totalQuizzes: progress.totalQuizzes || 0,
        averageScore: Math.round(progress.averageScore || 0),
        bestScore: 0
      };

      if (progress.subjectProgress && progress.subjectProgress.length > 0) {
        subjectProgress = progress.subjectProgress.map(sp => ({
          subjectId: sp.subjectId?._id || sp.subjectId,
          subjectName: sp.subjectId?.name || sp.subjectId?.fullName || 'Unknown Subject',
          quizzesCompleted: sp.quizzesTaken || 0,
          averageScore: Math.round(sp.averageScore || 0),
          bestScore: Math.round(sp.bestScore || 0)
        }));
      }
    }

    if (recentResults && recentResults.length > 0) {
      const allScores = recentResults.map(r => r.percentage || 0);
      overallStats.bestScore = Math.max(...allScores);

      const subjectMap = {};
      
      recentResults.forEach(result => {
        const subjectName = result.quizId?.subjectName || 'Unknown';
        const subjectId = result.quizId?.subjectId?._id || result.quizId?._id || 'unknown';
        
        if (!subjectMap[subjectName]) {
          subjectMap[subjectName] = {
            subjectId,
            subjectName,
            scores: [],
            quizzesCompleted: 0
          };
        }
        
        subjectMap[subjectName].scores.push(result.percentage || 0);
        subjectMap[subjectName].quizzesCompleted += 1;
      });

      const calculatedSubjects = Object.values(subjectMap).map(subject => ({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        quizzesCompleted: subject.quizzesCompleted,
        averageScore: Math.round(subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length),
        bestScore: Math.max(...subject.scores)
      }));

      if (subjectProgress.length === 0) {
        subjectProgress = calculatedSubjects;
      } else {
        subjectProgress = calculatedSubjects;
      }
    }

    return {
      overallStats,
      subjectProgress
    };
  };

  if (loading) return <Loading fullScreen variant="logo" text="Loading dashboard..." />;

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center pt-28">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 text-xl font-semibold mb-4">No dashboard data available</p>
          <motion.button 
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl font-bold transition-all duration-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const { overallStats, subjectProgress, recentResults } = dashboardData;

  const totalTimeSpent = recentResults?.reduce((sum, result) => {
    const time = result.timeTaken || result.timeSpent || result.timeTakenSeconds || 0;
    return sum + time;
  }, 0) || 0;
  
  let totalTimeDisplay = '0m';
  if (totalTimeSpent > 0) {
    const hours = totalTimeSpent / 3600;
    const minutes = Math.round(totalTimeSpent / 60);
    
    if (hours >= 1) {
      totalTimeDisplay = `${hours.toFixed(1)}h`;
    } else if (minutes > 0) {
      totalTimeDisplay = `${minutes}m`;
    } else {
      totalTimeDisplay = `${totalTimeSpent}s`;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 pt-32">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 text-xl">
            Track your B.Tech quiz progress and performance
          </p>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <StatusCard
              icon={MdQuiz}
              title="Total Quizzes"
              value={overallStats?.totalQuizzes || 0}
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
              valueColor="text-blue-600"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <StatusCard
              icon={FaChartLine}
              title="Average Score"
              value={`${overallStats?.averageScore || 0}%`}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
              valueColor="text-orange-600"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <StatusCard
              icon={FaTrophy}
              title="Best Score"
              value={`${overallStats?.bestScore || 0}%`}
              bgColor="bg-green-50"
              iconColor="text-green-600"
              valueColor="text-green-600"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <StatusCard
              icon={MdAccessTime}
              title="Total Time"
              value={totalTimeDisplay}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
              valueColor="text-purple-600"
            />
          </motion.div>
        </div>

        {/* Progress Chart */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <ProgressChart quizHistory={recentResults || []} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          
          {/* Subject Progress Card */}
          <motion.div 
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <FaBook className="text-3xl text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Subject Progress</h2>
            </div>
            
            {subjectProgress && subjectProgress.length > 0 ? (
              <div className="space-y-6">
                {subjectProgress.map((subject, index) => (
                  <motion.div 
                    key={subject.subjectId || index} 
                    className="border-b border-gray-200 pb-5 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-800 text-lg">
                        {subject.subjectName}
                      </span>
                      <span className="text-2xl font-bold text-orange-600">
                        {subject.averageScore}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                      <motion.div 
                        className={`h-3 rounded-full ${
                          subject.averageScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                          subject.averageScore >= 60 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                          'bg-gradient-to-r from-rose-400 to-rose-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.averageScore}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      ></motion.div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center font-medium">
                          <MdQuiz className="mr-1.5 text-base" />
                          {subject.quizzesCompleted} quizzes
                        </span>
                        <span className="flex items-center font-medium">
                          <FaTrophy className="mr-1.5 text-base text-yellow-500" />
                          Best: {subject.bestScore}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaBook className="text-8xl text-gray-300 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-800 text-xl font-bold mb-2">No subject progress yet</p>
                <p className="text-gray-500 text-base">
                  Start taking quizzes to see your progress
                </p>
              </div>
            )}
          </motion.div>

          {/* Recent Quizzes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <RecentQuizzes quizzes={recentResults || []} />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <div className="bg-orange-100 p-3 rounded-2xl mr-3">
              <MdTrendingUp className="text-2xl text-orange-500" />
            </div>
            Quick Actions
          </h2>
          
          <div className="flex justify-center">
            <motion.div 
              className="w-full md:w-2/3 lg:w-1/2"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} 
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/quiz-selection"
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-6 rounded-2xl hover:from-orange-500 hover:to-orange-600 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-xl"
              >
                <MdQuiz className="text-3xl" />
                <span>Start New Quiz</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Motivational Section */}
        {overallStats?.totalQuizzes > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="text-center relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaRocket className="text-6xl mx-auto mb-4" />
              </motion.div>
              <h3 className="text-3xl font-bold mb-3">
                Keep Going! 🚀
              </h3>
              <p className="text-xl">
                {overallStats.averageScore >= 80 
                  ? "You're doing amazing! Keep up the excellent work!"
                  : overallStats.averageScore >= 60
                  ? "Great progress! A little more practice will get you to excellence!"
                  : "Every quiz makes you better! Keep practicing and you'll improve!"
                }
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;