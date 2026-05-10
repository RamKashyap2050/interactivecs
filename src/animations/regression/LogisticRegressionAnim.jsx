import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const generateLogisticData = () => {
  const points = [];
  // Class 0
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 45 + 5; // 5 to 50
    points.push({ x, y: 0, class: 0 });
  }
  // Class 1
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 45 + 50; // 50 to 95
    points.push({ x, y: 1, class: 1 });
  }
  // Add some overlapping noise
  points.push({ x: 48, y: 1, class: 1 });
  points.push({ x: 52, y: 0, class: 0 });
  return points;
};

const data = generateLogisticData();

const LogisticRegressionAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentEpoch, setCurrentEpoch] = useState(0);

  const steps = useMemo(() => {
    let w = 0.0;
    let b = 0.0;
    const learningRate = 10.0; // Increased significantly to force convergence to a sharp S-curve
    const epochs = 100;
    const history = [];

    // Scale x down for stable gradient descent
    const scaledData = data.map(p => ({ x: p.x / 100, y: p.y }));

    for (let e = 0; e <= epochs; e++) {
      let dw = 0;
      let db = 0;
      let loss = 0;

      for (let i = 0; i < scaledData.length; i++) {
        const x = scaledData[i].x;
        const y = scaledData[i].y;
        
        // Sigmoid prediction
        const z = w * x + b;
        const y_pred = 1 / (1 + Math.exp(-z));
        
        // Gradient
        dw += (y_pred - y) * x;
        db += (y_pred - y);

        // Binary Cross-Entropy Loss
        const epsilon = 1e-15;
        loss += -y * Math.log(y_pred + epsilon) - (1 - y) * Math.log(1 - y_pred + epsilon);
      }

      dw /= scaledData.length;
      db /= scaledData.length;
      loss /= scaledData.length;

      // Unscale w and b back to original x range [0, 100] for drawing
      history.push({
        epoch: e,
        w: w / 100,
        b: b,
        loss: loss
      });

      // Update weights
      w -= learningRate * dw;
      b -= learningRate * db;
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
      }, 100 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentEpoch, steps.length, onComplete]);

  const currentStep = steps[currentEpoch];

  // Map Y: 1 maps to svg Y=10, 0 maps to svg Y=90
  const mapY = (y) => 90 - y * 80;

  // Generate SVG path for the sigmoid curve
  const createSigmoidPath = (w, b) => {
    let d = "";
    for (let x = 0; x <= 100; x += 2) {
      const z = w * x + b;
      const y = 1 / (1 + Math.exp(-z));
      const px = x;
      const py = mapY(y);
      if (x === 0) {
        d += `M ${px} ${py}`;
      } else {
        d += ` L ${px} ${py}`;
      }
    }
    return d;
  };

  const sigmoidPath = createSigmoidPath(currentStep.w, currentStep.b);

  return (
    <div className="w-full h-[500px] relative p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
        </div>

        <svg viewBox="0 -10 100 120" className="w-full h-full drop-shadow-md" preserveAspectRatio="none">
          {/* Grid lines for 0 and 1 */}
          <line x1="0" y1={mapY(1)} x2="100" y2={mapY(1)} stroke="#374151" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="0" y1={mapY(0)} x2="100" y2={mapY(0)} stroke="#374151" strokeWidth="0.5" strokeDasharray="2 2" />
          <text x="2" y={mapY(1) - 2} fill="#6b7280" fontSize="3" fontFamily="monospace">Probability = 1 (Class 1)</text>
          <text x="2" y={mapY(0) + 4} fill="#6b7280" fontSize="3" fontFamily="monospace">Probability = 0 (Class 0)</text>

          {/* Sigmoid Curve */}
          <motion.path
            d={sigmoidPath}
            fill="none"
            stroke="var(--color-cat-classification)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={false}
            animate={{ d: sigmoidPath }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />

          {/* Data Points */}
          {data.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={mapY(p.y)} 
              r="1.5" 
              fill={p.class === 1 ? 'var(--color-cat-classification)' : '#9ca3af'} 
              opacity="0.8" 
            />
          ))}

          {/* Decision Boundary (x where probability = 0.5) */}
          {(() => {
            // 0.5 = 1 / (1 + exp(-(wx+b))) => wx+b = 0 => x = -b/w
            const boundaryX = -currentStep.b / currentStep.w;
            if (boundaryX > 0 && boundaryX < 100) {
              return (
                <motion.line
                  x1={boundaryX} y1="0" x2={boundaryX} y2="100"
                  stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6"
                  initial={false}
                  animate={{ x1: boundaryX, x2: boundaryX }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />
              );
            }
            return null;
          })()}
        </svg>
      </div>

      <div className="w-full md:w-64 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-classification)] mb-2 uppercase tracking-wide">Epoch {currentStep.epoch}</h3>
          <p className="text-xs text-gray-400 font-source mb-6">
            Logistic Regression squashes a linear combination of inputs through a Sigmoid function to output a probability between 0 and 1.
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 ${isPlaying ? 'bg-[var(--color-cat-classification)]/10 border-[var(--color-cat-classification)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Sigmoid Function</div>
              <div className="text-[var(--color-cat-classification)] text-sm">
                <MathBlock math={`P(y=1) = \\frac{1}{1 + e^{-(wx + b)}}`} block={false} />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-800 bg-transparent">
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Current Weights</div>
              <div className="text-gray-300 font-mono text-sm flex flex-col gap-1">
                <span>w: {currentStep.w.toFixed(4)}</span>
                <span>b: {currentStep.b.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-xs font-space text-gray-400">
            <span>Log Loss:</span>
            <span className="text-white">{currentStep.loss.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticRegressionAnim;
