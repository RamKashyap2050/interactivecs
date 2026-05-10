import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const BaggingAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    {
      phase: "Original Data", text: "We start with a single, highly-variable training dataset.",
      showData: true, showBags: false, showModels: false, showAggregate: false
    },
    {
      phase: "Bootstrap Sampling", text: "We randomly draw from the dataset WITH REPLACEMENT to create 3 different 'Bags' (Bootstrap samples). Some points are duplicated, some are left out.",
      showData: true, showBags: true, showModels: false, showAggregate: false
    },
    {
      phase: "Base Estimators", text: "We pass each bag to a completely independent, high-variance Base Estimator. Bagging works on ANY model, not just trees!",
      showData: false, showBags: true, showModels: true, showAggregate: false
    },
    {
      phase: "Aggregation", text: "We average their predictions. Because the models trained on slightly different data, they make different errors. Averaging cancels out these errors (Variance Reduction).",
      showData: false, showBags: false, showModels: true, showAggregate: true
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

  // Helper arrays
  const originalData = [1, 2, 3, 4, 5];
  const bags = [
    [1, 2, 2, 4, 5], // 2 is repeated, 3 is missing
    [1, 3, 3, 4, 4], // 3 and 4 repeated
    [2, 3, 4, 5, 5]  // 5 repeated, 1 missing
  ];
  const models = [
    { name: "Tree", icon: "🌲" },
    { name: "SVM", icon: "📈" },
    { name: "KNN", icon: "🎯" }
  ];

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Factory Visualizer */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-6 flex flex-col justify-between">
        
        {/* TOP: Original Data */}
        <div className="h-20 flex justify-center items-center">
          <AnimatePresence>
            {currentStep.showData && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-[#050d1a] border border-gray-700 p-3 rounded-xl flex items-center gap-2"
              >
                <span className="text-xs text-gray-500 font-space mr-2 uppercase">Original Data:</span>
                {originalData.map(d => (
                  <div key={`orig-${d}`} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-white font-bold text-sm">
                    {d}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MIDDLE: Bootstrap Bags */}
        <div className="h-32 flex justify-around items-center relative">
          <AnimatePresence>
            {currentStep.showBags && bags.map((bag, i) => (
              <motion.div
                key={`bag-${i}`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ delay: i * 0.2 }}
                className="bg-[var(--color-cat-ensemble)]/10 border-2 border-[var(--color-cat-ensemble)]/50 p-3 rounded-lg flex flex-wrap justify-center gap-1 w-32"
              >
                <div className="w-full text-center text-[10px] text-[var(--color-cat-ensemble)] uppercase font-space mb-2">Bag {i + 1}</div>
                {bag.map((d, j) => (
                  <div key={`b${i}-${j}`} className="w-6 h-6 rounded-full bg-[var(--color-cat-ensemble)]/20 border border-[var(--color-cat-ensemble)] flex items-center justify-center text-white font-bold text-xs">
                    {d}
                  </div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* LOWER MIDDLE: Base Models */}
        <div className="h-32 flex justify-around items-center relative">
          <AnimatePresence>
            {currentStep.showModels && models.map((m, i) => (
              <motion.div
                key={`model-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: currentStep.showBags ? i * 0.2 : 0 }}
                className="bg-[#050d1a] border border-gray-700 p-4 rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg"
              >
                <span className="text-3xl mb-1">{m.icon}</span>
                <span className="text-[10px] text-gray-400 font-space uppercase">{m.name}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* BOTTOM: Aggregation */}
        <div className="h-24 flex justify-center items-center">
          <AnimatePresence>
            {currentStep.showAggregate && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/30 border-2 border-green-500 rounded-xl p-4 w-64 text-center shadow-[0_0_20px_rgba(34,197,94,0.2)]"
              >
                <div className="text-xs text-green-400 uppercase tracking-widest mb-1 font-space">Averaging / Voting</div>
                <div className="text-white font-bold font-source text-sm">Low-Variance Final Output</div>
              </motion.div>
            )}
          </AnimatePresence>
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
            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.showBags && !currentStep.showAggregate ? 'bg-[var(--color-cat-ensemble)]/10 border-[var(--color-cat-ensemble)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Bootstrap Sampling</div>
              <p className="text-xs text-gray-400 mb-2">
                Drawing $N$ samples with replacement creates datasets that capture slightly different facets of the data distribution.
              </p>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.showAggregate ? 'bg-green-500/10 border-green-500/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Variance Reduction</div>
              <p className="text-xs text-gray-400 mb-2">
                Averaging independent models reduces overall variance without increasing bias.
              </p>
              <div className="text-green-400 text-sm">
                <MathBlock math={`\\text{Var}(\\bar{X}) = \\frac{\\sigma^2}{B}`} block={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaggingAnim;
