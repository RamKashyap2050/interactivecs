import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AVLTreeAnim = ({ isPlaying, speed }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [message, setMessage] = useState('Initializing AVL Tree...');
  const [balanceMsg, setBalanceMsg] = useState('');

  useEffect(() => {
    if (!isPlaying) {
      setNodes([]);
      setEdges([]);
      setBalanceMsg('');
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1500 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      
      // Step 1: Insert 30, 20, 10 -> Causes Left-Left violation
      setMessage('Inserting 30, 20, 10. This creates an imbalance.');
      setBalanceMsg('');
      setNodes([
        { id: 30, val: 30, x: 0, y: -80, bf: 0 },
      ]);
      setEdges([]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setNodes([
        { id: 30, val: 30, x: 0, y: -80, bf: 1 },
        { id: 20, val: 20, x: -60, y: 0, bf: 0 }
      ]);
      setEdges([{ from: 30, to: 20 }]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setNodes([
        { id: 30, val: 30, x: 0, y: -80, bf: 2, violation: true }, // Violation!
        { id: 20, val: 20, x: -60, y: 0, bf: 1 },
        { id: 10, val: 10, x: -120, y: 80, bf: 0 }
      ]);
      setEdges([{ from: 30, to: 20 }, { from: 20, to: 10 }]);
      setBalanceMsg('Balance factor = 2 at node 30! Left-Left heavy.');
      await new Promise(r => setTimeout(r, baseDelay * 2));
      if (!isMounted) return;

      // Rotate Right
      setMessage('Performing Right Rotation around 30...');
      setBalanceMsg('Node 20 becomes root. 30 moves to right child.');
      setNodes([
        { id: 20, val: 20, x: 0, y: -80, bf: 0 }, // new root
        { id: 10, val: 10, x: -60, y: 0, bf: 0 }, // left child
        { id: 30, val: 30, x: 60, y: 0, bf: 0 }  // right child
      ]);
      setEdges([{ from: 20, to: 10 }, { from: 20, to: 30 }]);
      
      await new Promise(r => setTimeout(r, baseDelay * 3));
      if (!isMounted) return;

      // Step 2: Insert 40, 50 -> Causes Right-Right violation
      setMessage('Inserting 40, 50. Creating Right-Right imbalance.');
      setBalanceMsg('');
      setNodes([
        { id: 20, val: 20, x: 0, y: -80, bf: -1 }, 
        { id: 10, val: 10, x: -60, y: 0, bf: 0 }, 
        { id: 30, val: 30, x: 60, y: 0, bf: -1 },
        { id: 40, val: 40, x: 120, y: 80, bf: 0 }
      ]);
      setEdges([{ from: 20, to: 10 }, { from: 20, to: 30 }, { from: 30, to: 40 }]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setNodes([
        { id: 20, val: 20, x: 0, y: -80, bf: -2, violation: true }, // Violation!
        { id: 10, val: 10, x: -60, y: 0, bf: 0 }, 
        { id: 30, val: 30, x: 60, y: 0, bf: -2, violation: true }, // Violation!
        { id: 40, val: 40, x: 120, y: 80, bf: -1 },
        { id: 50, val: 50, x: 180, y: 160, bf: 0 }
      ]);
      setEdges([{ from: 20, to: 10 }, { from: 20, to: 30 }, { from: 30, to: 40 }, { from: 40, to: 50 }]);
      setBalanceMsg('Balance factor = -2! Right-Right heavy at 30.');
      await new Promise(r => setTimeout(r, baseDelay * 2));
      if (!isMounted) return;

      // Rotate Left
      setMessage('Performing Left Rotation around 30...');
      setBalanceMsg('Node 40 becomes parent. 30 moves to left child.');
      setNodes([
        { id: 20, val: 20, x: 0, y: -80, bf: -1 }, 
        { id: 10, val: 10, x: -60, y: 0, bf: 0 }, 
        { id: 40, val: 40, x: 60, y: 0, bf: 0 }, // new sub-root
        { id: 30, val: 30, x: 20, y: 80, bf: 0 }, // left child
        { id: 50, val: 50, x: 100, y: 80, bf: 0 }  // right child
      ]);
      setEdges([{ from: 20, to: 10 }, { from: 20, to: 40 }, { from: 40, to: 30 }, { from: 40, to: 50 }]);

      await new Promise(r => setTimeout(r, baseDelay * 4));
      if (!isMounted) return;
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  const getNodeCoords = (id) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-[#8b5cf6] font-space text-lg mb-4 h-8 text-center bg-[#8b5cf6]/10 px-4 py-2 rounded-full border border-[#8b5cf6]/30">
        {message}
      </div>
      
      <div className="h-8 mb-4 text-[#f59e0b] font-mono text-sm">
        {balanceMsg}
      </div>

      <div className="relative w-[400px] h-[300px] flex items-center justify-center mt-4">
        {/* Draw Edges */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <AnimatePresence>
            {edges.map((edge, idx) => {
              const fromC = getNodeCoords(edge.from);
              const toC = getNodeCoords(edge.to);
              return (
                <motion.line
                  key={`edge-${edge.from}-${edge.to}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, x1: fromC.x + 200, y1: fromC.y + 150, x2: toC.x + 200, y2: toC.y + 150 }}
                  exit={{ opacity: 0 }}
                  stroke="#4b5563"
                  strokeWidth="2"
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Draw Nodes */}
        <AnimatePresence>
          {nodes.map(node => (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, left: node.x + 200 - 24, top: node.y + 150 - 24 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-space font-bold z-10 transition-colors duration-300
                ${node.violation ? 'bg-red-500 text-white shadow-[0_0_20px_#ef4444]' : 'bg-[#050d1a] border-2 border-[#8b5cf6] text-[#8b5cf6]'}
              `}
            >
              {node.val}
              {/* Balance Factor Label */}
              <div className={`absolute -top-6 text-[10px] ${node.violation ? 'text-red-500' : 'text-gray-400'}`}>
                BF: {node.bf}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AVLTreeAnim;
