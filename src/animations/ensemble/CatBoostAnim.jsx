import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const CatBoostAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    {
      phase: "The Problem", text: "Standard algorithms crash on text categories (like 'City: London'). Normal Target Encoding leaks future information.",
      currentRow: -1, encoded: []
    },
    {
      phase: "Ordered Encoding", text: "CatBoost shuffles the data into a queue. To encode Row 1 ('London'), it is ONLY allowed to look at historical rows above it. There are none, so it uses the prior (0.05).",
      currentRow: 0, encoded: [0.05]
    },
    {
      phase: "Ordered Encoding", text: "For Row 2 ('Paris'), it looks above. No previous 'Paris' exists, uses prior.",
      currentRow: 1, encoded: [0.05, 0.05]
    },
    {
      phase: "Ordered Encoding", text: "Row 3 ('London'). It looks at the history! It sees Row 1 was 'London' with Target=1. It calculates the mean: (1 + prior) / (1 count).",
      currentRow: 2, encoded: [0.05, 0.05, 0.85]
    },
    {
      phase: "Ordered Encoding", text: "Row 4 ('London'). It looks at history. Two previous 'Londons' (Targets 1 and 0). Mean: (1+0+prior) / (2 counts).",
      currentRow: 3, encoded: [0.05, 0.05, 0.85, 0.45]
    },
    {
      phase: "Target Leakage Prevented!", text: "By strictly using a moving historical window, CatBoost perfectly encodes categories dynamically without ever peaking at the future!",
      currentRow: 4, encoded: [0.05, 0.05, 0.85, 0.45, 0.05]
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
      }, 5000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentStepIdx, steps.length, onComplete]);

  const currentStep = steps[currentStepIdx];

  const queueData = [
    { id: 1, city: "London", target: 1 },
    { id: 2, city: "Paris", target: 0 },
    { id: 3, city: "London", target: 0 },
    { id: 4, city: "London", target: 1 },
    { id: 5, city: "Tokyo", target: 1 },
  ];

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: The Queue Visualizer */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-6 flex flex-col items-center">
        
        <div className="text-sm text-gray-500 font-space uppercase tracking-widest mb-6">Data Queue (Time Machine)</div>

        <div className="w-full max-w-md space-y-3 relative">
          {/* Moving Window Scanner */}
          <AnimatePresence>
            {currentStep.currentRow >= 0 && currentStep.currentRow < 4 && (
              <motion.div
                initial={false}
                animate={{ top: `${currentStep.currentRow * (48 + 12)}px`, height: '54px' }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute left-0 right-0 bg-[var(--color-cat-ensemble)]/10 border-2 border-[var(--color-cat-ensemble)] rounded-lg z-0"
                style={{ top: 0 }}
              >
                <div className="absolute -left-24 top-4 text-xs font-bold text-[var(--color-cat-ensemble)] font-space uppercase flex items-center gap-2">
                  <span>Scanner</span>
                  <div className="w-4 h-[1px] bg-[var(--color-cat-ensemble)]"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Historical Window Box (shows what the scanner is allowed to see) */}
          <AnimatePresence>
            {currentStep.currentRow > 0 && currentStep.currentRow < 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, height: `${currentStep.currentRow * (48 + 12)}px` }}
                className="absolute left-0 right-0 top-0 border-l-2 border-t-2 border-r-2 border-green-500/50 bg-green-900/10 rounded-t-lg z-0"
              >
                <div className="absolute right-2 -top-6 text-[10px] text-green-500 font-space uppercase font-bold">Historical Data (Allowed)</div>
              </motion.div>
            )}
          </AnimatePresence>

          {queueData.map((row, i) => (
            <div key={i} className={`relative z-10 flex items-center justify-between p-3 rounded-lg border ${currentStep.currentRow === i ? 'bg-[#050d1a] border-gray-600 shadow-lg' : 'bg-[#020611] border-gray-800'} transition-colors duration-300 h-12`}>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-space text-xs">Row {row.id}</span>
                <span className={`font-bold font-mono ${currentStep.currentRow === i ? 'text-white' : 'text-gray-400'}`}>{row.city}</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-gray-500 uppercase">Target</span>
                  <span className={`font-mono text-sm ${row.target === 1 ? 'text-green-400' : 'text-red-400'}`}>{row.target}</span>
                </div>
                
                <div className="w-24 text-right">
                  {currentStep.encoded[i] !== undefined ? (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-xs bg-[var(--color-cat-ensemble)]/20 text-[var(--color-cat-ensemble)] border border-[var(--color-cat-ensemble)]/50 px-2 py-1 rounded font-mono font-bold">
                      Encoded: {currentStep.encoded[i].toFixed(2)}
                    </motion.div>
                  ) : (
                    <span className="text-xs text-gray-600 font-mono italic">Waiting...</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MATH / TEXT PANEL */}
      <div className="w-full md:w-80 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-ensemble)] mb-2 uppercase tracking-wide">Phase: {currentStep.phase}</h3>
          <p className="text-sm text-gray-300 font-source mb-6">
            {currentStep.text}
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 bg-[var(--color-cat-ensemble)]/10 border-[var(--color-cat-ensemble)]/50`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Ordered Target Statistic</div>
              <p className="text-[10px] text-gray-400 mb-2">
                Calculate the mean target value for category $x_k^i$, but ONLY summing over rows $j$ where $j &lt; i$ (historical rows). $a \\cdot P$ acts as a prior for smoothing.
              </p>
              <div className="text-[var(--color-cat-ensemble)] text-[10px] overflow-x-auto overflow-y-hidden">
                <MathBlock math={`\\hat{x}_k^i = \\frac{\\sum_{j=1}^{i-1} [x_k^j = x_k^i] Y_j + a \\cdot P}{\\sum_{j=1}^{i-1} [x_k^j = x_k^i] + a}`} block={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatBoostAnim;
