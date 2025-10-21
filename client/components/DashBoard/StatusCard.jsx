import React from 'react';
import { motion } from 'framer-motion';

const StatusCard = ({ 
  icon: Icon, 
  title, 
  value, 
  bgColor = 'bg-blue-50', 
  iconColor = 'text-blue-600', 
  valueColor = 'text-blue-700',
  trend = null, // { value: 12, isPositive: true }
  subtitle = null // Optional subtitle text
}) => {

  // Format large numbers (with commas)
  const formatValue = (val) => {
    if (typeof val === 'number') return val.toLocaleString();
    return val;
  };

  // Card color schemes
  const colorStyles = {
    'bg-blue-50': {
      iconBg: 'bg-blue-500',
      valueColor: 'text-blue-700',
      blobColor: 'bg-blue-200'
    },
    'bg-green-50': {
      iconBg: 'bg-green-500',
      valueColor: 'text-green-700',
      blobColor: 'bg-green-200'
    },
    'bg-purple-50': {
      iconBg: 'bg-purple-500',
      valueColor: 'text-purple-700',
      blobColor: 'bg-purple-200'
    },
    'bg-orange-50': {
      cardBg: 'bg-gradient-to-br from-orange-400 to-orange-500',
      iconBg: 'bg-white/30',
      valueColor: 'text-white',
      blobColor: 'bg-white/20',
      textColor: 'text-white',
      gradient: true
    },
    'bg-red-50': {
      iconBg: 'bg-red-500',
      valueColor: 'text-red-700',
      blobColor: 'bg-red-200'
    },
    'bg-rose-50': {
      iconBg: 'bg-rose-500',
      valueColor: 'text-rose-700',
      blobColor: 'bg-rose-200'
    },
    'bg-yellow-50': {
      iconBg: 'bg-yellow-500',
      valueColor: 'text-yellow-700',
      blobColor: 'bg-yellow-200'
    },
    'bg-indigo-50': {
      iconBg: 'bg-indigo-500',
      valueColor: 'text-indigo-700',
      blobColor: 'bg-indigo-200'
    },
    'bg-pink-50': {
      iconBg: 'bg-pink-500',
      valueColor: 'text-pink-700',
      blobColor: 'bg-pink-200'
    },
    'bg-teal-50': {
      iconBg: 'bg-teal-500',
      valueColor: 'text-teal-700',
      blobColor: 'bg-teal-200'
    }
  };

  const styles = colorStyles[bgColor] || colorStyles['bg-blue-50'];
  const isGradient = bgColor === 'bg-orange-50';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl shadow-lg ${
        styles.cardBg || 'bg-white'
      } p-8 transition-all duration-300 group`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background blob */}
      <motion.div
        className={`absolute top-0 right-0 w-32 h-32 ${styles.blobColor} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col space-y-4">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <motion.div
            className={`${styles.iconBg} p-4 rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110`}
          >
            {Icon && <Icon className={`text-3xl text-white`} />}
          </motion.div>

          {/* Trend */}
          {trend && (
            <motion.div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                trend.isPositive ? 'bg-green-500' : 'bg-rose-500'
              } text-white`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3, type: 'spring', stiffness: 200 }}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}%</span>
            </motion.div>
          )}
        </div>

        {/* Title */}
        <p
          className={`text-sm font-semibold ${
            isGradient ? 'text-white/90' : 'text-gray-600'
          }`}
        >
          {title}
        </p>

        {/* Main value */}
        <motion.p
          className={`text-4xl font-bold ${styles.valueColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {formatValue(value)}
        </motion.p>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className={`text-sm mt-1 ${
              isGradient ? 'text-white/80' : 'text-gray-500'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-30 rounded-3xl transition-opacity duration-300"
      />
    </motion.div>
  );
};

export default StatusCard;
