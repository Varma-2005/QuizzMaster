import React from 'react';
import { motion } from 'framer-motion';

const sizes = {
  small: "px-4 py-2 text-sm",
  medium: "px-6 py-3 text-base",
  large: "px-8 py-4 text-lg"
};

const variants = {
  primary: "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 active:from-orange-600 active:to-orange-700 disabled:from-orange-300 disabled:to-orange-400",
  secondary: "bg-white text-gray-800 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 active:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400",
  success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 disabled:from-green-300 disabled:to-green-400",
  danger: "bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 active:from-rose-700 active:to-rose-800 disabled:from-rose-300 disabled:to-rose-400",
  outline: "border-2 border-orange-500 text-orange-500 bg-white hover:bg-orange-50 active:bg-orange-100 disabled:border-orange-300 disabled:text-orange-300",
  ghost: "bg-transparent text-orange-500 hover:bg-orange-50 active:bg-orange-100 disabled:text-orange-300"
};

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  disabled = false,
  className = "",
  size = "medium",
  icon = null,
  fullWidth = false,
  loading = false
}) {
  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={isDisabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {loading ? <LoadingSpinner /> : icon && <span>{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}

export default Button;