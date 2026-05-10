import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';

const LinkedListAnim = ({ isPlaying, speed }) => {
  const [nodes, setNodes] = useState([]);
  const [message, setMessage] = useState('Initializing Linked List...');
  const [isDoubly, setIsDoubly] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState(null);

  useEffect(() => {
    if (!isPlaying) {
      setNodes([]);
      setMessage('Paused');
      setHighlightedNode(null);
      setIsDoubly(false);
      return;
    }

    let isMounted = true;
    const baseDelay = 1500 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      setIsDoubly(false);
      setNodes([]);
      setHighlightedNode(null);

      // Build initial list
      setMessage('Creating initial chain: Head -> Node -> Null');
      for (let i = 1; i <= 3; i++) {
        await new Promise(r => setTimeout(r, baseDelay * 0.5));
        if (!isMounted) return;
        setNodes(prev => [...prev, { id: i, val: i * 10 }]);
      }
      
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      // Insert at beginning
      setMessage('O(1) Insert at Beginning: New node points to current Head. Head pointer updates.');
      setHighlightedNode('newHead');
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      
      setNodes(prev => [{ id: 'newHead', val: 5 }, ...prev]);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      setHighlightedNode(null);

      // Insert at end
      setMessage('O(n) Insert at End: Traverse to tail, update next pointer.');
      // Traverse animation
      for (let i = 0; i < nodes.length + 1; i++) {
        setHighlightedNode(nodes[i]?.id || 'newHead');
        await new Promise(r => setTimeout(r, baseDelay * 0.4));
      }
      
      if (!isMounted) return;
      setNodes(prev => [...prev, { id: 'newTail', val: 99 }]);
      setHighlightedNode('newTail');
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      setHighlightedNode(null);

      // Delete middle
      setMessage('Delete Middle: Route previous node pointer around the deleted node.');
      setHighlightedNode(2); // The original "2" node
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      setNodes(prev => prev.filter(n => n.id !== 2));
      await new Promise(r => setTimeout(r, baseDelay * 1.5));
      if (!isMounted) return;
      setHighlightedNode(null);

      // Morph to Doubly
      setMessage('Morphing to Doubly Linked List: Nodes now point backwards too.');
      setIsDoubly(true);
      await new Promise(r => setTimeout(r, baseDelay * 2.5));
      if (!isMounted) return;

      runAnimation(); // Loop
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-[#f59e0b] font-space text-lg mb-16 h-8 text-center bg-[#f59e0b]/10 px-4 py-2 rounded-full border border-[#f59e0b]/30">
        {message}
      </div>

      <div className="flex items-center flex-wrap justify-center gap-y-8">
        <AnimatePresence mode="popLayout">
          {/* Head Pointer */}
          {nodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center mr-2 text-gray-500 font-space text-xs uppercase"
            >
              Head
              <ArrowRight className="mx-2 w-4 h-4" />
            </motion.div>
          )}

          {nodes.map((node, idx) => {
            const isLast = idx === nodes.length - 1;
            const isHighlighted = highlightedNode === node.id;
            
            return (
              <motion.div
                layout
                key={node.id}
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center"
              >
                {/* Node Box */}
                <div className={`relative flex items-center border-2 rounded-md bg-[#050d1a] overflow-hidden transition-colors duration-300
                  ${isHighlighted ? 'border-[#06b6d4] shadow-[0_0_15px_#06b6d4]' : 'border-[#f59e0b]'}
                `}>
                  {/* Value */}
                  <div className={`px-4 py-3 font-space font-bold text-xl
                    ${isHighlighted ? 'text-[#06b6d4]' : 'text-white'}
                  `}>
                    {node.val}
                  </div>
                  {/* Next Pointer Area */}
                  <div className={`w-8 h-full border-l-2 flex flex-col items-center justify-center bg-[#f59e0b]/10
                    ${isHighlighted ? 'border-[#06b6d4]' : 'border-[#f59e0b]'}
                  `}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div>
                  </div>
                </div>

                {/* Arrow to next */}
                <div className="mx-2 flex items-center justify-center text-[#f59e0b]">
                  {isDoubly && !isLast ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ArrowLeftRight className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <ArrowRight className="w-6 h-6" />
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Null Terminator */}
          {nodes.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <div className="w-12 h-12 rounded bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 font-space font-bold text-sm shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                NULL
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-8 flex space-x-6 text-sm font-space text-gray-400">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#f59e0b] mr-2 rounded-sm"></div> Data Node
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 mr-2 rounded-sm"></div> Null Pointer
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#06b6d4] mr-2 rounded-sm"></div> Active Operation
        </div>
      </div>
    </div>
  );
};

export default LinkedListAnim;
