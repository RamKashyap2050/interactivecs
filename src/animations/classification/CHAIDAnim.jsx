import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const CHAIDAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    { 
      phase: "Init", text: "CHAID creates non-binary trees using statistical significance. Let's try to split by 'Age Group' (Young, Adult, Senior).", 
      chiSq: "0.00", pValue: "1.00",
      layout: "root", highlight: []
    },
    { 
      phase: "Multi-way Split", text: "Unlike CART or C4.5, CHAID can sprout 3 or more branches at once for a categorical feature.", 
      chiSq: "15.4", pValue: "0.04",
      layout: "multi", highlight: []
    },
    { 
      phase: "Statistical Test", text: "CHAID runs a Chi-Square test comparing the 'Adult' and 'Senior' branches. It finds their distributions are statistically identical!", 
      chiSq: "0.85", pValue: "0.65", // Not significant (p > 0.05)
      layout: "multi", highlight: ['Adult', 'Senior']
    },
    { 
      phase: "Pre-Pruning (Merge)", text: "Because the difference isn't statistically significant, CHAID merges 'Adult' and 'Senior' into a single branch. This is built-in pre-pruning!", 
      chiSq: "14.2", pValue: "0.01",
      layout: "merged", highlight: ['Adult/Senior']
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
    <div className="w-full h-[600px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Tree Visualizer */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Root Node */}
          <rect x="35" y="10" width="30" height="12" rx="2" fill="#1f2937" stroke="#4b5563" strokeWidth="0.5" />
          <text x="50" y="17" fill="#fff" fontSize="4" fontFamily="monospace" textAnchor="middle">All Customers</text>

          {/* Root Layout */}
          {currentStep.layout === "root" && (
            <text x="50" y="50" fill="#6b7280" fontSize="4" fontFamily="monospace" textAnchor="middle">Evaluating 'Age Group'...</text>
          )}

          {/* Multi-way Layout (3 branches) */}
          {currentStep.layout === "multi" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Lines */}
              <line x1="50" y1="22" x2="20" y2="50" stroke="#374151" strokeWidth="1" />
              <line x1="50" y1="22" x2="50" y2="50" stroke={currentStep.highlight.includes('Adult') ? "#ef4444" : "#374151"} strokeWidth={currentStep.highlight.includes('Adult') ? "1.5" : "1"} />
              <line x1="50" y1="22" x2="80" y2="50" stroke={currentStep.highlight.includes('Senior') ? "#ef4444" : "#374151"} strokeWidth={currentStep.highlight.includes('Senior') ? "1.5" : "1"} />
              
              {/* Nodes */}
              <rect x="10" y="50" width="20" height="10" rx="2" fill="#1f2937" stroke="var(--color-electric-cyan)" strokeWidth="0.5" />
              <text x="20" y="56" fill="var(--color-electric-cyan)" fontSize="3" fontFamily="monospace" textAnchor="middle">Young</text>

              <rect x="40" y="50" width="20" height="10" rx="2" fill="#1f2937" stroke={currentStep.highlight.includes('Adult') ? "#ef4444" : "var(--color-electric-cyan)"} strokeWidth="0.5" />
              <text x="50" y="56" fill={currentStep.highlight.includes('Adult') ? "#ef4444" : "var(--color-electric-cyan)"} fontSize="3" fontFamily="monospace" textAnchor="middle">Adult</text>

              <rect x="70" y="50" width="20" height="10" rx="2" fill="#1f2937" stroke={currentStep.highlight.includes('Senior') ? "#ef4444" : "var(--color-electric-cyan)"} strokeWidth="0.5" />
              <text x="80" y="56" fill={currentStep.highlight.includes('Senior') ? "#ef4444" : "var(--color-electric-cyan)"} fontSize="3" fontFamily="monospace" textAnchor="middle">Senior</text>
            </motion.g>
          )}

          {/* Merged Layout (2 branches) */}
          {currentStep.layout === "merged" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Lines */}
              <line x1="50" y1="22" x2="30" y2="50" stroke="#374151" strokeWidth="1" />
              <line x1="50" y1="22" x2="70" y2="50" stroke="var(--color-phosphor-green)" strokeWidth="1.5" />
              
              {/* Nodes */}
              <rect x="20" y="50" width="20" height="10" rx="2" fill="#1f2937" stroke="var(--color-electric-cyan)" strokeWidth="0.5" />
              <text x="30" y="56" fill="var(--color-electric-cyan)" fontSize="3" fontFamily="monospace" textAnchor="middle">Young</text>

              <rect x="55" y="50" width="30" height="10" rx="2" fill="#1f2937" stroke="var(--color-phosphor-green)" strokeWidth="1" />
              <text x="70" y="56" fill="var(--color-phosphor-green)" fontSize="3" fontFamily="monospace" textAnchor="middle">Adult / Senior</text>

              <text x="70" y="70" fill="var(--color-phosphor-green)" fontSize="3" fontFamily="monospace" textAnchor="middle">MERGED!</text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* MATH / TEXT PANEL */}
      <div className="w-full md:w-80 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-classification)] mb-2 uppercase tracking-wide">Phase: {currentStep.phase}</h3>
          <p className="text-sm text-gray-300 font-source mb-6">
            {currentStep.text}
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 bg-[var(--color-cat-classification)]/10 border-[var(--color-cat-classification)]/50`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Chi-Square Statistic</div>
              <div className="text-[var(--color-cat-classification)] text-sm">
                <MathBlock math={`\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}`} block={false} />
              </div>
              <div className="mt-2 text-xs font-mono text-gray-300 flex justify-between">
                <span>Value:</span>
                <span className="font-bold text-white">{currentStep.chiSq}</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.highlight.length > 0 ? (currentStep.layout === 'merged' ? 'bg-[var(--color-phosphor-green)]/10 border-[var(--color-phosphor-green)]/50' : 'bg-[#ef4444]/10 border-[#ef4444]/50') : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Statistical Significance</div>
              <div className="mt-2 text-xs font-mono flex justify-between items-center">
                <span className="text-gray-300">p-value:</span>
                <span className={`font-bold text-lg ${currentStep.layout === 'multi' && currentStep.highlight.length > 0 ? 'text-[#ef4444]' : 'text-[var(--color-phosphor-green)]'}`}>
                  {currentStep.pValue}
                </span>
              </div>
              {currentStep.layout === 'multi' && currentStep.highlight.length > 0 && (
                <p className="text-xs text-[#ef4444] mt-2">
                  $p &gt; 0.05$. The difference is likely due to chance. Reject split!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CHAIDAnim;
