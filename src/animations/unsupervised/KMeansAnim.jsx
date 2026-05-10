import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const generateKMeansData = () => {
  const points = [];
  // Cluster 1 (Top Left)
  for (let i = 0; i < 15; i++) points.push({ id: `c1-${i}`, x: 20 + Math.random() * 20, y: 20 + Math.random() * 20 });
  // Cluster 2 (Top Right)
  for (let i = 0; i < 15; i++) points.push({ id: `c2-${i}`, x: 60 + Math.random() * 20, y: 30 + Math.random() * 20 });
  // Cluster 3 (Bottom Center)
  for (let i = 0; i < 15; i++) points.push({ id: `c3-${i}`, x: 40 + Math.random() * 20, y: 70 + Math.random() * 20 });
  return points;
};

const KMeansAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const data = useMemo(() => generateKMeansData(), []);

  // Define the exact state at each step to make the animation deterministic and loopable
  const steps = useMemo(() => {
    const s = [];
    const cColors = ["#f59e0b", "#8b5cf6", "#06b6d4"];
    
    // Initial state: No centroids, all points grey
    s.push({
      phase: "Init", text: "We have an unlabeled dataset. We want to find K=3 hidden clusters.",
      centroids: [], pointColors: {}, inertia: "???"
    });

    // K-Means++ Init 1
    s.push({
      phase: "K-Means++ Init", text: "We pick the first centroid completely randomly.",
      centroids: [{ id: 'k1', x: 25, y: 25, color: cColors[0] }],
      pointColors: {}, inertia: "???"
    });

    // K-Means++ Init 2
    s.push({
      phase: "K-Means++ Init", text: "We pick the second centroid as far away from the first one as possible. This is the magic of K-Means++!",
      centroids: [{ id: 'k1', x: 25, y: 25, color: cColors[0] }, { id: 'k2', x: 75, y: 80, color: cColors[1] }],
      pointColors: {}, inertia: "???"
    });

    // K-Means++ Init 3
    s.push({
      phase: "K-Means++ Init", text: "We pick the third centroid far away from the first two.",
      centroids: [{ id: 'k1', x: 25, y: 25, color: cColors[0] }, { id: 'k2', x: 75, y: 80, color: cColors[1] }, { id: 'k3', x: 80, y: 20, color: cColors[2] }],
      pointColors: {}, inertia: "???"
    });

    // Helper function to assign points and calculate centers/inertia
    const getNextState = (centroids) => {
      const assignments = {};
      let inertia = 0;
      const sums = { 'k1': {x:0, y:0, count:0}, 'k2': {x:0, y:0, count:0}, 'k3': {x:0, y:0, count:0} };

      data.forEach(p => {
        let minDist = Infinity;
        let bestC = null;
        centroids.forEach(c => {
          const dist = Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
          if (dist < minDist) {
            minDist = dist;
            bestC = c;
          }
        });
        assignments[p.id] = bestC.color;
        inertia += minDist;
        sums[bestC.id].x += p.x;
        sums[bestC.id].y += p.y;
        sums[bestC.id].count += 1;
      });

      const newCentroids = centroids.map(c => ({
        id: c.id, color: c.color,
        x: sums[c.id].count > 0 ? sums[c.id].x / sums[c.id].count : c.x,
        y: sums[c.id].count > 0 ? sums[c.id].y / sums[c.id].count : c.y
      }));

      return { assignments, newCentroids, inertia: Math.round(inertia / 100) };
    };

    // Iteration 1
    let state = getNextState(s[3].centroids);
    s.push({
      phase: "Expectation Step", text: "We assign every data point to its nearest centroid. Notice how the boundaries form (Voronoi partition).",
      centroids: s[3].centroids, pointColors: state.assignments, inertia: state.inertia
    });
    s.push({
      phase: "Maximization Step", text: "We calculate the 'center of mass' of each colored group and physically move the centroid to that exact spot.",
      centroids: state.newCentroids, pointColors: state.assignments, inertia: state.inertia
    });

    // Iteration 2
    let prevState = state;
    state = getNextState(prevState.newCentroids);
    s.push({
      phase: "Expectation Step", text: "Because the centroids moved, some points on the borders change allegiance to a new, closer centroid.",
      centroids: prevState.newCentroids, pointColors: state.assignments, inertia: state.inertia
    });
    s.push({
      phase: "Maximization Step", text: "Centroids update their positions again based on the new groups.",
      centroids: state.newCentroids, pointColors: state.assignments, inertia: state.inertia
    });

    // Iteration 3 (Convergence)
    prevState = state;
    state = getNextState(prevState.newCentroids);
    s.push({
      phase: "Convergence", text: "No points changed groups, meaning the centroids didn't move. The algorithm has converged! We found our 3 clusters.",
      centroids: state.newCentroids, pointColors: state.assignments, inertia: state.inertia
    });

    return s;
  }, [data]);

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
      }, 3500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentStepIdx, steps.length, onComplete]);

  const currentStep = steps[currentStepIdx];

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Scatter Plot */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Data Points */}
          {data.map((p) => (
            <motion.circle
              key={p.id}
              cx={p.x} cy={p.y} r="1.5"
              fill={currentStep.pointColors[p.id] || "#4b5563"} // Default grey
              initial={false}
              animate={{ fill: currentStep.pointColors[p.id] || "#4b5563" }}
              transition={{ duration: 0.5 }}
            />
          ))}

          {/* Centroids */}
          <AnimatePresence>
            {currentStep.centroids.map((c) => (
              <motion.g
                key={c.id}
                initial={{ scale: 0, opacity: 0, x: c.x, y: c.y }}
                animate={{ scale: 1, opacity: 1, x: c.x, y: c.y }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
              >
                {/* Centroid Glow */}
                <circle cx="0" cy="0" r="4" fill={c.color} opacity="0.2" />
                {/* Centroid Crosshair */}
                <path d="M -3 0 L 3 0 M 0 -3 L 0 3" stroke={c.color} strokeWidth="1" strokeLinecap="round" />
                <circle cx="0" cy="0" r="1.5" fill="#050d1a" stroke={c.color} strokeWidth="0.5" />
              </motion.g>
            ))}
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
            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.phase === 'Expectation Step' ? 'bg-[var(--color-cat-unsupervised)]/10 border-[var(--color-cat-unsupervised)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Expectation Step</div>
              <p className="text-xs text-gray-400 mb-2">Assign points to the nearest centroid.</p>
              <div className="text-[var(--color-cat-unsupervised)] text-sm overflow-x-auto">
                <MathBlock math={`c^{(i)} := \\arg\\min_j ||x^{(i)} - \\mu_j||^2`} block={false} />
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 ${currentStep.phase === 'Maximization Step' ? 'bg-[var(--color-cat-unsupervised)]/10 border-[var(--color-cat-unsupervised)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Maximization Step</div>
              <p className="text-xs text-gray-400 mb-2">Move centroid to the mean of assigned points.</p>
              <div className="text-[var(--color-cat-unsupervised)] text-sm overflow-x-auto">
                <MathBlock math={`\\mu_j := \\frac{\\sum_{i=1}^m 1\\{c^{(i)} = j\\} x^{(i)}}{\\sum_{i=1}^m 1\\{c^{(i)} = j\\}}`} block={false} />
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 bg-transparent border-gray-800`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Inertia (WCSS)</div>
              <div className="mt-2 text-xs font-mono flex justify-between items-center">
                <span className="text-gray-300">Sum of squared distances:</span>
                <span className={`font-bold text-lg text-white`}>
                  {currentStep.inertia}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMeansAnim;
