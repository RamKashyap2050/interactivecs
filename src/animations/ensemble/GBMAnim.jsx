import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

// Generate some dummy data (a noisy sine wave)
const generateData = () => {
  const points = [];
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 90 + 5; // x between 5 and 95
    const y = Math.sin(x / 15) * 15 + (Math.random() - 0.5) * 10;
    points.push({ x, y });
  }
  return points.sort((a, b) => a.x - b.x);
};

const data = generateData();

// Helper to fit a simple decision stump (1 split) to residuals
const fitStump = (xArr, rArr) => {
  let bestSplit = 50;
  let bestMSE = Infinity;
  let bestL = 0;
  let bestR = 0;

  for (let i = 1; i < xArr.length; i++) {
    const split = (xArr[i-1] + xArr[i]) / 2;
    const left = rArr.slice(0, i);
    const right = rArr.slice(i);
    const meanL = left.reduce((a, b) => a + b, 0) / left.length;
    const meanR = right.reduce((a, b) => a + b, 0) / right.length;
    
    let mse = 0;
    for (let r of left) mse += Math.pow(r - meanL, 2);
    for (let r of right) mse += Math.pow(r - meanR, 2);
    
    if (mse < bestMSE) {
      bestMSE = mse;
      bestSplit = split;
      bestL = meanL;
      bestR = meanR;
    }
  }
  return { split: bestSplit, L: bestL, R: bestR };
};

const GBMAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentEpoch, setCurrentEpoch] = useState(0);
  
  // Pre-calculate boosting steps
  const steps = useMemo(() => {
    const history = [];
    const learningRate = 0.5; // High learning rate for visual effect
    const epochs = 15;
    
    const xArr = data.map(d => d.x);
    const yArr = data.map(d => d.y);
    
    // Initial prediction: mean of y
    const meanY = yArr.reduce((a, b) => a + b, 0) / yArr.length;
    let currentF = Array(yArr.length).fill(meanY);
    
    for (let e = 0; e <= epochs; e++) {
      // 1. Calculate pseudo-residuals
      const residuals = [];
      let mse = 0;
      for (let i = 0; i < data.length; i++) {
        const r = yArr[i] - currentF[i];
        residuals.push(r);
        mse += r * r;
      }
      mse /= data.length;

      // 2. Fit weak learner (decision stump) to residuals
      const stump = fitStump(xArr, residuals);
      
      // 3. Record state BEFORE updating F
      history.push({
        epoch: e,
        F: [...currentF],
        residuals: [...residuals],
        stump: { ...stump },
        learningRate,
        mse
      });

      // 4. Update F for the next epoch
      for (let i = 0; i < data.length; i++) {
        const h_x = xArr[i] < stump.split ? stump.L : stump.R;
        currentF[i] += learningRate * h_x;
      }
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
      }, 1500 / speed); // Slow enough to see the morphing
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentEpoch, steps.length, onComplete]);

  const currentStep = steps[currentEpoch];

  // Map coordinates
  // Top chart y domain: [-30, 30] -> svg y [100, 10]
  const mapTopY = (y) => 55 - (y / 30) * 45;
  // Bottom chart y domain: [-30, 30] -> svg y [210, 120]
  const mapBottomY = (y) => 165 - (y / 30) * 45;

  // SVG Path generator for F(x) and step function
  const createStepPath = (F_arr) => {
    if (F_arr.length === 0) return "";
    let d = `M 0 ${mapTopY(F_arr[0])}`;
    for (let i = 0; i < data.length; i++) {
      d += ` L ${data[i].x} ${mapTopY(F_arr[i])}`;
    }
    d += ` L 100 ${mapTopY(F_arr[F_arr.length - 1])}`;
    return d;
  };

  const currentFPath = createStepPath(currentStep.F);
  
  // Create path for the weak learner in the bottom chart
  const stumpPathBottom = `M 0 ${mapBottomY(currentStep.stump.L)} 
                           L ${currentStep.stump.split} ${mapBottomY(currentStep.stump.L)} 
                           L ${currentStep.stump.split} ${mapBottomY(currentStep.stump.R)} 
                           L 100 ${mapBottomY(currentStep.stump.R)}`;

  return (
    <div className="w-full h-[600px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* Visual Canvas */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
        </div>

        <svg viewBox="0 0 100 220" className="w-full h-full drop-shadow-md" preserveAspectRatio="none">
          
          {/* ================= TOP CHART (Main Model) ================= */}
          <rect x="0" y="0" width="100" height="110" fill="#050d1a" />
          <line x1="0" y1={mapTopY(0)} x2="100" y2={mapTopY(0)} stroke="#1f2937" strokeWidth="0.5" />
          <text x="2" y="10" fill="#6b7280" fontSize="4" fontFamily="monospace">Model F(x)</text>
          
          {/* Main Prediction Curve */}
          <motion.path
            d={currentFPath}
            fill="none"
            stroke="var(--color-cat-ensemble)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: currentFPath }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />

          {/* True Data Points and dropping Residuals */}
          {data.map((p, i) => {
            const f_y = currentStep.F[i];
            return (
              <g key={`top-pt-${i}`}>
                {/* Vertical distance line (Error) */}
                <motion.line
                  x1={p.x}
                  x2={p.x}
                  y1={mapTopY(p.y)}
                  y2={mapTopY(f_y)}
                  stroke="#ef4444"
                  strokeWidth="0.3"
                  strokeDasharray="1 1"
                  opacity="0.5"
                  initial={false}
                  animate={{ y2: mapTopY(f_y) }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                {/* Data Point */}
                <circle cx={p.x} cy={mapTopY(p.y)} r="1" fill="#e5e7eb" opacity="0.8" />
              </g>
            );
          })}


          {/* ================= BOTTOM CHART (Residuals) ================= */}
          <rect x="0" y="110" width="100" height="110" fill="#000" opacity="0.3" />
          <line x1="0" y1={mapBottomY(0)} x2="100" y2={mapBottomY(0)} stroke="#374151" strokeWidth="0.5" strokeDasharray="2 2" />
          <text x="2" y="120" fill="#6b7280" fontSize="4" fontFamily="monospace">Residuals (Error)</text>

          {/* Residual Data Points falling into bottom chart */}
          {data.map((p, i) => {
            const residual = currentStep.residuals[i];
            return (
              <motion.circle
                key={`bot-pt-${i}`}
                cx={p.x}
                cy={mapBottomY(residual)}
                r="0.8"
                fill="#ef4444"
                initial={false}
                animate={{ cy: mapBottomY(residual) }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            );
          })}

          {/* Weak Learner (Decision Stump) trying to fit residuals */}
          <motion.path
            d={stumpPathBottom}
            fill="none"
            stroke="var(--color-cat-unsupervised)"
            strokeWidth="1"
            strokeDasharray="2 1"
            initial={false}
            animate={{ d: stumpPathBottom }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          
        </svg>
      </div>

      {/* Math & Theory Panel */}
      <div className="w-full md:w-64 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-ensemble)] mb-2 uppercase tracking-wide">Epoch {currentStep.epoch}</h3>
          <p className="text-xs text-gray-400 font-source mb-6">
            GBM builds a model by sequentially adding small "weak" trees that focus exactly on what the previous model got wrong.
          </p>

          <div className="space-y-6">
            {/* Step 1: Calculate Residuals */}
            <div className={`p-3 rounded-lg border transition-all duration-500 ${isPlaying ? 'bg-[#ef4444]/10 border-[#ef4444]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">1. Compute Residuals</div>
              <div className="text-[#ef4444] text-sm">
                <MathBlock math={`r_{im} = y_i - F_{m-1}(x_i)`} block={false} />
              </div>
              <div className="text-[10px] text-gray-400 mt-2">
                Red dots in bottom chart show the remaining error.
              </div>
            </div>

            {/* Step 2: Fit Weak Learner */}
            <div className={`p-3 rounded-lg border transition-all duration-500 ${isPlaying ? 'bg-[var(--color-cat-unsupervised)]/10 border-[var(--color-cat-unsupervised)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">2. Fit Weak Learner</div>
              <div className="text-[var(--color-cat-unsupervised)] text-sm">
                <MathBlock math={`h_m(x) \\approx r_{im}`} block={false} />
              </div>
              <div className="text-[10px] text-gray-400 mt-2">
                Green dashed line attempts to fit the red residuals.
              </div>
            </div>

            {/* Step 3: Update Main Model */}
            <div className={`p-3 rounded-lg border transition-all duration-500 ${isPlaying ? 'bg-[var(--color-cat-ensemble)]/10 border-[var(--color-cat-ensemble)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">3. Update Model</div>
              <div className="text-[var(--color-cat-ensemble)] text-sm">
                <MathBlock math={`F_m(x) = F_{m-1}(x) + \\nu h_m(x)`} block={false} />
              </div>
              <div className="text-[10px] text-gray-400 mt-2">
                Learning Rate $\nu$ = {currentStep.learningRate}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-xs font-space text-gray-400">
            <span>Overall MSE:</span>
            <span className="text-white">{currentStep.mse.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GBMAnim;
