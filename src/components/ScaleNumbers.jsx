import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ScaleNumbers = ({ value, label, suffix = '', duration = 2 }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrentValue(Math.floor(easeOut * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentValue(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-space font-bold text-white mb-1">
        {currentValue.toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] font-space text-gray-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export default ScaleNumbers;
