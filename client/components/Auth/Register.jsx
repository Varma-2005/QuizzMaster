import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import useAuth from '../../src/hooks/useAuth';
import Loading from '../common/Loading';
import { FaUser, FaEnvelope, FaLock, FaBrain, FaCheckCircle, FaBook, FaCalendar } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff, MdSchool } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  branch: yup.string().required('Branch is required'),
  year: yup.number().min(1).max(4).required('Year is required')
});

const benefits = [
  { text: 'Unlimited Quiz Access', delay: 0.4 },
  { text: 'Personalized Recommendations', delay: 0.5 },
  { text: 'Instant AI Explanations', delay: 0.6 }
];

const branches = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics' },
  { value: 'EEE', label: 'Electrical' },
  { value: 'MECH', label: 'Mechanical' },
  { value: 'CIVIL', label: 'Civil' },
  { value: 'IT', label: 'IT' }
];

const years = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' }
];

const FormField = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="text-gray-400" />
      </div>
      {children}
    </div>
    {error && <p className="text-red-500 text-sm mt-2">⚠️ {error.message}</p>}
  </div>
);

function Register() {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    const result = await registerUser(data);
    setSubmitLoading(false);
    
    if (result.success) {
      toast.success('Account created successfully! 🎉');
      navigate('/login');
    } else {
      toast.error(result.message || 'Registration failed. Please try again.');
    }
  };

  if (loading) return <Loading />;

  const inputClass = (error) => `w-full pl-12 pr-4 py-3 border-2 rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-orange-500 focus:bg-orange-50/30'
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex">
      
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
            <p className="text-orange-100 text-sm">Join thousands of B.Tech students</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Start Your<br />
              Learning <span className="underline decoration-wavy decoration-white/50">Journey</span><br />
              Today
            </h2>
            
            <p className="text-orange-100 text-lg mb-8 leading-relaxed">
              Create your account and get instant access to AI-powered quizzes, 
              personalized learning paths, and comprehensive performance analytics.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: benefit.delay }}
                  className="flex items-center space-x-3 text-white"
                >
                  <div className="bg-white/20 rounded-full p-2">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <span className="text-lg">{benefit.text}</span>
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
            <MdSchool className="text-white/20 text-[200px]" />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl"
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
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600 text-lg">Start your learning journey in minutes</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'firstName', icon: FaUser, placeholder: 'John', label: 'First Name' },
                { name: 'lastName', icon: FaUser, placeholder: 'Doe', label: 'Last Name' }
              ].map(({ name, icon, placeholder, label }) => (
                <FormField key={name} label={label} icon={icon} error={errors[name]}>
                  <input
                    {...register(name)}
                    type="text"
                    placeholder={placeholder}
                    className={inputClass(errors[name])}
                  />
                </FormField>
              ))}
            </div>

            <FormField label="Email Address" icon={FaEnvelope} error={errors.email}>
              <input
                {...register('email')}
                type="email"
                placeholder="your.email@example.com"
                className={inputClass(errors.email)}
              />
            </FormField>

            <FormField label="Password" icon={FaLock} error={errors.password}>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                className={`${inputClass(errors.password)} pr-14`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? <MdVisibilityOff className="text-2xl" /> : <MdVisibility className="text-2xl" />}
              </button>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Branch" icon={FaBook} error={errors.branch}>
                <select {...register('branch')} className={`${inputClass(errors.branch)} appearance-none`}>
                  <option value="">Select Branch</option>
                  {branches.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Year" icon={FaCalendar} error={errors.year}>
                <select {...register('year')} className={`${inputClass(errors.year)} appearance-none`}>
                  <option value="">Select Year</option>
                  {years.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </FormField>
            </div>

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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 font-bold hover:text-orange-600 hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            By registering, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;