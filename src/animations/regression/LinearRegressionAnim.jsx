import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// Generate some dummy data for linear regression
const generateData = () => {
  const points = [];
  // True line: y = 0.6x + 20
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 100;
    const noise = (Math.random() - 0.5) * 30;
    const y = 0.6 * x + 20 + noise;
    points.push({ x, y });
  }
  return points;
};

const data = generateData();

const LinearRegressionAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentEpoch, setCurrentEpoch] = useState(0);
  
  // Pre-calculate gradient descent steps
  const steps = useMemo(() => {
    let m = 0; // slope
    let b = 0; // intercept
    const learningRate = 0.0001;
    const epochs = 50;
    const history = [];

    for (let e = 0; e <= epochs; e++) {
      let sumM = 0;
      let sumB = 0;
      let error = 0;

      for (let i = 0; i < data.length; i++) {
        const x = data[i].x;
        const y = data[i].y;
        const prediction = m * x + b;
        sumM += -2 * x * (y - prediction);
        sumB += -2 * (y - prediction);
        error += Math.pow(y - prediction, 2);
      }

      m = m - learningRate * (sumM / data.length);
      b = b - (learningRate * 50) * (sumB / data.length); // Boost b learning for visualization

      // Calculate line endpoints for SVG drawing (x=0 to x=100)
      history.push({
        epoch: e,
        m,
        b,
        y1: b,
        y2: m * 100 + b,
        mse: error / data.length
      });
    }
    return history;
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && currentEpoch < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentEpoch((prev) => {
          if (prev >= steps.length - 2) {
            clearInterval(interval);
            if (onComplete) onComplete();
            return steps.length - 1;
          }
          return prev + 1;
        });
      }, 100 / speed); // Animation speed
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentEpoch, steps.length, onComplete]);

  // If paused and restarted (handled by parent changing a key or passing a reset prop),
  // but let's assume parent unmounts/remounts or we need a way to reset.
  // Actually, parent passes isPlaying. When reset, we could expose a ref, but simple way is a key on the component.
  
  const currentStep = steps[currentEpoch];

  // SVG coordinates: Map 0-100 x and 0-100 y to SVG dimensions (e.g. 800x400)
  // Let's use viewBox="0 0 100 100" and let it scale
  
  return (
    <div className="w-full h-full relative p-4 flex flex-col">
      {/* Metrics Overlay */}
      <div className="absolute top-4 right-4 bg-[#050d1a]/80 border border-gray-800 rounded p-3 font-space text-xs backdrop-blur-sm z-20">
        <div className="text-gray-400 mb-1">Epoch: <span className="text-white">{currentStep.epoch}</span></div>
        <div className="text-gray-400 mb-1">MSE: <span className="text-[var(--color-cat-regression)]">{currentStep.mse.toFixed(2)}</span></div>
        <div className="text-gray-400">Equation: <span className="text-white">y = {currentStep.m.toFixed(2)}x + {currentStep.b.toFixed(2)}</span></div>
      </div>

      <svg viewBox="0 -10 100 120" className="w-full h-full drop-shadow-lg" preserveAspectRatio="xMidYMid meet">
        {/* Axes */}
        <line x1="0" y1="100" x2="100" y2="100" stroke="#374151" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#374151" strokeWidth="0.5" />

        {/* Data Points */}
        {data.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} 
            cy={100 - p.y} // SVG y-axis is inverted
            r="1" 
            fill="#4b5563" 
            opacity="0.8"
          />
        ))}

        {/* Current Regression Line */}
        <motion.line
          x1="0"
          y1={100 - currentStep.y1}
          x2="100"
          y2={100 - currentStep.y2}
          stroke="var(--color-cat-regression)"
          strokeWidth="1.5"
          initial={false}
          animate={{
            y1: 100 - currentStep.y1,
            y2: 100 - currentStep.y2,
          }}
          transition={{ type: "tween", duration: 0.1 }}
          strokeLinecap="round"
        />

        {/* Prediction Errors (Residuals) */}
        {isPlaying && data.map((p, i) => {
          const predY = currentStep.m * p.x + currentStep.b;
          return (
            <motion.line
              key={`err-${i}`}
              x1={p.x}
              y1={100 - p.y}
              x2={p.x}
              y2={100 - predY}
              stroke="var(--color-cat-regression)"
              strokeWidth="0.2"
              opacity="0.3"
              strokeDasharray="1 1"
              initial={false}
              animate={{
                y2: 100 - predY
              }}
              transition={{ type: "tween", duration: 0.1 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default LinearRegressionAnim;
