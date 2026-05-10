import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const HierarchicalAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Scatter points (A through F)
  const data = useMemo(() => [
    { id: 'A', x: 20, y: 70 },
    { id: 'B', x: 25, y: 75 }, // A & B are closest
    { id: 'C', x: 60, y: 30 },
    { id: 'D', x: 70, y: 35 }, // C & D are 2nd closest
    { id: 'E', x: 65, y: 25 }, // C, D & E will merge next
    { id: 'F', x: 80, y: 80 }  // Outlier
  ], []);

  const steps = useMemo(() => [
    {
      phase: "Init", text: "Agglomerative Clustering starts by treating every single data point as its own independent cluster.",
      clusters: [['A'], ['B'], ['C'], ['D'], ['E'], ['F']],
      dendrogramLines: []
    },
    {
      phase: "Merge 1", text: "It finds the two closest clusters (A & B) based on distance, and merges them.",
      clusters: [['A', 'B'], ['C'], ['D'], ['E'], ['F']],
      dendrogramLines: [{ id: 'l1', x1: 15, y1: 90, x2: 30, y2: 90, h: 80, isNew: true }] // Connect A & B at height 80
    },
    {
      phase: "Merge 2", text: "Next, C & D are the closest. They merge. Notice how the Dendrogram on the right builds the tree bottom-up simultaneously.",
      clusters: [['A', 'B'], ['C', 'D'], ['E'], ['F']],
      dendrogramLines: [
        { id: 'l1', x1: 15, y1: 90, x2: 30, y2: 90, h: 80, isNew: false },
        { id: 'l2', x1: 45, y1: 90, x2: 60, y2: 90, h: 70, isNew: true } // Connect C & D at height 70
      ]
    },
    {
      phase: "Merge 3", text: "E is closest to the new (C,D) cluster. The distance is calculated using Linkage criteria (e.g., Ward's method).",
      clusters: [['A', 'B'], ['C', 'D', 'E'], ['F']],
      dendrogramLines: [
        { id: 'l1', x1: 15, y1: 90, x2: 30, y2: 90, h: 80, isNew: false },
        { id: 'l2', x1: 45, y1: 90, x2: 60, y2: 90, h: 70, isNew: false },
        { id: 'l3', x1: 52.5, y1: 70, x2: 75, y2: 90, h: 50, isNew: true } // Connect (C,D) midpoint to E
      ]
    },
    {
      phase: "Merge 4", text: "The (A,B) cluster merges with the (C,D,E) cluster.",
      clusters: [['A', 'B', 'C', 'D', 'E'], ['F']],
      dendrogramLines: [
        { id: 'l1', x1: 15, y1: 90, x2: 30, y2: 90, h: 80, isNew: false },
        { id: 'l2', x1: 45, y1: 90, x2: 60, y2: 90, h: 70, isNew: false },
        { id: 'l3', x1: 52.5, y1: 70, x2: 75, y2: 90, h: 50, isNew: false },
        { id: 'l4', x1: 22.5, y1: 80, x2: 63.75, y2: 50, h: 30, isNew: true } // Connect AB to CDE
      ]
    },
    {
      phase: "Final Merge", text: "Finally, the isolated point F is swallowed. We now have one giant root cluster containing everything. You can cut the Dendrogram horizontally to get any number of clusters (K) you want!",
      clusters: [['A', 'B', 'C', 'D', 'E', 'F']],
      dendrogramLines: [
        { id: 'l1', x1: 15, y1: 90, x2: 30, y2: 90, h: 80, isNew: false },
        { id: 'l2', x1: 45, y1: 90, x2: 60, y2: 90, h: 70, isNew: false },
        { id: 'l3', x1: 52.5, y1: 70, x2: 75, y2: 90, h: 50, isNew: false },
        { id: 'l4', x1: 22.5, y1: 80, x2: 63.75, y2: 50, h: 30, isNew: false },
        { id: 'l5', x1: 43.125, y1: 30, x2: 90, y2: 90, h: 10, isNew: true } // Connect root to F
      ]
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

  // Helper to draw the glowing bubble around a cluster
  const getClusterBubble = (clusterArr) => {
    if (clusterArr.length === 1) return null; // No bubble for single points
    
    const points = clusterArr.map(id => data.find(p => p.id === id));
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    // Calculate center and radius
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const r = Math.max(
      Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)) / 2 + 10, // Buffer
      10 // Minimum radius
    );

    return { cx, cy, r };
  };

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Scatter Plot */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-2 flex flex-col">
        <div className="text-[10px] text-gray-500 font-space uppercase text-center mb-2">Spatial View</div>
        <svg viewBox="0 0 100 100" className="w-full flex-grow">
          
          {/* Cluster Bubbles */}
          <AnimatePresence>
            {currentStep.clusters.map((cluster, i) => {
              const bubble = getClusterBubble(cluster);
              if (!bubble) return null;
              return (
                <motion.circle
                  key={`bubble-${cluster.join('-')}`}
                  cx={bubble.cx} cy={bubble.cy} r={bubble.r}
                  fill="rgba(16, 185, 129, 0.1)" // Green tint
                  stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </AnimatePresence>

          {/* Data Points */}
          {data.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="1.5" fill="#e5e7eb" />
              <text x={p.x} y={p.y - 3} fill="#9ca3af" fontSize="3" fontFamily="monospace" textAnchor="middle">{p.id}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* RIGHT CHART: Dendrogram */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-[var(--color-cat-unsupervised)]/50 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.2)] p-2 flex flex-col">
        <div className="text-[10px] text-[var(--color-cat-unsupervised)] font-space uppercase text-center font-bold mb-2">Dendrogram (Tree View)</div>
        <svg viewBox="0 0 100 100" className="w-full flex-grow">
          {/* Y Axis (Distance) */}
          <line x1="5" y1="10" x2="5" y2="90" stroke="#374151" strokeWidth="0.5" />
          <text x="3" y="10" fill="#6b7280" fontSize="3" transform="rotate(-90 3 10)">Distance</text>
          
          {/* X Axis Labels (Leaves) */}
          <text x="15" y="95" fill="#e5e7eb" fontSize="4" fontFamily="monospace" textAnchor="middle">A</text>
          <text x="30" y="95" fill="#e5e7eb" fontSize="4" fontFamily="monospace" textAnchor="middle">B</text>
          <text x="45" y="95" fill="#e5e7eb" fontSize="4" fontFamily="monospace" textAnchor="middle">C</text>
          <text x="60" y="95" fill="#e5e7eb" fontSize="4" fontFamily="monospace" textAnchor="middle">D</text>
          <text x="75" y="95" fill="#e5e7eb" fontSize="4" fontFamily="monospace" textAnchor="middle">E</text>
          <text x="90" y="95" fill="#e5e7eb" fontSize="4" fontFamily="monospace" textAnchor="middle">F</text>

          {/* U-Shaped Lines */}
          <AnimatePresence>
            {currentStep.dendrogramLines.map((l) => (
              <motion.g key={l.id} initial={l.isNew ? { opacity: 0, pathLength: 0 } : false} animate={{ opacity: 1, pathLength: 1 }} transition={{ duration: 0.5 }}>
                {/* Vertical drops */}
                <line x1={l.x1} y1={l.y1} x2={l.x1} y2={l.h} stroke={l.isNew ? "#10b981" : "#e5e7eb"} strokeWidth="0.5" />
                <line x1={l.x2} y1={l.y2} x2={l.x2} y2={l.h} stroke={l.isNew ? "#10b981" : "#e5e7eb"} strokeWidth="0.5" />
                {/* Horizontal bridge */}
                <line x1={l.x1} y1={l.h} x2={l.x2} y2={l.h} stroke={l.isNew ? "#10b981" : "#e5e7eb"} strokeWidth="0.5" />
                {l.isNew && <circle cx={(l.x1 + l.x2) / 2} cy={l.h} r="1" fill="#10b981" />}
              </motion.g>
            ))}
          </AnimatePresence>

          {/* Horizontal Cut Line visual for the final step */}
          <AnimatePresence>
            {currentStep.phase === "Final Merge" && (
              <motion.line 
                x1="5" y1="60" x2="95" y2="60" 
                stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              />
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* MATH / TEXT PANEL */}
      <div className="w-full md:w-80 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-unsupervised)] mb-2 uppercase tracking-wide">Phase: {currentStep.phase}</h3>
          <p className="text-sm text-gray-300 font-source mb-6">
            {currentStep.text}
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 bg-[var(--color-cat-unsupervised)]/10 border-[var(--color-cat-unsupervised)]/50`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Linkage Criteria</div>
              <p className="text-xs text-gray-400 mb-2">How do we measure distance between two clusters? Ward's method minimizes the total within-cluster variance.</p>
              <div className="text-[var(--color-cat-unsupervised)] text-[11px] overflow-x-auto">
                <MathBlock math={`D(C_i, C_j) = \\sum_{x \\in C_i \\cup C_j} ||x - m_{i \\cup j}||^2`} block={false} />
              </div>
            </div>
            
            <AnimatePresence>
              {currentStep.phase === "Final Merge" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-lg border transition-all duration-500 bg-[#ef4444]/10 border-[#ef4444]/50 mt-4`}>
                  <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Dendrogram Cut</div>
                  <p className="text-xs text-red-400">
                    By drawing a horizontal line across the dendrogram (the red dashed line), you intersect exactly 3 vertical lines. This gives you K=3 clusters without having to guess K beforehand!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchicalAnim;
