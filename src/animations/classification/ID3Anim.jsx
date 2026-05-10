import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

// Shapes dataset
// Attributes: Color (R/B), Size (S/L). Target: Shape (Square=0, Triangle=1)
const generateData = () => {
  return [
    { id: 1, color: 'Red', size: 'Small', shape: 0, x: 20, y: 20 },
    { id: 2, color: 'Red', size: 'Large', shape: 0, x: 40, y: 20 },
    { id: 3, color: 'Red', size: 'Small', shape: 0, x: 60, y: 20 },
    { id: 4, color: 'Red', size: 'Large', shape: 0, x: 80, y: 20 },
    { id: 5, color: 'Blue', size: 'Small', shape: 1, x: 30, y: 40 },
    { id: 6, color: 'Blue', size: 'Large', shape: 1, x: 50, y: 40 },
    { id: 7, color: 'Blue', size: 'Small', shape: 1, x: 70, y: 40 },
  ];
};

const data = generateData();

const ID3Anim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    { 
      phase: "Init", text: "Start with a mixed dataset. ID3 evaluates categorical attributes.", 
      entropy: "0.985", gain: "0.00",
      buckets: [
        { label: "Root (Mixed)", filter: () => true, x: 50, y: 30 }
      ]
    },
    { 
      phase: "Evaluate: Size", text: "What if we split by Size? The resulting buckets are still very mixed.", 
      entropy: "0.971", gain: "0.014",
      buckets: [
        { label: "Size: Small", filter: (d) => d.size === 'Small', x: 25, y: 70 },
        { label: "Size: Large", filter: (d) => d.size === 'Large', x: 75, y: 70 }
      ]
    },
    { 
      phase: "Evaluate: Color", text: "What if we split by Color? The resulting buckets are perfectly pure!", 
      entropy: "0.000", gain: "0.985",
      buckets: [
        { label: "Color: Red", filter: (d) => d.color === 'Red', x: 25, y: 70 },
        { label: "Color: Blue", filter: (d) => d.color === 'Blue', x: 75, y: 70 }
      ]
    },
    { 
      phase: "Split", text: "ID3 chooses 'Color' because it yields the highest Information Gain.", 
      entropy: "0.000", gain: "0.985",
      buckets: [
        { label: "Color: Red (All Squares)", filter: (d) => d.color === 'Red', x: 25, y: 70, pure: true },
        { label: "Color: Blue (All Triangles)", filter: (d) => d.color === 'Blue', x: 75, y: 70, pure: true }
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
      }, 3500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentStepIdx, steps.length, onComplete]);

  const currentStep = steps[currentStepIdx];

  // Helper to arrange points in a bucket
  const getPointPosition = (point, bucketIdx, totalBuckets) => {
    const bucket = currentStep.buckets[bucketIdx];
    const itemsInBucket = data.filter(bucket.filter);
    const itemIdx = itemsInBucket.findIndex(d => d.id === point.id);
    
    // Grid layout within bucket
    const cols = 3;
    const row = Math.floor(itemIdx / cols);
    const col = itemIdx % cols;
    
    return {
      x: bucket.x - 10 + (col * 10),
      y: bucket.y - 10 + (row * 10)
    };
  };

  return (
    <div className="w-full h-[600px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Bucket Sorting */}
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Bucket Outlines */}
          {currentStep.buckets.map((b, i) => (
            <motion.g key={`bucket-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={b.x - 20} y={b.y - 20} width="40" height="40" rx="4" fill="none" stroke={b.pure ? "#39ff14" : "#374151"} strokeWidth="1" strokeDasharray="2 2" />
              <text x={b.x} y={b.y - 22} fill={b.pure ? "#39ff14" : "#9ca3af"} fontSize="3" fontFamily="monospace" textAnchor="middle">{b.label}</text>
            </motion.g>
          ))}

          {/* Connectors (if split) */}
          {currentStep.buckets.length > 1 && currentStep.buckets.map((b, i) => (
            <motion.line
              key={`conn-${i}`}
              x1="50" y1="40" x2={b.x} y2={b.y - 20}
              stroke="#374151" strokeWidth="0.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            />
          ))}

          {/* Data Points */}
          {data.map((p) => {
            // Find which bucket this point belongs to
            const bucketIdx = currentStep.buckets.findIndex(b => b.filter(p));
            if (bucketIdx === -1) return null; // Shouldn't happen
            
            const targetPos = getPointPosition(p, bucketIdx, currentStep.buckets.length);

            return (
              <motion.g 
                key={`pt-${p.id}`}
                animate={{ x: targetPos.x, y: targetPos.y }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
              >
                {p.shape === 0 ? (
                  // Square
                  <rect x="-3" y="-3" width="6" height="6" fill={p.color === 'Red' ? '#ef4444' : 'var(--color-electric-cyan)'} />
                ) : (
                  // Triangle
                  <polygon points="0,-4 4,3 -4,3" fill={p.color === 'Red' ? '#ef4444' : 'var(--color-electric-cyan)'} />
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* MATH / TEXT PANEL */}
      <div className="w-full md:w-72 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-classification)] mb-2 uppercase tracking-wide">Phase: {currentStep.phase}</h3>
          <p className="text-sm text-gray-300 font-source mb-6">
            {currentStep.text}
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 bg-[var(--color-cat-classification)]/10 border-[var(--color-cat-classification)]/50`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Shannon Entropy $H(S)$</div>
              <div className="text-[var(--color-cat-classification)] text-sm">
                <MathBlock math={`- \\sum p_i \\log_2 p_i`} block={false} />
              </div>
              <div className="mt-2 text-xs font-mono text-gray-300 flex justify-between">
                <span>Current Entropy:</span>
                <span className="font-bold text-white">{currentStep.entropy}</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-all duration-500 bg-transparent border-gray-800`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Information Gain</div>
              <div className="text-white text-sm">
                <MathBlock math={`Gain = H(S) - \\sum \\frac{|S_v|}{|S|} H(S_v)`} block={false} />
              </div>
              <div className="mt-2 text-xs font-mono text-gray-300 flex justify-between">
                <span>Gain:</span>
                <span className="font-bold text-[var(--color-phosphor-green)]">+{currentStep.gain}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ID3Anim;
