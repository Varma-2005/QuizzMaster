import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain } from 'react-icons/fa';

function Loading({ 
  size = "medium", 
  fullScreen = false,
  text = "Loading...",
  variant = "spinner"
}) {
  
  const sizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-24 h-24"
  };

  const SpinnerVariant = () => (
    <motion.div
      className={`${sizes[size]} border-4 border-orange-200 border-t-orange-500 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const DotsVariant = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-4 h-4 bg-orange-500 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );

  const PulseVariant = () => (
    <div className="relative flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} bg-orange-500 rounded-full`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute ${sizes[size]} bg-orange-400 rounded-full`}
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );

  const LogoVariant = () => (
    <div className="relative">
      <motion.div
        className="absolute inset-0 bg-orange-200 rounded-full blur-2xl scale-150"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-3xl shadow-xl"
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaBrain className="text-white text-6xl" />
      </motion.div>
    </div>
  );

  const BarsVariant = () => (
    <div className="flex space-x-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-3 bg-orange-500 rounded-full"
          animate={{ height: ["20px", "50px", "20px"] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );

  const variants = {
    dots: DotsVariant,
    pulse: PulseVariant,
    logo: LogoVariant,
    bars: BarsVariant,
    spinner: SpinnerVariant
  };

  const VariantComponent = variants[variant] || SpinnerVariant;

  return (
    <div className={fullScreen
      ? "fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 z-50"
      : "flex flex-col items-center justify-center py-12"
    }>
      {fullScreen && (
        <>
          <div className="fixed top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 -z-10" />
          <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10" />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <VariantComponent />
      </motion.div>

      {text && (
        <>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-gray-800 font-bold text-xl"
          >
            {text}
          </motion.p>

          <div className="flex space-x-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2.5 h-2.5 bg-orange-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Loading;