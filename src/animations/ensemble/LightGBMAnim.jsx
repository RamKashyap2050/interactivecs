import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const LightGBMAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => [
    {
      phase: "Init", text: "Standard algorithms grow trees 'Level-wise', meaning they split all nodes at a given depth before moving deeper.",
      levelWiseNodes: 1, leafWiseNodes: 1
    },
    {
      phase: "Split 1", text: "Both algorithms make their first split.",
      levelWiseNodes: 3, leafWiseNodes: 3
    },
    {
      phase: "Split 2", text: "Level-wise splits the next node on the same level to maintain perfect symmetry. Leaf-wise (LightGBM) hunts for the single leaf with the highest loss and splits THAT, regardless of symmetry.",
      levelWiseNodes: 5, leafWiseNodes: 5 // LightGBM splits left child
    },
    {
      phase: "Split 3", text: "Level-wise finishes the level. LightGBM continues digging deep into the highest error node, creating an asymmetrical shape.",
      levelWiseNodes: 7, leafWiseNodes: 7 // LightGBM splits left-left child
    },
    {
      phase: "Result", text: "LightGBM converges to lower loss much faster because it doesn't waste splits on low-error nodes. However, this deep asymmetrical growth makes it very prone to overfitting on small datasets!",
      levelWiseNodes: 15, leafWiseNodes: 15
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

  const renderNode = (x, y, visible, label = "") => (
    <motion.g initial={{ scale: 0 }} animate={{ scale: visible ? 1 : 0 }} transition={{ type: "spring" }}>
      <circle cx={x} cy={y} r="3" fill="#1f2937" stroke="var(--color-cat-ensemble)" strokeWidth="0.5" />
      {label && <text x={x} y={y + 1} fill="white" fontSize="2" fontFamily="monospace" textAnchor="middle">{label}</text>}
    </motion.g>
  );

  const renderLine = (x1, y1, x2, y2, visible) => (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1"
      initial={{ pathLength: 0 }} animate={{ pathLength: visible ? 1 : 0 }}
    />
  );

  return (
    <div className="w-full h-[650px] relative p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT CHART: Visual Comparison */}
      <div className="flex-1 flex gap-2">
        {/* Level-Wise (Standard) */}
        <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50 p-2">
          <div className="text-[10px] text-gray-500 font-space uppercase text-center mb-2">Level-Wise (XGBoost/CART)</div>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* L0 */}
            {renderNode(50, 10, currentStep.levelWiseNodes >= 1)}
            {/* L1 */}
            {renderLine(50, 13, 25, 30, currentStep.levelWiseNodes >= 3)}
            {renderLine(50, 13, 75, 30, currentStep.levelWiseNodes >= 3)}
            {renderNode(25, 30, currentStep.levelWiseNodes >= 3)}
            {renderNode(75, 30, currentStep.levelWiseNodes >= 3)}
            {/* L2 */}
            {renderLine(25, 33, 10, 50, currentStep.levelWiseNodes >= 5)}
            {renderLine(25, 33, 40, 50, currentStep.levelWiseNodes >= 5)}
            {renderNode(10, 50, currentStep.levelWiseNodes >= 5)}
            {renderNode(40, 50, currentStep.levelWiseNodes >= 5)}
            
            {renderLine(75, 33, 60, 50, currentStep.levelWiseNodes >= 7)}
            {renderLine(75, 33, 90, 50, currentStep.levelWiseNodes >= 7)}
            {renderNode(60, 50, currentStep.levelWiseNodes >= 7)}
            {renderNode(90, 50, currentStep.levelWiseNodes >= 7)}
            {/* L3 (Simulated full expansion for phase 5) */}
            {renderLine(10, 53, 5, 70, currentStep.levelWiseNodes >= 15)}
            {renderLine(10, 53, 15, 70, currentStep.levelWiseNodes >= 15)}
            {renderLine(40, 53, 35, 70, currentStep.levelWiseNodes >= 15)}
            {renderLine(40, 53, 45, 70, currentStep.levelWiseNodes >= 15)}
            {renderLine(60, 53, 55, 70, currentStep.levelWiseNodes >= 15)}
            {renderLine(60, 53, 65, 70, currentStep.levelWiseNodes >= 15)}
            {renderLine(90, 53, 85, 70, currentStep.levelWiseNodes >= 15)}
            {renderLine(90, 53, 95, 70, currentStep.levelWiseNodes >= 15)}
            
            {renderNode(5, 70, currentStep.levelWiseNodes >= 15)}
            {renderNode(15, 70, currentStep.levelWiseNodes >= 15)}
            {renderNode(35, 70, currentStep.levelWiseNodes >= 15)}
            {renderNode(45, 70, currentStep.levelWiseNodes >= 15)}
            {renderNode(55, 70, currentStep.levelWiseNodes >= 15)}
            {renderNode(65, 70, currentStep.levelWiseNodes >= 15)}
            {renderNode(85, 70, currentStep.levelWiseNodes >= 15)}
            {renderNode(95, 70, currentStep.levelWiseNodes >= 15)}
          </svg>
        </div>

        {/* Leaf-Wise (LightGBM) */}
        <div className="flex-1 relative bg-[#020611] rounded-xl border border-[var(--color-cat-ensemble)]/50 overflow-hidden shadow-[0_0_15px_rgba(var(--color-cat-ensemble-rgb),0.2)] p-2">
          <div className="text-[10px] text-[var(--color-cat-ensemble)] font-space uppercase text-center font-bold mb-2">Leaf-Wise (LightGBM)</div>
          <svg viewBox="0 0 100 100" className="w-full h-full">
             {/* L0 */}
             {renderNode(50, 10, currentStep.leafWiseNodes >= 1, "Loss")}
            {/* Split 1 */}
            {renderLine(50, 13, 30, 25, currentStep.leafWiseNodes >= 3)}
            {renderLine(50, 13, 70, 25, currentStep.leafWiseNodes >= 3)}
            {renderNode(30, 25, currentStep.leafWiseNodes >= 3, currentStep.leafWiseNodes === 3 ? "MAX" : "")}
            {renderNode(70, 25, currentStep.leafWiseNodes >= 3)}
            
            {/* Split 2 (Digs into left node) */}
            {renderLine(30, 28, 15, 45, currentStep.leafWiseNodes >= 5)}
            {renderLine(30, 28, 45, 45, currentStep.leafWiseNodes >= 5)}
            {renderNode(15, 45, currentStep.leafWiseNodes >= 5)}
            {renderNode(45, 45, currentStep.leafWiseNodes >= 5, currentStep.leafWiseNodes === 5 ? "MAX" : "")}

            {/* Split 3 (Digs into the inner right node of the left branch) */}
            {renderLine(45, 48, 35, 65, currentStep.leafWiseNodes >= 7)}
            {renderLine(45, 48, 55, 65, currentStep.leafWiseNodes >= 7)}
            {renderNode(35, 65, currentStep.leafWiseNodes >= 7)}
            {renderNode(55, 65, currentStep.leafWiseNodes >= 7, currentStep.leafWiseNodes === 7 ? "MAX" : "")}

            {/* Split 4+ (Deep asymmetric growth for phase 5) */}
            {renderLine(55, 68, 45, 85, currentStep.leafWiseNodes >= 15)}
            {renderLine(55, 68, 65, 85, currentStep.leafWiseNodes >= 15)}
            {renderNode(45, 85, currentStep.leafWiseNodes >= 15)}
            {renderNode(65, 85, currentStep.leafWiseNodes >= 15)}
            {/* Notice how the right side of the root (node at 70,25) NEVER split because its loss was low! */}
          </svg>
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
            <div className={`p-3 rounded-lg border transition-all duration-500 bg-transparent border-gray-800`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Leaf-Wise Selection Strategy</div>
              <p className="text-xs text-gray-400 mb-2">
                Instead of balancing the tree, LightGBM searches all current leaves and splits the one that yields the maximum decrease in loss (gradient).
              </p>
              <div className="text-[var(--color-cat-ensemble)] text-sm">
                <MathBlock math={`\\text{node}^* = \\arg\\max_{\\text{leaf}} \\Delta \\text{Loss}`} block={false} />
              </div>
            </div>
            
            <div className={`p-3 rounded-lg border transition-all duration-500 bg-[#ef4444]/10 border-[#ef4444]/50`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Warning</div>
              <p className="text-xs text-red-400">
                Because of this asymmetrical depth, LightGBM requires you to tune <code className="text-[10px] bg-red-900/50 px-1 rounded">max_leaves</code> instead of <code className="text-[10px] bg-red-900/50 px-1 rounded">max_depth</code> to prevent catastrophic overfitting on small datasets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightGBMAnim;
