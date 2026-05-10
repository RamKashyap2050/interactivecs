import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const StackingAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    {
      phase: "Base Estimators", text: "We train multiple diverse Base Estimators (e.g., Random Forest, SVM, KNN) on the training data.",
      showData: true, showPredictions: false, showMeta: false, showWeights: false, output: null
    },
    {
      phase: "Out-of-Fold Predictions", text: "Each Base Estimator generates a prediction for a new data point. Notice they all slightly disagree.",
      showData: true, showPredictions: true, showMeta: false, showWeights: false, output: null
    },
    {
      phase: "The Meta-Model", text: "We feed these predictions NOT to the user, but as input features to a 'Meta-Model' (often Logistic Regression).",
      showData: false, showPredictions: true, showMeta: true, showWeights: false, output: null
    },
    {
      phase: "Learning to Trust", text: "The Meta-Model learns 'Trust Weights'. It notices the Random Forest is highly accurate for this type of data, so it assigns it a high weight, while penalizing the KNN.",
      showData: false, showPredictions: true, showMeta: true, showWeights: true, output: null
    },
    {
      phase: "Final Output", text: "The Meta-Model combines the weighted advisor opinions to produce a highly accurate, superior final prediction.",
      showData: false, showPredictions: true, showMeta: true, showWeights: true, output: "Class 1 (92%)"
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

  const baseModels = [
    { name: "Random Forest", pred: 0.85, weight: 0.70, color: "var(--color-electric-cyan)" },
    { name: "SVM", pred: 0.60, weight: 0.25, color: "#f59e0b" },
    { name: "KNN", pred: 0.20, weight: 0.05, color: "#ef4444" }
  ];

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Stacking Architecture */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-6 flex flex-col justify-between items-center">
        
        {/* Layer 0: Input Data */}
        <div className="h-12 w-full flex justify-center">
          <AnimatePresence>
            {currentStep.showData && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-gray-800 text-white text-xs font-space px-6 py-2 rounded-lg border border-gray-600">
                Input Feature Vector $X$
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Connections L0 -> L1 */}
        {currentStep.showData && (
          <svg className="absolute top-16 left-0 w-full h-16 pointer-events-none z-0">
            <line x1="50%" y1="0" x2="20%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="0" x2="80%" y2="100%" stroke="#374151" strokeWidth="1" strokeDasharray="4" />
          </svg>
        )}

        {/* Layer 1: Base Estimators */}
        <div className="w-full flex justify-around relative z-10">
          {baseModels.map((model, i) => (
            <div key={`base-${i}`} className="flex flex-col items-center">
              <div className="bg-[#050d1a] border-2 border-gray-700 w-24 h-16 rounded-lg flex items-center justify-center text-[10px] text-gray-300 font-space uppercase text-center shadow-lg">
                {model.name}
              </div>
              
              {/* Predictions */}
              <div className="h-10 mt-2">
                <AnimatePresence>
                  {currentStep.showPredictions && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} 
                      className="text-xs font-mono font-bold px-3 py-1 rounded"
                      style={{ backgroundColor: `${model.color}20`, color: model.color, border: `1px solid ${model.color}` }}
                    >
                      P = {model.pred.toFixed(2)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* Connections L1 -> Meta */}
        {currentStep.showMeta && (
          <svg className="absolute top-48 left-0 w-full h-32 pointer-events-none z-0">
            {baseModels.map((model, i) => (
              <motion.line
                key={`line-${i}`}
                x1={`${20 + i * 30}%`} y1="0"
                x2="50%" y2="100%"
                stroke={currentStep.showWeights ? model.color : "#374151"}
                strokeWidth={currentStep.showWeights ? model.weight * 5 : 1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
              />
            ))}
          </svg>
        )}

        {/* Trust Weights */}
        <div className="w-full flex justify-around relative z-10 h-8 -mt-4">
          {baseModels.map((model, i) => (
             <AnimatePresence key={`weight-${i}`}>
             {currentStep.showWeights && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
                 className="text-[10px] font-space bg-black/80 px-2 py-0.5 rounded border border-gray-700"
                 style={{ color: model.color }}
               >
                 $w_{i+1}$ = {model.weight.toFixed(2)}
               </motion.div>
             )}
           </AnimatePresence>
          ))}
        </div>

        {/* Layer 2: Meta-Model */}
        <div className="w-full flex flex-col items-center z-10 mt-12">
           <AnimatePresence>
            {currentStep.showMeta && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="bg-[#050d1a] border-2 border-[var(--color-cat-ensemble)] w-40 h-16 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(var(--color-cat-ensemble-rgb),0.2)]"
              >
                <span className="text-[10px] text-[var(--color-cat-ensemble)] font-space uppercase">Meta-Model</span>
                <span className="text-[8px] text-gray-400 font-mono">(Logistic Regression)</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final Output */}
          <div className="h-16 mt-4">
             <AnimatePresence>
              {currentStep.output && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/30 border-2 border-green-500 rounded-xl px-6 py-3 text-center shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  <div className="text-[10px] text-green-400 uppercase tracking-widest mb-1 font-space">Final Prediction</div>
                  <div className="text-xl font-bold text-white font-mono">{currentStep.output}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.showWeights ? 'bg-[var(--color-cat-ensemble)]/10 border-[var(--color-cat-ensemble)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Meta-Model Equation</div>
              <p className="text-xs text-gray-400 mb-2">
                The Meta-Model learns coefficients ($w$) to weight the outputs ($f(x)$) of the base estimators. It acts as an intelligent aggregator.
              </p>
              <div className="text-[var(--color-cat-ensemble)] text-[12px] overflow-x-auto">
                <MathBlock math={`Y_{final} = \\sigma(w_1 f_{rf}(x) + w_2 f_{svm}(x) + ...)`} block={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackingAnim;
