import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ initialTime = 0, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);
  const hasCalledOnTimeUp = useRef(false);

  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
    hasCalledOnTimeUp.current = false;
  }, [initialTime]);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          if (!hasCalledOnTimeUp.current && onTimeUp) {
            hasCalledOnTimeUp.current = true;
            onTimeUp();
          }

          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isActive, onTimeUp, timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const getTimerStyles = () => {
    if (timeLeft <= 60) return 'text-red-600 font-bold animate-pulse';
    if (timeLeft <= 300) return 'text-orange-600 font-bold';
    return 'text-gray-800';
  };

  return (
    <div className="text-center">
      <div className={`text-2xl font-mono ${getTimerStyles()}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {timeLeft <= 0 ? 'Time Up!' : 'Time Remaining'}
      </div>
    </div>
  );
};

export default Timer;
