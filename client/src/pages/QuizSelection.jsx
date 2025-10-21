import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import useQuiz from '../hooks/useQuiz';
import api from '../services/api';
import Loading from '../../components/common/Loading';
import { MdQuiz, MdTimer, MdTrendingUp, MdArrowForward, MdCheckCircle } from 'react-icons/md';
import { FaDatabase, FaDesktop, FaNetworkWired, FaCode, FaBrain, FaRocket } from 'react-icons/fa';
import { toast } from 'react-toastify';

function QuizSelection() {
  const { user } = useAuth();
  const { generateAIQuiz, loading } = useQuiz();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(15);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subject-api/');
      setSubjects(response.data.payload);
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setSubjectsLoading(false);
    }
  };

  const getSubjectConfig = (subjectName) => {
    const configMap = {
      'DBMS': { 
        icon: FaDatabase, 
        gradient: 'from-blue-400 to-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-600'
      },
      'OS': { 
        icon: FaDesktop, 
        gradient: 'from-green-400 to-green-600',
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-600'
      },
      'CN': { 
        icon: FaNetworkWired, 
        gradient: 'from-purple-400 to-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-500',
        text: 'text-purple-600'
      },
      'DSA': { 
        icon: FaCode, 
        gradient: 'from-orange-400 to-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-600'
      }
    };
    return configMap[subjectName] || { 
      icon: MdQuiz, 
      gradient: 'from-gray-400 to-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-500',
      text: 'text-gray-600'
    };
  };

  const getDifficultyConfig = (level) => {
    const configMap = {
      'Easy': { color: 'green', gradient: 'from-green-400 to-green-600' },
      'Medium': { color: 'orange', gradient: 'from-orange-400 to-orange-600' },
      'Hard': { color: 'red', gradient: 'from-red-400 to-red-600' }
    };
    return configMap[level] || configMap['Medium'];
  };

  const handleGenerateQuiz = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    const quizData = {
      userId: user._id,
      subjectId: selectedSubject,
      difficulty,
      questionCount
    };

    const result = await generateAIQuiz(quizData);
    if (result.success) {
      navigate(`/quiz/${result.quiz._id}`);
    }
  };

  if (subjectsLoading) return <Loading />;

  const selectedSubjectData = subjects.find(s => s._id === selectedSubject);
  const difficultyConfig = getDifficultyConfig(difficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-3">
              <FaBrain className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              AI Quiz Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Create your personalized quiz in 3 simple steps
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Subject Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 rounded-xl p-2">
                  <span className="text-2xl font-bold text-orange-500">1</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Select Subject</h2>
                  <p className="text-gray-600">Choose what you want to practice</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {subjects.map((subject) => {
                  const config = getSubjectConfig(subject.name);
                  const IconComponent = config.icon;
                  const isSelected = selectedSubject === subject._id;
                  
                  return (
                    <motion.div
                      key={subject._id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSubject(subject._id)}
                      className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? `${config.border} ${config.bg} shadow-lg`
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <MdCheckCircle className={`text-2xl ${config.text}`} />
                        </div>
                      )}
                      <div className={`bg-gradient-to-r ${config.gradient} rounded-xl p-3 w-fit mb-3`}>
                        <IconComponent className="text-3xl text-white" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">{subject.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{subject.fullName}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 2: Difficulty Level */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 rounded-xl p-2">
                  <span className="text-2xl font-bold text-orange-500">2</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Choose Difficulty</h2>
                  <p className="text-gray-600">Pick your challenge level</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {['Easy', 'Medium', 'Hard'].map((level) => {
                  const config = getDifficultyConfig(level);
                  const isSelected = difficulty === level;
                  
                  return (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(level)}
                      className={`py-4 rounded-2xl font-bold transition-all ${
                        isSelected
                          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 3: Question Count */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 rounded-xl p-2">
                  <span className="text-2xl font-bold text-orange-500">3</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Set Questions</h2>
                  <p className="text-gray-600">How many questions do you want?</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Number of Questions</span>
                  <div className="bg-orange-100 text-orange-600 px-6 py-2 rounded-2xl font-bold text-lg">
                    {questionCount}
                  </div>
                </div>
                
                <input
                  type="range"
                  min="5"
                  max="24"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5 questions</span>
                  <span>~{Math.ceil(questionCount * 0.83)} min</span>
                  <span>24 questions</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary & Generate */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Quiz Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl shadow-2xl p-8 text-white"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MdQuiz className="text-4xl" />
                  <h3 className="text-2xl font-bold">Quiz Summary</h3>
                </div>
                
                {selectedSubject ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-orange-100 text-sm mb-1">Subject</p>
                      <p className="text-xl font-bold">{selectedSubjectData?.fullName}</p>
                    </div>
                    
                    <div>
                      <p className="text-orange-100 text-sm mb-1">Difficulty</p>
                      <p className="text-xl font-bold">{difficulty}</p>
                    </div>
                    
                    <div>
                      <p className="text-orange-100 text-sm mb-1">Questions</p>
                      <p className="text-xl font-bold">{questionCount} Questions</p>
                    </div>
                    
                    <div>
                      <p className="text-orange-100 text-sm mb-1">Estimated Time</p>
                      <p className="text-xl font-bold">{Math.ceil(questionCount * 0.83)} minutes</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-orange-100">Select a subject to see quiz details</p>
                )}
              </motion.div>

              {/* Generate Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleGenerateQuiz}
                disabled={!selectedSubject || loading}
                whileHover={{ scale: selectedSubject && !loading ? 1.03 : 1 }}
                whileTap={{ scale: selectedSubject && !loading ? 0.98 : 1 }}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                  selectedSubject && !loading
                    ? 'bg-white text-orange-500 hover:shadow-2xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } flex items-center justify-center space-x-3`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <FaRocket className="text-2xl" />
                    <span>Generate AI Quiz</span>
                    <MdArrowForward className="text-2xl" />
                  </>
                )}
              </motion.button>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50 rounded-2xl p-6 border border-blue-200"
              >
                <div className="flex items-start space-x-3">
                  <FaBrain className="text-2xl text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">AI-Powered</h4>
                    <p className="text-sm text-blue-700">
                      Questions are generated using advanced AI based on your preferences. 
                      Each quiz includes detailed explanations.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizSelection;