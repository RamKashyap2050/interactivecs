import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DFSAnim = ({ isPlaying, speed }) => {
  const [visited, setVisited] = useState([]);
  const [stack, setStack] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [message, setMessage] = useState('Initializing DFS...');

  // Tree representation
  const nodes = [
    { id: 1, val: 'A', x: 0, y: -80 },
    { id: 2, val: 'B', x: -80, y: 0 },
    { id: 3, val: 'C', x: 80, y: 0 },
    { id: 4, val: 'D', x: -120, y: 80 },
    { id: 5, val: 'E', x: -40, y: 80 },
    { id: 6, val: 'F', x: 40, y: 80 },
    { id: 7, val: 'G', x: 120, y: 80 },
  ];

  const edges = [
    { from: 1, to: 2 }, { from: 1, to: 3 },
    { from: 2, to: 4 }, { from: 2, to: 5 },
    { from: 3, to: 6 }, { from: 3, to: 7 }
  ];

  useEffect(() => {
    if (!isPlaying) {
      setVisited([]);
      setStack([]);
      setCurrentNode(null);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1200 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      setVisited([]);
      setStack([]);
      setCurrentNode(null);
      setMessage('Starting DFS from root node (A). Uses a Stack (LIFO).');
      
      let s = [1];
      let v = [];
      setStack([...s]);
      await new Promise(r => setTimeout(r, baseDelay));
      
      while (s.length > 0) {
        if (!isMounted) return;
        
        const curr = s.pop();
        setCurrentNode(curr);
        setStack([...s]);
        const nodeObj = nodes.find(n => n.id === curr);
        
        if (!v.includes(curr)) {
          v.push(curr);
          setVisited([...v]);
          setMessage(`Popped ${nodeObj.val}. Marked as visited. Pushing neighbors...`);
          await new Promise(r => setTimeout(r, baseDelay));
          if (!isMounted) return;

          // Find unvisited neighbors (push right then left so left is popped first for standard pre-order visual)
          const neighbors = edges.filter(e => e.from === curr).map(e => e.to).reverse();
          for (let n of neighbors) {
            if (!v.includes(n)) {
              s.push(n);
              setMessage(`Found neighbor ${nodes.find(x => x.id === n).val}. Pushing to stack.`);
              setStack([...s]);
              await new Promise(r => setTimeout(r, baseDelay * 0.5));
            }
          }
        } else {
          setMessage(`${nodeObj.val} was already visited. Skipping.`);
        }
        
        if (!isMounted) return;
        setCurrentNode(null);
        await new Promise(r => setTimeout(r, baseDelay * 0.5));
      }
      
      if (!isMounted) return;
      setMessage('DFS Complete! Explored deep before wide.');
      await new Promise(r => setTimeout(r, baseDelay * 3));
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-[#10b981] font-space text-lg mb-4 h-8 text-center bg-[#10b981]/10 px-4 py-2 rounded-full border border-[#10b981]/30">
        {message}
      </div>

      <div className="flex w-full max-w-md items-center mb-8 bg-[#020611] border border-gray-800 rounded p-2 overflow-x-auto h-16">
        <span className="text-gray-500 font-space text-sm mr-4 shrink-0">Stack:</span>
        <div className="flex gap-2">
          <AnimatePresence>
            {stack.map((id, idx) => {
              const node = nodes.find(n => n.id === id);
              return (
                <motion.div
                  key={`${id}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="w-10 h-10 rounded bg-[#f59e0b] flex items-center justify-center font-space font-bold text-[#050d1a]"
                >
                  {node.val}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {stack.length === 0 && <span className="text-gray-600 font-space text-sm italic mt-2">Empty</span>}
        </div>
      </div>

      <div className="relative w-[300px] h-[250px] flex items-center justify-center">
        {/* Draw Edges */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {edges.map((edge, idx) => (
            <line
              key={`edge-${idx}`}
              x1={nodes.find(n=>n.id===edge.from).x + 150}
              y1={nodes.find(n=>n.id===edge.from).y + 125}
              x2={nodes.find(n=>n.id===edge.to).x + 150}
              y2={nodes.find(n=>n.id===edge.to).y + 125}
              stroke="#4b5563"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Draw Nodes */}
        {nodes.map(node => {
          const isCurr = currentNode === node.id;
          const isVis = visited.includes(node.id);
          const isStacked = stack.includes(node.id);
          
          return (
            <motion.div
              key={node.id}
              initial={false}
              animate={{ 
                scale: isCurr ? 1.2 : 1,
                backgroundColor: isCurr ? '#f59e0b' : (isVis ? '#10b981' : (isStacked ? '#050d1a' : '#050d1a')),
                borderColor: isCurr ? '#f59e0b' : (isVis ? '#10b981' : (isStacked ? '#f59e0b' : '#4b5563')),
                color: (isCurr || isVis) ? '#050d1a' : (isStacked ? '#f59e0b' : '#4b5563')
              }}
              transition={{ duration: 0.3 }}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-space font-bold z-10 border-2 shadow-lg`}
              style={{ left: node.x + 150 - 24, top: node.y + 125 - 24 }}
            >
              {node.val}
            </motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-8 flex gap-6 text-xs font-space text-gray-400">
        <div className="flex items-center"><div className="w-3 h-3 bg-[#050d1a] border-2 border-[#4b5563] rounded-full mr-2"></div> Unvisited</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-[#050d1a] border-2 border-[#f59e0b] rounded-full mr-2"></div> In Stack</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div> Exploring</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-[#10b981] rounded-full mr-2"></div> Visited</div>
      </div>
    </div>
  );
};

export default DFSAnim;
