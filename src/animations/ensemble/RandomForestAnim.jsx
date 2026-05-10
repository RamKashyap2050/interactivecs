import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const RandomForestAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    {
      phase: "Init", text: "You want to know if you'll like a new movie. Instead of asking one person, you ask a 'Forest' of 3 friends.",
      movieVisible: true, blindfoldsVisible: false, flowingData: false, predictions: [null, null, null], aggregated: null
    },
    {
      phase: "Feature Randomness", text: "To ensure they give INDEPENDENT opinions, you restrict what they know. This is Feature Randomness ($m \\approx \\sqrt{p}$).",
      movieVisible: true, blindfoldsVisible: true, flowingData: false, predictions: [null, null, null], aggregated: null
    },
    {
      phase: "Prediction", text: "You feed the movie data into the forest. Each friend evaluates it based ONLY on the specific features they are allowed to see.",
      movieVisible: true, blindfoldsVisible: true, flowingData: true, predictions: [null, null, null], aggregated: null
    },
    {
      phase: "Weak Learners", text: "Because they look at different things, they reach different conclusions. The Action Fan says YES, the Critic says NO, the Casual fan says YES.",
      movieVisible: true, blindfoldsVisible: true, flowingData: false, predictions: ["YES", "NO", "YES"], aggregated: null
    },
    {
      phase: "Aggregation", text: "Finally, we aggregate their independent predictions using a Majority Vote. 2 YES vs 1 NO. The Forest predicts: YES!",
      movieVisible: true, blindfoldsVisible: true, flowingData: false, predictions: ["YES", "NO", "YES"], aggregated: "YES"
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

  const friends = [
    { name: "Friend 1 (Action Fan)", features: ["Genre", "Length"], color: "var(--color-electric-cyan)" },
    { name: "Friend 2 (The Critic)", features: ["Director", "Actors"], color: "#ef4444" },
    { name: "Friend 3 (Casual)", features: ["Genre", "Actors"], color: "var(--color-electric-cyan)" }
  ];

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: The Forest Visualizer */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-4 flex flex-col justify-between">
        
        {/* TOP: The Input Movie */}
        <div className="h-24 flex items-center justify-center">
          <AnimatePresence>
            {currentStep.movieVisible && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[#050d1a] border border-gray-700 rounded-lg p-3 text-center w-64 shadow-lg shadow-black/50 z-20"
              >
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-space">New Input Data</div>
                <div className="font-bold text-white font-space mb-2">"Sci-Fi Blockbuster"</div>
                <div className="flex flex-wrap justify-center gap-1">
                  {['Genre', 'Director', 'Length', 'Actors'].map(f => (
                    <span key={f} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MIDDLE: The Trees */}
        <div className="flex-1 flex justify-around items-center relative py-8">
          {/* Flowing Data Animation */}
          {currentStep.flowingData && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {friends.map((_, i) => (
                <motion.div
                  key={`flow-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                  style={{ left: `${20 + (i * 30)}%`, top: '10%' }}
                  animate={{ top: ['10%', '60%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                />
              ))}
            </div>
          )}

          {friends.map((friend, i) => (
            <div key={i} className="flex flex-col items-center z-20 w-1/3">
              <div className="w-16 h-16 rounded-full bg-[#050d1a] border-2 border-gray-700 flex items-center justify-center relative mb-4 shadow-lg shadow-black/50">
                <span className="text-2xl">🌲</span>
                
                {/* Blindfold Effect */}
                <AnimatePresence>
                  {currentStep.blindfoldsVisible && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute inset-0 bg-black/80 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 overflow-hidden"
                    >
                      <span className="text-[8px] text-gray-400 uppercase font-space mt-1">Only sees:</span>
                      {friend.features.map(f => (
                        <span key={f} className="text-[10px] text-yellow-400 font-bold">{f}</span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-xs text-gray-400 font-space text-center h-8">{friend.name}</div>
              
              {/* Prediction */}
              <div className="h-10 mt-2 flex items-center justify-center w-full">
                <AnimatePresence>
                  {currentStep.predictions[i] && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`font-bold font-space px-4 py-1 rounded shadow-lg`}
                      style={{ backgroundColor: `${friend.color}20`, color: friend.color, border: `1px solid ${friend.color}50` }}
                    >
                      {currentStep.predictions[i]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM: Aggregation */}
        <div className="h-32 flex flex-col items-center justify-end pb-4 border-t border-gray-800 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#020611] px-4 text-xs font-space text-gray-500 tracking-widest uppercase">
            Majority Vote Aggregation
          </div>
          <AnimatePresence>
            {currentStep.aggregated && (
              <motion.div 
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="bg-[var(--color-cat-ensemble)]/20 border-2 border-[var(--color-cat-ensemble)] rounded-xl p-4 text-center shadow-[0_0_30px_rgba(var(--color-cat-ensemble-rgb),0.2)]"
              >
                <div className="text-xs text-[var(--color-cat-ensemble)] uppercase tracking-widest mb-1 font-space">Final Forest Prediction</div>
                <div className="text-3xl font-bold text-white font-space">
                  {currentStep.aggregated}
                </div>
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
            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.phase === 'Feature Randomness' ? 'bg-[var(--color-cat-ensemble)]/10 border-[var(--color-cat-ensemble)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Feature Randomness</div>
              <p className="text-xs text-gray-400 mb-2">
                By forcing each tree to only look at a random subset of features ($m$), we prevent them from all making the exact same decisions.
              </p>
              <div className="text-[var(--color-cat-ensemble)] text-sm">
                <MathBlock math={`m \\approx \\sqrt{p}`} block={false} />
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.phase === 'Aggregation' ? 'bg-[var(--color-cat-ensemble)]/10 border-[var(--color-cat-ensemble)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Aggregation (Mode)</div>
              <p className="text-xs text-gray-400 mb-2">
                The forest averages the noise away. Since the friends are uncorrelated, their combined majority vote is highly accurate!
              </p>
              <div className="text-[var(--color-cat-ensemble)] text-sm">
                <MathBlock math={`\\hat{y} = \\text{mode}\\{h_1(x), ..., h_B(x)\\}`} block={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomForestAnim;
