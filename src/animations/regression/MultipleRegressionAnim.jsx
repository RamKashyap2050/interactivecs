import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const MultipleRegressionAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    {
      phase: "Init", text: "Instead of one feature (X), we have multiple features: Size, Bedrooms, and Age. We initialize their weights (β) randomly.",
      features: [ { name: "Size (sq ft)", val: 2000 }, { name: "Bedrooms", val: 3 }, { name: "Age (yrs)", val: 10 } ],
      weights: [0.1, -0.5, 0.2], bias: 50, prediction: 0, target: 450, error: 0,
      showPred: false, showCost: false, updateWeights: false
    },
    {
      phase: "Forward Pass", text: "We multiply each feature by its weight and add the bias to get our predicted price.",
      features: [ { name: "Size (sq ft)", val: 2000 }, { name: "Bedrooms", val: 3 }, { name: "Age (yrs)", val: 10 } ],
      weights: [0.1, -0.5, 0.2], bias: 50, prediction: 250.5, target: 450, error: 0,
      showPred: true, showCost: false, updateWeights: false
    },
    {
      phase: "Cost Calculation", text: "We compare our prediction to the actual True Price. The difference is our Error (Residual).",
      features: [ { name: "Size (sq ft)", val: 2000 }, { name: "Bedrooms", val: 3 }, { name: "Age (yrs)", val: 10 } ],
      weights: [0.1, -0.5, 0.2], bias: 50, prediction: 250.5, target: 450, error: 199.5,
      showPred: true, showCost: true, updateWeights: false
    },
    {
      phase: "Gradient Descent", text: "We calculate the gradient with respect to EACH weight. We update all weights simultaneously to decrease the error.",
      features: [ { name: "Size (sq ft)", val: 2000 }, { name: "Bedrooms", val: 3 }, { name: "Age (yrs)", val: 10 } ],
      weights: [0.15, 2.5, -0.8], bias: 65, prediction: 250.5, target: 450, error: 199.5,
      showPred: true, showCost: true, updateWeights: true
    },
    {
      phase: "Next Epoch", text: "With the new, updated weights, the next prediction will be much closer to the true price!",
      features: [ { name: "Size (sq ft)", val: 2000 }, { name: "Bedrooms", val: 3 }, { name: "Age (yrs)", val: 10 } ],
      weights: [0.15, 2.5, -0.8], bias: 65, prediction: 379.5, target: 450, error: 70.5,
      showPred: true, showCost: true, updateWeights: false
    }
  ], []);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStepIdx < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 2) {
            clearInterval(interval);
            if (onComplete) onComplete();
            return steps.length - 1;
          }
          return prev + 1;
        });
      }, 4000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentStepIdx, steps.length, onComplete]);

  const currentStep = steps[currentStepIdx];

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Flow Network Visualizer */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-6 flex flex-col items-center justify-between">
        
        {/* TOP: Input Features */}
        <div className="w-full flex justify-around">
          {currentStep.features.map((f, i) => (
            <div key={`feat-${i}`} className="flex flex-col items-center z-10">
              <div className="bg-gray-800 border border-gray-600 rounded p-2 mb-2 w-24 text-center">
                <span className="block text-[10px] text-gray-400 font-space uppercase mb-1">{f.name}</span>
                <span className="block font-mono text-white text-sm">x_{i+1} = {f.val}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE: Weights & Connections */}
        <div className="w-full h-40 relative flex justify-around items-center">
           {/* SVG Lines */}
           <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            {currentStep.features.map((_, i) => (
              <motion.line 
                key={`line-${i}`}
                x1={`${16.6 + i * 33.3}%`} y1="0" 
                x2="50%" y2="100%" 
                stroke={currentStep.updateWeights ? "#f59e0b" : "#374151"} 
                strokeWidth={currentStep.updateWeights ? 3 : 1}
                animate={{ stroke: currentStep.updateWeights ? "#f59e0b" : "#374151", strokeWidth: currentStep.updateWeights ? 3 : 1 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </svg>

          {currentStep.weights.map((w, i) => (
            <motion.div 
              key={`weight-${i}`} 
              className="bg-[#050d1a] border-2 rounded-full w-16 h-16 flex flex-col items-center justify-center z-10 shadow-lg"
              animate={{ 
                borderColor: currentStep.updateWeights ? "#f59e0b" : "#1f2937",
                scale: currentStep.updateWeights ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[10px] text-gray-500 font-space uppercase">β_{i+1}</span>
              <span className={`font-mono font-bold ${currentStep.updateWeights ? 'text-[#f59e0b]' : 'text-white'}`}>{w.toFixed(2)}</span>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM: Aggregation and Output */}
        <div className="w-full flex flex-col items-center z-10 relative">
           {/* Bias input */}
           <div className="absolute -left-10 top-0 flex items-center">
              <div className="text-[10px] text-gray-500 font-space uppercase mr-2">Bias (β_0)</div>
              <div className="bg-[#050d1a] border border-gray-600 rounded px-2 py-1 font-mono text-white text-xs">{currentStep.bias}</div>
           </div>

          <div className="bg-[var(--color-cat-regression)]/20 border-2 border-[var(--color-cat-regression)] rounded-xl px-8 py-4 mb-8 text-center flex flex-col items-center">
            <span className="text-[10px] text-[var(--color-cat-regression)] uppercase font-space font-bold mb-1">Σ Weighted Sum</span>
            <AnimatePresence>
              {currentStep.showPred && (
                <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="font-mono text-xl text-white font-bold">
                  $ {currentStep.prediction}k
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {currentStep.showCost && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-4 w-full max-w-sm justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-red-400 font-space uppercase">True Target (y)</span>
                  <span className="font-mono text-white font-bold">$ {currentStep.target}k</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-red-400 font-space uppercase">Error (Cost)</span>
                  <span className="font-mono text-red-400 font-bold">Δ {currentStep.error.toFixed(1)}k</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* MATH / TEXT PANEL */}
      <div className="w-full md:w-80 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-regression)] mb-2 uppercase tracking-wide">Phase: {currentStep.phase}</h3>
          <p className="text-sm text-gray-300 font-source mb-6">
            {currentStep.text}
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 ${(currentStep.phase === 'Init' || currentStep.phase === 'Forward Pass') ? 'bg-[var(--color-cat-regression)]/10 border-[var(--color-cat-regression)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Hypothesis Equation</div>
              <p className="text-[10px] text-gray-400 mb-2">We multiply each feature ($x_j$) by its learned weight ($\\beta_j$) and add the bias ($\\beta_0$).</p>
              <div className="text-[var(--color-cat-regression)] text-sm overflow-x-auto">
                <MathBlock math={`\\hat{y} = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\dots + \\beta_n x_n`} block={false} />
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.updateWeights ? 'bg-[#f59e0b]/10 border-[#f59e0b]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Gradient Descent Update</div>
              <p className="text-[10px] text-gray-400 mb-2">To fix the error, we calculate the partial derivative (gradient) for EACH feature simultaneously and update the weights.</p>
              <div className={`${currentStep.updateWeights ? 'text-[#f59e0b]' : 'text-gray-600'} text-[12px] overflow-x-auto transition-colors duration-500`}>
                <MathBlock math={`\\beta_j := \\beta_j - \\alpha \\frac{\\partial J}{\\partial \\beta_j}`} block={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleRegressionAnim;
