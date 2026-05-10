import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BTreeAnim = ({ isPlaying, speed }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [message, setMessage] = useState('Initializing B-Tree (Order 3)...');

  useEffect(() => {
    if (!isPlaying) {
      setNodes([]);
      setEdges([]);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 2000 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;

      // Order 3 B-Tree: max 2 keys per node. If 3 keys -> splits.
      setMessage('B-Tree Order 3. Max 2 keys per node. Inserting 10...');
      setNodes([{ id: 1, keys: [10], x: 0, y: -50, isRoot: true }]);
      setEdges([]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setMessage('Inserting 20... Room available.');
      setNodes([{ id: 1, keys: [10, 20], x: 0, y: -50, isRoot: true }]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setMessage('Inserting 30... Node overfull! [10, 20, 30]. Splitting...');
      setNodes([{ id: 1, keys: [10, 20, 30], x: 0, y: -50, isRoot: true, overfull: true }]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setMessage('Middle key (20) pushes up to become new root. 10 and 30 become children.');
      setNodes([
        { id: 2, keys: [20], x: 0, y: -100, isRoot: true }, // new root
        { id: 3, keys: [10], x: -80, y: 0, isRoot: false }, // left child
        { id: 4, keys: [30], x: 80, y: 0, isRoot: false }   // right child
      ]);
      setEdges([{ from: 2, to: 3 }, { from: 2, to: 4 }]);
      await new Promise(r => setTimeout(r, baseDelay * 2));
      if (!isMounted) return;

      setMessage('Inserting 40... Goes to right child.');
      setNodes([
        { id: 2, keys: [20], x: 0, y: -100, isRoot: true },
        { id: 3, keys: [10], x: -80, y: 0, isRoot: false },
        { id: 4, keys: [30, 40], x: 80, y: 0, isRoot: false }
      ]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setMessage('Inserting 50... Right child overfull! [30, 40, 50]. Splitting...');
      setNodes([
        { id: 2, keys: [20], x: 0, y: -100, isRoot: true },
        { id: 3, keys: [10], x: -80, y: 0, isRoot: false },
        { id: 4, keys: [30, 40, 50], x: 80, y: 0, isRoot: false, overfull: true }
      ]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      setMessage('Middle key (40) pushes up to root. Root has room.');
      setNodes([
        { id: 2, keys: [20, 40], x: 0, y: -100, isRoot: true }, 
        { id: 3, keys: [10], x: -120, y: 0, isRoot: false },
        { id: 5, keys: [30], x: 0, y: 0, isRoot: false },
        { id: 6, keys: [50], x: 120, y: 0, isRoot: false }
      ]);
      setEdges([{ from: 2, to: 3 }, { from: 2, to: 5 }, { from: 2, to: 6 }]);
      await new Promise(r => setTimeout(r, baseDelay * 3));
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
      <div className="text-[#8b5cf6] font-space text-lg mb-8 h-8 text-center bg-[#8b5cf6]/10 px-4 py-2 rounded-full border border-[#8b5cf6]/30">
        {message}
      </div>

      <div className="relative w-[400px] h-[250px] flex items-center justify-center mt-8">
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
                  animate={{ opacity: 1, x1: fromC.x + 200, y1: fromC.y + 125, x2: toC.x + 200, y2: toC.y + 125 }}
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
              animate={{ opacity: 1, scale: 1, left: node.x + 200 - (node.keys.length * 20), top: node.y + 125 - 20 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`absolute h-10 rounded-md flex items-center justify-center font-space font-bold z-10 transition-colors duration-300 overflow-hidden
                ${node.overfull ? 'border-2 border-red-500 shadow-[0_0_15px_#ef4444]' : 'border-2 border-[#8b5cf6] shadow-lg'}
              `}
              style={{ width: Math.max(40, node.keys.length * 40) }}
            >
              {node.keys.map((k, i) => (
                <div key={i} className={`flex-1 h-full flex items-center justify-center ${i > 0 ? 'border-l border-[#8b5cf6]' : ''} ${node.overfull ? 'bg-red-500/20 text-red-500' : 'bg-[#050d1a] text-[#8b5cf6]'}`}>
                  {k}
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BTreeAnim;
