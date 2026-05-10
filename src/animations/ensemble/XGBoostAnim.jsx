import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const XGBoostAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    {
      phase: "Init", text: "XGBoost builds trees using exact Second-Order Gradients (Hessians) for extreme precision.",
      treeDepth: 0, pruneLevel: 0, highlightPenalty: false
    },
    {
      phase: "Speed Run Growth", text: "It builds a deep tree blazingly fast using cache-aware memory access and histogram-based splits.",
      treeDepth: 3, pruneLevel: 0, highlightPenalty: false
    },
    {
      phase: "Regularization", text: "Unlike basic GBM, XGBoost includes explicit L1/L2 regularization (Ω) on leaf weights to penalize complexity.",
      treeDepth: 3, pruneLevel: 0, highlightPenalty: true
    },
    {
      phase: "Backward Pruning", text: "It scans backwards. If the split gain is less than the regularization penalty (Gain < Ω), it aggressively snips the branches off!",
      treeDepth: 3, pruneLevel: 1, highlightPenalty: true
    },
    {
      phase: "Optimized Tree", text: "The final tree is highly optimized: mathematically rigorous, regularized against overfitting, and computationally lightning fast.",
      treeDepth: 3, pruneLevel: 2, highlightPenalty: false
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

  // Helper to draw tree lines
  const drawLine = (x1, y1, x2, y2, visible, pruned) => (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={pruned ? "#ef4444" : "#374151"}
      strokeWidth={pruned ? 2 : 1}
      strokeDasharray={pruned ? "2 2" : "none"}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: visible ? 1 : 0, opacity: visible ? (pruned ? 0.3 : 1) : 0 }}
      transition={{ duration: 0.5 }}
    />
  );

  const drawNode = (x, y, visible, pruned, label) => (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? (pruned ? 0 : 1) : 0 }}
      transition={{ duration: 0.5 }}
    >
      <circle cx={x} cy={y} r="3" fill="#1f2937" stroke="var(--color-cat-ensemble)" strokeWidth="0.5" />
      {label && <text x={x} y={y + 1} fill="white" fontSize="2" fontFamily="monospace" textAnchor="middle">{label}</text>}
    </motion.g>
  );

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Tree Visualizer */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Root */}
          <rect x="40" y="5" width="20" height="8" rx="2" fill="#1f2937" stroke="var(--color-cat-ensemble)" strokeWidth="0.5" />
          <text x="50" y="10" fill="white" fontSize="3" fontFamily="monospace" textAnchor="middle">Root (Hessian)</text>

          {/* Level 1 */}
          {drawLine(50, 13, 30, 30, currentStep.treeDepth >= 1, false)}
          {drawLine(50, 13, 70, 30, currentStep.treeDepth >= 1, false)}
          {drawNode(30, 30, currentStep.treeDepth >= 1, false, "")}
          {drawNode(70, 30, currentStep.treeDepth >= 1, false, "")}

          {/* Level 2 */}
          {drawLine(30, 33, 15, 55, currentStep.treeDepth >= 2, false)}
          {drawLine(30, 33, 45, 55, currentStep.treeDepth >= 2, false)}
          {drawLine(70, 33, 55, 55, currentStep.treeDepth >= 2, currentStep.pruneLevel >= 2)} // Pruned in phase 2
          {drawLine(70, 33, 85, 55, currentStep.treeDepth >= 2, currentStep.pruneLevel >= 2)} // Pruned in phase 2
          
          {drawNode(15, 55, currentStep.treeDepth >= 2, false, "")}
          {drawNode(45, 55, currentStep.treeDepth >= 2, false, "")}
          {drawNode(55, 55, currentStep.treeDepth >= 2, currentStep.pruneLevel >= 2, "")}
          {drawNode(85, 55, currentStep.treeDepth >= 2, currentStep.pruneLevel >= 2, "")}

          {/* Level 3 (Deep branches that get pruned first) */}
          {drawLine(15, 58, 5, 80, currentStep.treeDepth >= 3, currentStep.pruneLevel >= 1)} // Pruned in phase 1
          {drawLine(15, 58, 25, 80, currentStep.treeDepth >= 3, currentStep.pruneLevel >= 1)} // Pruned in phase 1
          {drawLine(45, 58, 35, 80, currentStep.treeDepth >= 3, false)} // Survives
          {drawLine(45, 58, 55, 80, currentStep.treeDepth >= 3, false)} // Survives

          {drawNode(5, 80, currentStep.treeDepth >= 3, currentStep.pruneLevel >= 1, "w1")}
          {drawNode(25, 80, currentStep.treeDepth >= 3, currentStep.pruneLevel >= 1, "w2")}
          {drawNode(35, 80, currentStep.treeDepth >= 3, false, "w3")}
          {drawNode(55, 80, currentStep.treeDepth >= 3, false, "w4")}

          {/* Pruning visual indicators */}
          <AnimatePresence>
            {currentStep.pruneLevel === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <text x="15" y="70" fill="#ef4444" fontSize="4" fontWeight="bold" textAnchor="middle">Gain &lt; Ω</text>
                <text x="15" y="75" fill="#ef4444" fontSize="6" fontWeight="bold" textAnchor="middle">✂️</text>
              </motion.g>
            )}
            {currentStep.pruneLevel === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <text x="70" y="45" fill="#ef4444" fontSize="4" fontWeight="bold" textAnchor="middle">Gain &lt; Ω</text>
                <text x="70" y="50" fill="#ef4444" fontSize="6" fontWeight="bold" textAnchor="middle">✂️</text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* MATH / TEXT PANEL */}
      <div className="w-full md:w-80 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-ensemble)] mb-2 uppercase tracking-wide">Phase: {currentStep.phase}</h3>
          <p className="text-sm text-gray-300 font-source mb-6">
            {currentStep.text}
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 bg-transparent border-gray-800`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Objective Function</div>
              <div className="text-white text-sm overflow-x-auto">
                <MathBlock math={`Obj = \\sum L(y_i, \\hat{y}_i) + \\sum \\Omega(f_k)`} block={false} />
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.highlightPenalty ? 'bg-[#ef4444]/10 border-[#ef4444]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Regularization Penalty (Ω)</div>
              <p className="text-xs text-gray-400 mb-2">
                XGBoost mathematically penalizes trees for having too many leaves ($T$) or large weights ($w$).
              </p>
              <div className={`${currentStep.highlightPenalty ? 'text-[#ef4444]' : 'text-[var(--color-cat-ensemble)]'} text-sm overflow-x-auto`}>
                <MathBlock math={`\\Omega(f) = \\gamma T + \\frac{1}{2}\\lambda \\sum_{j=1}^{T} w_j^2`} block={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XGBoostAnim;
