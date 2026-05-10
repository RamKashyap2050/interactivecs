import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BinaryTreeAnim = ({ isPlaying, speed }) => {
  const [internalStep, setInternalStep] = useState(0);

  const nodes = [
    { id: 1, val: 10, x: 50, y: 15, parent: null },
    { id: 2, val: 5, x: 30, y: 35, parent: 1 },
    { id: 3, val: 15, x: 70, y: 35, parent: 1 },
    { id: 4, val: 2, x: 20, y: 55, parent: 2 },
    { id: 5, val: 7, x: 40, y: 55, parent: 2 },
    { id: 6, val: 12, x: 60, y: 55, parent: 3 },
    { id: 7, val: 20, x: 80, y: 55, parent: 3 },
  ];

  const steps = [
    { text: "A Binary Tree is a hierarchical structure where each node has at most two children.", highlight: [1] },
    { text: "The top node is called the Root.", highlight: [1] },
    { text: "Each node can have a Left Child...", highlight: [2, 4, 6] },
    { text: "...and a Right Child.", highlight: [3, 5, 7] },
    { text: "Nodes with no children are called Leaf Nodes.", highlight: [4, 5, 6, 7] },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setInternalStep(prev => (prev + 1) % steps.length);
      }, 3000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  return (
    <div className="w-full h-[500px] bg-[#020611] rounded-xl border border-gray-800 relative overflow-hidden flex flex-col">
      <div className="flex-1 relative">
        <svg viewBox="0 0 100 80" className="w-full h-full">
          {/* Edges */}
          {nodes.filter(n => n.parent).map(n => {
            const p = nodes.find(node => node.id === n.parent);
            return (
              <motion.line
                key={`edge-${n.id}`}
                x1={p.x} y1={p.y} x2={n.x} y2={n.y}
                stroke="#374151"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const isHighlighted = steps[internalStep].highlight.includes(n.id);
            return (
              <motion.g key={n.id} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <circle
                  cx={n.x} cy={n.y} r="4"
                  fill={isHighlighted ? "var(--color-electric-cyan)" : "#1f2937"}
                  stroke={isHighlighted ? "#fff" : "#4b5563"}
                  strokeWidth="0.5"
                />
                <text x={n.x} y={n.y + 1} fill="#fff" fontSize="3" textAnchor="middle" className="font-mono">{n.val}</text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      
      <div className="p-6 bg-[#050d1a] border-t border-gray-800">
        <p className="text-sm text-gray-300 font-source text-center">
          {steps[internalStep].text}
        </p>
      </div>
    </div>
  );
};

export default BinaryTreeAnim;
