import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BPlusTreeAnim = ({ isPlaying, speed }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [linkedEdges, setLinkedEdges] = useState([]);
  const [message, setMessage] = useState('Initializing B+ Tree...');

  useEffect(() => {
    if (!isPlaying) {
      setNodes([]);
      setEdges([]);
      setLinkedEdges([]);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 2000 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;

      setLinkedEdges([]);
      // Start with standard B-Tree look
      setMessage('Standard B-Tree: Internal nodes store actual data.');
      setNodes([
        { id: 2, keys: [20, 40], x: 0, y: -100, isLeaf: false, dataMode: true }, 
        { id: 3, keys: [10], x: -120, y: 0, isLeaf: true, dataMode: true },
        { id: 5, keys: [30], x: 0, y: 0, isLeaf: true, dataMode: true },
        { id: 6, keys: [50], x: 120, y: 0, isLeaf: true, dataMode: true }
      ]);
      setEdges([{ from: 2, to: 3 }, { from: 2, to: 5 }, { from: 2, to: 6 }]);
      
      await new Promise(r => setTimeout(r, baseDelay * 2));
      if (!isMounted) return;

      setMessage('Morphing into B+ Tree: Internal nodes become pure routing guides. Data removed.');
      setNodes(prev => prev.map(n => n.isLeaf ? n : { ...n, dataMode: false }));
      await new Promise(r => setTimeout(r, baseDelay * 2));
      if (!isMounted) return;

      setMessage('Leaf nodes duplicate the routing keys to store ALL data at the bottom level.');
      setNodes([
        { id: 2, keys: [20, 40], x: 0, y: -100, isLeaf: false, dataMode: false }, 
        { id: 3, keys: [10], x: -120, y: 0, isLeaf: true, dataMode: true },
        { id: 5, keys: [20, 30], x: 0, y: 0, isLeaf: true, dataMode: true }, // duplicates 20
        { id: 6, keys: [40, 50], x: 120, y: 0, isLeaf: true, dataMode: true } // duplicates 40
      ]);
      await new Promise(r => setTimeout(r, baseDelay * 2));
      if (!isMounted) return;

      setMessage('Leaf nodes connect into a doubly linked list for fast O(K) range queries.');
      setLinkedEdges([{ from: 3, to: 5 }, { from: 5, to: 6 }]);
      await new Promise(r => setTimeout(r, baseDelay * 3));
      if (!isMounted) return;

      setMessage('Range Query [10 - 40]: Scan starts at leftmost leaf and traverses the linked list.');
      // Highlight scan
      const scanPath = [3, 5, 6];
      for (let i = 0; i < scanPath.length; i++) {
        if (!isMounted) return;
        setNodes(prev => prev.map(n => n.id === scanPath[i] ? { ...n, highlighted: true } : n));
        await new Promise(r => setTimeout(r, baseDelay));
      }

      await new Promise(r => setTimeout(r, baseDelay * 2));
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
        {/* Draw Tree Edges */}
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

          {/* Draw Linked List Edges */}
          <AnimatePresence>
            {linkedEdges.map((edge, idx) => {
              const fromC = getNodeCoords(edge.from);
              const toC = getNodeCoords(edge.to);
              return (
                <motion.line
                  key={`link-${edge.from}-${edge.to}`}
                  layout
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  x1={fromC.x + 200 + 30} // adjust right edge of node
                  y1={fromC.y + 125}
                  x2={toC.x + 200 - 30} // adjust left edge of node
                  y2={toC.y + 125}
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Draw Nodes */}
        <AnimatePresence>
          {nodes.map(node => {
            const isHighlighted = node.highlighted;
            const isDataMode = node.dataMode;
            
            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, left: node.x + 200 - (node.keys.length * 20), top: node.y + 125 - 20 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`absolute h-10 rounded-md flex items-center justify-center font-space font-bold z-10 transition-colors duration-300 overflow-hidden
                  ${isHighlighted ? 'border-2 border-[#06b6d4] shadow-[0_0_15px_#06b6d4]' : 'border-2 border-[#8b5cf6] shadow-lg'}
                `}
                style={{ width: Math.max(40, node.keys.length * 40) }}
              >
                {node.keys.map((k, i) => (
                  <div key={i} className={`flex-1 h-full flex flex-col items-center justify-center relative ${i > 0 ? 'border-l border-[#8b5cf6]' : ''} 
                    ${isHighlighted ? 'bg-[#06b6d4]/20 text-[#06b6d4]' : 'bg-[#050d1a] text-[#8b5cf6]'}
                  `}>
                    <span className={!isDataMode ? 'opacity-50 line-through text-gray-500' : ''}>{k}</span>
                    {/* Database icon placeholder to show data exists here */}
                    {isDataMode && <div className="absolute bottom-0 w-full h-1 bg-[#8b5cf6] opacity-30"></div>}
                  </div>
                ))}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BPlusTreeAnim;
