import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

// Helper to generate a "half-moon" style dataset with some noise
const generateDBSCANData = () => {
  const points = [];
  // Cluster 1: Dense Moon 1 (Top arc)
  for (let i = 0; i < 20; i++) {
    const angle = Math.PI - (i / 19) * Math.PI;
    points.push({ id: `m1-${i}`, x: 50 + 30 * Math.cos(angle), y: 50 - 30 * Math.sin(angle), type: 'c1' });
  }
  // Cluster 2: Dense Moon 2 (Bottom arc)
  for (let i = 0; i < 20; i++) {
    const angle = Math.PI - (i / 19) * Math.PI;
    points.push({ id: `m2-${i}`, x: 65 + 30 * Math.cos(angle), y: 40 + 30 * Math.sin(angle), type: 'c2' });
  }
  // Noise
  points.push({ id: 'n1', x: 10, y: 80, type: 'noise' });
  points.push({ id: 'n2', x: 90, y: 15, type: 'noise' });
  points.push({ id: 'n3', x: 80, y: 85, type: 'noise' });
  
  return points;
};

const DBSCANAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const data = useMemo(() => generateDBSCANData(), []);

  const steps = useMemo(() => [
    {
      phase: "Init", text: "We have a complex 'half-moon' dataset. K-Means would fail completely here because the clusters aren't spherical.",
      activePoint: null, radarRadius: 0, showCore: false, coloredPoints: [], isNoise: false
    },
    {
      phase: "The Radar (ε)", text: "DBSCAN picks a random point and activates a radar with radius ε (Epsilon) to search for neighbors.",
      activePoint: data[10], radarRadius: 15, showCore: false, coloredPoints: [], isNoise: false // Pick a point in the middle of Moon 1
    },
    {
      phase: "Core Point logic", text: "It found 3 neighbors! Since 3 >= MinPts (which we set to 2), this is designated a 'Core Point' and a cluster begins.",
      activePoint: data[10], radarRadius: 15, showCore: true, coloredPoints: [data[9], data[10], data[11]], isNoise: false
    },
    {
      phase: "Density Expansion", text: "The cluster 'infects' its neighbors. They activate their own radars, finding more neighbors, causing the color to flood-fill through the dense region.",
      activePoint: null, radarRadius: 0, showCore: false, coloredPoints: data.filter(d => d.type === 'c1'), isNoise: false
    },
    {
      phase: "Noise Detection", text: "Later, it picks an isolated point. The radar finds 0 neighbors. Since 0 < MinPts, this point is marked as NOISE (Outlier) and ignored.",
      activePoint: data[40], radarRadius: 15, showCore: false, coloredPoints: data.filter(d => d.type === 'c1'), isNoise: true // n1 is at index 40
    },
    {
      phase: "Completion", text: "The process repeats until all points are visited. It perfectly separates the two moons and identifies the noise!",
      activePoint: null, radarRadius: 0, showCore: false, coloredPoints: data.filter(d => d.type !== 'noise'), isNoise: false
    }
  ], [data]);

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

  const getColor = (p) => {
    if (currentStep.phase === "Completion") {
      if (p.type === 'c1') return "#10b981"; // Green
      if (p.type === 'c2') return "#8b5cf6"; // Purple
      return "#ef4444"; // Red for noise
    }
    
    const isColored = currentStep.coloredPoints.some(cp => cp.id === p.id);
    if (isColored) return "#10b981";
    
    if (currentStep.isNoise && currentStep.activePoint && currentStep.activePoint.id === p.id) {
      return "#ef4444"; // Highlight active noise point
    }
    
    return "#4b5563"; // Default Grey
  };

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Scatter Plot */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Radar (Epsilon) */}
          <AnimatePresence>
            {currentStep.activePoint && currentStep.radarRadius > 0 && (
              <motion.circle
                initial={{ cx: currentStep.activePoint.x, cy: currentStep.activePoint.y, r: 0, opacity: 0 }}
                animate={{ cx: currentStep.activePoint.x, cy: currentStep.activePoint.y, r: currentStep.radarRadius, opacity: 0.2 }}
                exit={{ opacity: 0 }}
                fill={currentStep.isNoise ? "#ef4444" : "#10b981"}
                stroke={currentStep.isNoise ? "#ef4444" : "#10b981"}
                strokeWidth="1"
              />
            )}
          </AnimatePresence>

          {/* Data Points */}
          {data.map((p) => {
             const isNoiseMarked = (currentStep.phase === "Completion" && p.type === 'noise') || (currentStep.isNoise && currentStep.activePoint && currentStep.activePoint.id === p.id);
             
             return (
              <g key={p.id}>
                {!isNoiseMarked ? (
                  <motion.circle
                    cx={p.x} cy={p.y} r={currentStep.activePoint?.id === p.id ? "2.5" : "1.5"}
                    fill={getColor(p)}
                    animate={{ fill: getColor(p), r: currentStep.activePoint?.id === p.id ? 2.5 : 1.5 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <line x1={p.x - 2} y1={p.y - 2} x2={p.x + 2} y2={p.y + 2} stroke="#ef4444" strokeWidth="1" />
                    <line x1={p.x - 2} y1={p.y + 2} x2={p.x + 2} y2={p.y - 2} stroke="#ef4444" strokeWidth="1" />
                  </motion.g>
                )}
              </g>
            );
          })}
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
            <div className={`p-3 rounded-lg border transition-all duration-500 ${(currentStep.phase === 'The Radar (ε)' || currentStep.phase === 'Core Point logic') ? 'bg-[var(--color-cat-unsupervised)]/10 border-[var(--color-cat-unsupervised)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Epsilon Neighborhood</div>
              <p className="text-xs text-gray-400 mb-2">Find all points $q$ within distance $\epsilon$ of point $p$.</p>
              <div className="text-[var(--color-cat-unsupervised)] text-sm overflow-x-auto">
                <MathBlock math={`N_{\\epsilon}(p) = \\{q \\in D | \\text{dist}(p, q) \\le \\epsilon\\}`} block={false} />
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.showCore ? 'bg-green-500/10 border-green-500/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Core Point Condition</div>
              <p className="text-xs text-gray-400 mb-2">If the neighborhood has at least <code className="text-white px-1">MinPts</code> points, it's a Core Point.</p>
              <div className="text-green-400 text-sm font-mono">
                |N_ε(p)| ≥ MinPts
              </div>
            </div>

             <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.isNoise ? 'bg-red-500/10 border-red-500/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Noise (Outlier)</div>
              <p className="text-xs text-gray-400 mb-2">Points that are not Core Points and are not reachable from any Core Point.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBSCANAnim;
