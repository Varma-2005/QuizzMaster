import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import useAuth from '../../src/hooks/useAuth';
import Loading from '../common/Loading';
import { FaEnvelope, FaLock, FaBrain, FaCheckCircle } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff, MdQuiz } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const features = [
  { text: 'AI-Generated Questions', delay: 0.4 },
  { text: 'Real-time Progress Tracking', delay: 0.5 },
  { text: 'Detailed Performance Analytics', delay: 0.6 }
];

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    const result = await login(data);
    setSubmitLoading(false);
    
    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed. Please try again.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex">
      
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white rounded-2xl p-3 shadow-xl">
                <FaBrain className="text-4xl text-orange-500" />
              </div>
              <h1 className="text-3xl font-bold text-white">QuizMaster</h1>
            </div>
            <p className="text-orange-100 text-sm">Your B.Tech Learning Companion</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Learn, Practice<br />
              and <span className="underline decoration-wavy decoration-white/50">Master</span><br />
              Your Subjects
            </h2>
            
            <p className="text-orange-100 text-lg mb-8 leading-relaxed">
              Take AI-powered quizzes, track your progress, and excel in your B.Tech journey. 
              Practice makes perfect, and we're here to help you succeed.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: feature.delay }}
                  className="flex items-center space-x-3 text-white"
                >
                  <FaCheckCircle className="text-2xl flex-shrink-0" />
                  <span className="text-lg">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 right-12"
          >
            <MdQuiz className="text-white/20 text-[200px]" />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="bg-orange-500 rounded-2xl p-3">
                <FaBrain className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">QuizMaster</h1>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 text-lg">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {[
              { name: 'email', icon: FaEnvelope, type: 'email', placeholder: 'your.email@example.com', label: 'Email Address' },
              { name: 'password', icon: FaLock, type: showPassword ? 'text' : 'password', placeholder: 'Enter your password', label: 'Password' }
            ].map(({ name, icon: Icon, type, placeholder, label }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="text-gray-400 text-lg" />
                  </div>
                  <input
                    {...register(name)}
                    type={type}
                    placeholder={placeholder}
                    className={`w-full pl-12 ${name === 'password' ? 'pr-14' : 'pr-4'} py-4 border-2 rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none ${
                      errors[name]
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 bg-white focus:border-orange-500 focus:bg-orange-50/30'
                    }`}
                  />
                  {name === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? <MdVisibilityOff className="text-2xl" /> : <MdVisibility className="text-2xl" />}
                    </button>
                  )}
                </div>
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors[name].message}
                  </p>
                )}
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={submitLoading}
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-600 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              whileHover={{ scale: submitLoading ? 1 : 1.02 }}
              whileTap={{ scale: submitLoading ? 1 : 0.98 }}
            >
              {submitLoading ? (
                <span className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin mr-2 text-xl" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 font-bold hover:text-orange-600 hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Secure & Fast • B.Tech Quiz Platform
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;