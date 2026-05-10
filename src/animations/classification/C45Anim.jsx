import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const C45Anim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    { 
      phase: "Init", 
      text: "C4.5 fixes a major flaw in ID3: the tendency to overfit on attributes with many unique values (high cardinality).", 
      gain: "0.00", splitInfo: "0.00", gainRatio: "0.00",
      layout: "base", highlight: false
    },
    { 
      phase: "The ID3 Flaw", 
      text: "Imagine splitting by a unique 'ID' column. The tree creates a separate branch for every single data point! Information Gain is artificially high.", 
      gain: "0.98", splitInfo: "4.32", gainRatio: "0.22",
      layout: "overfit", highlight: false
    },
    { 
      phase: "SplitInfo Penalty", 
      text: "While Gain is high, C4.5 calculates 'Intrinsic Value' (SplitInfo). Because there are 20 tiny branches, the penalty is MASSIVE.", 
      gain: "0.98", splitInfo: "4.32", gainRatio: "0.22",
      layout: "overfit", highlight: true
    },
    { 
      phase: "Gain Ratio", 
      text: "By dividing Gain by SplitInfo, C4.5 rejects the terrible 'ID' split and chooses a broader, generalizable split instead.", 
      gain: "0.85", splitInfo: "1.00", gainRatio: "0.85",
      layout: "healthy", highlight: false
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
    <div className="w-full h-[600px] relative p-4 flex flex-col lg:flex-row gap-4 bg-[#020611] rounded-xl border border-gray-800 shadow-2xl">
      {/* Visual Canvas */}
      <div className="flex-1 relative bg-[#050d1a] rounded-xl border border-gray-800 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            {currentStep.layout === 'base' && (
              <motion.div 
                key="base"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-12"
              >
                <div className="w-24 h-24 bg-[#8b5cf6]/20 border-2 border-[#8b5cf6] rounded-xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                  <span className="text-[#8b5cf6] font-space font-bold text-2xl">Root</span>
                </div>
                <div className="flex gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep.layout === 'overfit' && (
              <motion.div 
                key="overfit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <div className="w-16 h-10 bg-gray-800 border border-gray-700 rounded-md mb-8 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400">ID Split?</span>
                </div>
                <div className="flex gap-1 items-end h-40">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: 40 + Math.random() * 80 }}
                      className={`w-2 rounded-t-sm ${currentStep.highlight ? 'bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gray-700 opacity-50'}`}
                    />
                  ))}
                </div>
                {currentStep.highlight && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] font-space text-xs rounded-full"
                  >
                    TOO MANY BRANCHES = HIGH SPLIT INFO PENALTY
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentStep.layout === 'healthy' && (
              <motion.div 
                key="healthy"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-12"
              >
                <div className="w-20 h-10 bg-[#39ff14]/10 border border-[#39ff14] rounded-md mb-12 flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                  <span className="text-[10px] text-[#39ff14] font-space uppercase font-bold">Income &gt; 50k</span>
                </div>
                <div className="flex gap-24">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#3b82f6]/20 border border-[#3b82f6] rounded-full flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-[#3b82f6]">Yes</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-6 bg-[#3b82f6] rounded-full opacity-50" />)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#ef4444]/20 border border-[#ef4444] rounded-full flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-[#ef4444]">No</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(12)].map((_, i) => <div key={i} className="w-1.5 h-6 bg-[#ef4444] rounded-full opacity-50" />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-80 bg-[#0a1526] border border-gray-800 rounded-xl p-5 flex flex-col shadow-xl">
        <h3 className="text-xs font-space text-[#8b5cf6] mb-3 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
          {currentStep.phase}
        </h3>
        
        <p className="text-sm text-gray-300 font-source leading-relaxed mb-8 h-24 overflow-y-auto">
          {currentStep.text}
        </p>

        <div className="space-y-6 flex-1">
          <div className="p-4 bg-[#050d1a] border border-gray-800 rounded-lg">
            <div className="text-[10px] text-gray-500 font-space mb-2 uppercase tracking-tighter">Gain Ratio Calculation</div>
            <div className="mb-4">
              <MathBlock math={`\\text{GainRatio} = \\frac{\\text{Gain}}{\\text{SplitInfo}}`} block={false} />
            </div>
            
            <div className="space-y-3 mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-mono">Inf. Gain:</span>
                <span className={`font-bold font-mono ${currentStep.gain > 0.9 ? 'text-[#39ff14]' : 'text-white'}`}>{currentStep.gain}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-mono">Split Info:</span>
                <span className={`font-bold font-mono ${currentStep.splitInfo > 3 ? 'text-[#ef4444]' : 'text-white'}`}>{currentStep.splitInfo}</span>
              </div>
              <div className="h-px bg-gray-800 w-full" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-mono">Gain Ratio:</span>
                <span className="font-bold font-mono text-[var(--color-electric-cyan)] text-sm">{currentStep.gainRatio}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#050d1a] border border-gray-800 rounded-lg">
            <div className="text-[10px] text-gray-500 font-space mb-2 uppercase tracking-tighter">Intrinsic Value (SplitInfo)</div>
            <MathBlock math={`-\\sum \\frac{|S_v|}{|S|} \\log_2 \\frac{|S_v|}{|S|}`} block={false} />
            {currentStep.highlight && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-[9px] text-[#ef4444] font-mono leading-tight italic"
              >
                * Many small partitions lead to high intrinsic value, reducing the final Gain Ratio.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default C45Anim;
