import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

// Generate XOR dataset with one noisy point
const generateData = () => {
  const points = [];
  // Top-Left (Blue, class 1)
  for (let i = 0; i < 15; i++) points.push({ x: Math.random() * 40 + 5, y: Math.random() * 40 + 55, class: 1 });
  // Top-Right (Red, class 0)
  for (let i = 0; i < 15; i++) points.push({ x: Math.random() * 40 + 55, y: Math.random() * 40 + 55, class: 0 });
  // Bottom-Left (Red, class 0)
  for (let i = 0; i < 15; i++) points.push({ x: Math.random() * 40 + 5, y: Math.random() * 40 + 5, class: 0 });
  // Bottom-Right (Blue, class 1)
  for (let i = 0; i < 15; i++) points.push({ x: Math.random() * 40 + 55, y: Math.random() * 40 + 5, class: 1 });
  
  // Noisy point: Blue point deep in the Bottom-Left Red region
  points.push({ x: 20, y: 20, class: 1, isNoise: true });

  return points;
};

const data = generateData();

const CARTAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Hardcode the pedagogical steps for clarity
  const steps = useMemo(() => [
    { phase: "Init", text: "Start with all data at the root.", nodes: [{ id: 1, text: "Root", x: 50, y: 10, purity: 0.5 }], splits: [], scan: null, highlight: [] },
    
    { phase: "Scan", text: "Scan X1 to find the lowest Gini Impurity...", nodes: [{ id: 1, text: "Root", x: 50, y: 10, purity: 0.5 }], splits: [], scan: { axis: 'x', pos: 30 }, highlight: [] },
    { phase: "Scan", text: "Scan X1 to find the lowest Gini Impurity...", nodes: [{ id: 1, text: "Root", x: 50, y: 10, purity: 0.5 }], splits: [], scan: { axis: 'x', pos: 50 }, highlight: [] },
    { phase: "Scan", text: "Scan X1 to find the lowest Gini Impurity...", nodes: [{ id: 1, text: "Root", x: 50, y: 10, purity: 0.5 }], splits: [], scan: { axis: 'x', pos: 70 }, highlight: [] },
    
    { phase: "Split 1", text: "Best split found at X = 50.", 
      nodes: [
        { id: 1, text: "X < 50", x: 50, y: 10, purity: 0.5 },
        { id: 2, text: "Left", x: 25, y: 40, purity: 0.25, parent: 1 },
        { id: 3, text: "Right", x: 75, y: 40, purity: 0.25, parent: 1 }
      ], 
      splits: [{ axis: 'x', pos: 50, min: 0, max: 100 }], scan: null, highlight: [] 
    },

    { phase: "Scan Left", text: "Now recursively split the Left region...", nodes: [
        { id: 1, text: "X < 50", x: 50, y: 10, purity: 0.5 },
        { id: 2, text: "Left", x: 25, y: 40, purity: 0.25, parent: 1 },
        { id: 3, text: "Right", x: 75, y: 40, purity: 0.25, parent: 1 }
      ], splits: [{ axis: 'x', pos: 50, min: 0, max: 100 }], scan: { axis: 'y', pos: 50, min: 0, max: 50 }, highlight: [] 
    },

    { phase: "Split 2", text: "Left region split at Y = 50.", 
      nodes: [
        { id: 1, text: "X < 50", x: 50, y: 10, purity: 0.5 },
        { id: 2, text: "Y < 50", x: 25, y: 40, purity: 0.25, parent: 1 },
        { id: 3, text: "Right", x: 75, y: 40, purity: 0.25, parent: 1 },
        { id: 4, text: "Red", x: 10, y: 70, purity: 0.05, parent: 2, color: '#ef4444' }, // impure due to noise
        { id: 5, text: "Blue", x: 40, y: 70, purity: 0.0, parent: 2, color: 'var(--color-electric-cyan)' }
      ], 
      splits: [
        { axis: 'x', pos: 50, min: 0, max: 100 },
        { axis: 'y', pos: 50, min: 0, max: 50 }
      ], scan: null, highlight: [] 
    },

    { phase: "Split 3", text: "Right region split at Y = 50.", 
      nodes: [
        { id: 1, text: "X < 50", x: 50, y: 10, purity: 0.5 },
        { id: 2, text: "Y < 50", x: 25, y: 40, purity: 0.25, parent: 1 },
        { id: 3, text: "Y < 50", x: 75, y: 40, purity: 0.25, parent: 1 },
        { id: 4, text: "Red", x: 10, y: 70, purity: 0.05, parent: 2, color: '#ef4444' },
        { id: 5, text: "Blue", x: 40, y: 70, purity: 0.0, parent: 2, color: 'var(--color-electric-cyan)' },
        { id: 6, text: "Blue", x: 60, y: 70, purity: 0.0, parent: 3, color: 'var(--color-electric-cyan)' },
        { id: 7, text: "Red", x: 90, y: 70, purity: 0.0, parent: 3, color: '#ef4444' }
      ], 
      splits: [
        { axis: 'x', pos: 50, min: 0, max: 100 },
        { axis: 'y', pos: 50, min: 0, max: 50 },
        { axis: 'y', pos: 50, min: 50, max: 100 }
      ], scan: null, highlight: [] 
    },

    { phase: "Overfit", text: "Tree forces a deep split just to isolate the 1 noisy point!", 
      nodes: [
        { id: 1, text: "X < 50", x: 50, y: 10, purity: 0.5 },
        { id: 2, text: "Y < 50", x: 25, y: 40, purity: 0.25, parent: 1 },
        { id: 3, text: "Y < 50", x: 75, y: 40, purity: 0.25, parent: 1 },
        { id: 4, text: "X < 25", x: 10, y: 70, purity: 0.05, parent: 2 }, // Splitting node 4
        { id: 5, text: "Blue", x: 40, y: 70, purity: 0.0, parent: 2, color: 'var(--color-electric-cyan)' },
        { id: 6, text: "Blue", x: 60, y: 70, purity: 0.0, parent: 3, color: 'var(--color-electric-cyan)' },
        { id: 7, text: "Red", x: 90, y: 70, purity: 0.0, parent: 3, color: '#ef4444' },
        { id: 8, text: "Red", x: 0, y: 95, purity: 0.0, parent: 4, color: '#ef4444' },
        { id: 9, text: "Blue (Noise)", x: 20, y: 95, purity: 0.0, parent: 4, color: 'var(--color-electric-cyan)' }
      ], 
      splits: [
        { axis: 'x', pos: 50, min: 0, max: 100 },
        { axis: 'y', pos: 50, min: 0, max: 50 },
        { axis: 'y', pos: 50, min: 50, max: 100 },
        { axis: 'x', pos: 25, min: 0, max: 50, ymin: 0, ymax: 50 } // tiny split for noise
      ], scan: null, highlight: [8, 9] 
    },

    { phase: "Prune", text: "Cost-Complexity Pruning detects overfitting and snips the branch.", 
      nodes: [
        { id: 1, text: "X < 50", x: 50, y: 10, purity: 0.5 },
        { id: 2, text: "Y < 50", x: 25, y: 40, purity: 0.25, parent: 1 },
        { id: 3, text: "Y < 50", x: 75, y: 40, purity: 0.25, parent: 1 },
        { id: 4, text: "Red", x: 10, y: 70, purity: 0.05, parent: 2, color: '#ef4444' },
        { id: 5, text: "Blue", x: 40, y: 70, purity: 0.0, parent: 2, color: 'var(--color-electric-cyan)' },
        { id: 6, text: "Blue", x: 60, y: 70, purity: 0.0, parent: 3, color: 'var(--color-electric-cyan)' },
        { id: 7, text: "Red", x: 90, y: 70, purity: 0.0, parent: 3, color: '#ef4444' }
      ], 
      splits: [
        { axis: 'x', pos: 50, min: 0, max: 100 },
        { axis: 'y', pos: 50, min: 0, max: 50 },
        { axis: 'y', pos: 50, min: 50, max: 100 }
      ], scan: null, highlight: [4] 
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
      }, 2500 / speed); // Slow pacing to let user read
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentStepIdx, steps.length, onComplete]);

  const currentStep = steps[currentStepIdx];

  // Map scatter plot coordinates
  const mapX = (x) => x;
  const mapY = (y) => 100 - y;

  return (
    <div className="w-full h-[600px] relative p-4 flex flex-col lg:flex-row gap-4">
      {/* LEFT CHART: Scatter Plot & Decision Boundaries */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" preserveAspectRatio="none">
          {/* Data Points */}
          {data.map((p, i) => (
            <circle 
              key={`pt-${i}`} 
              cx={mapX(p.x)} 
              cy={mapY(p.y)} 
              r="2" 
              fill={p.class === 1 ? 'var(--color-electric-cyan)' : '#ef4444'} 
              opacity={p.isNoise ? 1 : 0.6}
              stroke={p.isNoise ? '#fff' : 'none'}
              strokeWidth="0.5"
            />
          ))}

          {/* Locked Splits */}
          {currentStep.splits.map((s, i) => {
            if (s.axis === 'x') {
              const yMin = s.ymin !== undefined ? s.ymin : 0;
              const yMax = s.ymax !== undefined ? s.ymax : 100;
              return (
                <motion.line
                  key={`split-${i}`}
                  x1={s.pos} y1={mapY(yMin)} x2={s.pos} y2={mapY(yMax)}
                  stroke="#fbbf24" strokeWidth="1"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                />
              );
            } else {
              const xMin = s.min !== undefined ? s.min : 0;
              const xMax = s.max !== undefined ? s.max : 100;
              return (
                <motion.line
                  key={`split-${i}`}
                  x1={xMin} y1={mapY(s.pos)} x2={xMax} y2={mapY(s.pos)}
                  stroke="#fbbf24" strokeWidth="1"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                />
              );
            }
          })}

          {/* Scanning Line */}
          {currentStep.scan && (
            currentStep.scan.axis === 'x' ? (
              <motion.line
                x1={currentStep.scan.pos} y1="0" x2={currentStep.scan.pos} y2="100"
                stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="2 2"
                initial={false} animate={{ x1: currentStep.scan.pos, x2: currentStep.scan.pos }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.line
                x1={currentStep.scan.min} y1={mapY(currentStep.scan.pos)} x2={currentStep.scan.max} y2={mapY(currentStep.scan.pos)}
                stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="2 2"
                initial={false} animate={{ y1: mapY(currentStep.scan.pos), y2: mapY(currentStep.scan.pos) }}
                transition={{ duration: 0.5 }}
              />
            )
          )}
        </svg>
      </div>

      {/* RIGHT CHART: Tree Hierarchy */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Edges */}
          {currentStep.nodes.filter(n => n.parent).map(n => {
            const parent = currentStep.nodes.find(p => p.id === n.parent);
            return (
              <motion.line
                key={`edge-${n.id}`}
                x1={parent.x} y1={parent.y + 5} x2={n.x} y2={n.y - 5}
                stroke="#374151" strokeWidth="0.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              />
            );
          })}

          {/* Nodes */}
          {currentStep.nodes.map(n => {
            const isHighlighted = currentStep.highlight.includes(n.id);
            return (
              <motion.g key={`node-${n.id}`} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <rect 
                  x={n.x - 12} y={n.y - 6} width="24" height="12" rx="2" 
                  fill={n.color || "#1f2937"} 
                  stroke={isHighlighted ? "#ef4444" : "#4b5563"} 
                  strokeWidth={isHighlighted ? "1" : "0.5"} 
                />
                <text x={n.x} y={n.y + 1} fill="#fff" fontSize="3" fontFamily="monospace" textAnchor="middle">{n.text}</text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* MATH / TEXT PANEL */}
      <div className="w-full lg:w-64 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-classification)] mb-2 uppercase tracking-wide">Phase: {currentStep.phase}</h3>
          <p className="text-sm text-gray-300 font-source mb-6">
            {currentStep.text}
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.phase.includes('Scan') ? 'bg-[var(--color-cat-classification)]/10 border-[var(--color-cat-classification)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Gini Impurity</div>
              <div className="text-[var(--color-cat-classification)] text-sm">
                <MathBlock math={`1 - \\sum p_i^2`} block={false} />
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.phase === 'Prune' ? 'bg-[#ef4444]/10 border-[#ef4444]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Cost-Complexity</div>
              <div className="text-[#ef4444] text-sm flex flex-col">
                <MathBlock math={`R_\\alpha(T) = R(T) + \\alpha |T|`} block={false} />
              </div>
              {currentStep.phase === 'Prune' && (
                <p className="text-xs text-gray-400 mt-2">
                  The deep branch is snipped because the complexity penalty ($\alpha |T|$) outweighs the tiny reduction in error $R(T)$.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CARTAnim;
