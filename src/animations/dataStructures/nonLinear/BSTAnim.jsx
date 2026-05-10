import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BSTAnim = ({ isPlaying, speed }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [message, setMessage] = useState('Initializing Binary Search Tree...');
  const [activeNode, setActiveNode] = useState(null);
  const [cmpMsg, setCmpMsg] = useState('');

  // Values to insert to form a nice tree, then an unbalanced one
  const balancedVals = [50, 30, 70, 20, 40, 60, 80];
  const unbalancedVals = [10, 20, 30, 40, 50]; // becomes a linked list

  useEffect(() => {
    if (!isPlaying) {
      setNodes([]);
      setEdges([]);
      setActiveNode(null);
      setCmpMsg('');
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1200 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      
      // Phase 1: Balanced BST
      setNodes([]);
      setEdges([]);
      setActiveNode(null);
      setCmpMsg('');
      setMessage('Building a balanced BST. Left < Node < Right');
      
      let currentNodes = [];
      
      for (let val of balancedVals) {
        if (!isMounted) return;
        
        // Insert visualization
        let currId = currentNodes.length === 0 ? null : currentNodes[0].id;
        let x = 0, y = -100;
        let gapX = 100;
        let parent = null;

        if (currId !== null) {
          while (currId !== null) {
            setActiveNode(currId);
            const currNode = currentNodes.find(n => n.id === currId);
            if (!isMounted) return;
            
            setCmpMsg(`${val} ${val < currNode.val ? '<' : '>'} ${currNode.val} ? Go ${val < currNode.val ? 'Left' : 'Right'}`);
            await new Promise(r => setTimeout(r, baseDelay * 0.8));
            
            parent = currNode;
            gapX = gapX / 1.5;
            if (val < currNode.val) {
              currId = currNode.left;
              x = currNode.x - gapX;
              y = currNode.y + 70;
            } else {
              currId = currNode.right;
              x = currNode.x + gapX;
              y = currNode.y + 70;
            }
          }
        }
        
        setCmpMsg(`Insert ${val}`);
        const newNode = { id: val, val, x, y, left: null, right: null, parent: parent?.id };
        currentNodes.push(newNode);
        
        if (parent) {
          if (val < parent.val) parent.left = val;
          else parent.right = val;
          setEdges(prev => [...prev, { from: parent, to: newNode }]);
        }
        
        setNodes([...currentNodes]);
        setActiveNode(val);
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;
      }
      
      setActiveNode(null);
      setCmpMsg('');
      setMessage('Balanced BST gives O(log n) search. Now lets search for 60.');
      await new Promise(r => setTimeout(r, baseDelay * 2));
      
      // Search for 60
      let searchId = currentNodes[0].id;
      while (searchId !== null && searchId !== 60) {
        if (!isMounted) return;
        setActiveNode(searchId);
        const currNode = currentNodes.find(n => n.id === searchId);
        setCmpMsg(`60 ${60 < currNode.val ? '<' : '>'} ${currNode.val}. Go ${60 < currNode.val ? 'Left' : 'Right'}.`);
        await new Promise(r => setTimeout(r, baseDelay));
        searchId = 60 < currNode.val ? currNode.left : currNode.right;
      }
      if (!isMounted) return;
      setActiveNode(60);
      setCmpMsg('Found 60!');
      await new Promise(r => setTimeout(r, baseDelay * 3));
      
      // Phase 2: Unbalanced
      if (!isMounted) return;
      setNodes([]);
      setEdges([]);
      setActiveNode(null);
      setCmpMsg('');
      setMessage('Now building from sorted data: [10, 20, 30, 40, 50]');
      
      currentNodes = [];
      for (let val of unbalancedVals) {
        if (!isMounted) return;
        
        let currId = currentNodes.length === 0 ? null : currentNodes[0].id;
        let x = -100, y = -100;
        let parent = null;

        if (currId !== null) {
          while (currId !== null) {
            setActiveNode(currId);
            const currNode = currentNodes.find(n => n.id === currId);
            await new Promise(r => setTimeout(r, baseDelay * 0.4));
            parent = currNode;
            currId = currNode.right;
            x = currNode.x + 50;
            y = currNode.y + 60;
          }
        }
        
        const newNode = { id: val, val, x, y, left: null, right: null, parent: parent?.id };
        currentNodes.push(newNode);
        
        if (parent) {
          parent.right = val;
          setEdges(prev => [...prev, { from: parent, to: newNode }]);
        }
        
        setNodes([...currentNodes]);
        setActiveNode(val);
        await new Promise(r => setTimeout(r, baseDelay * 0.5));
      }
      
      setActiveNode(null);
      setMessage('Degenerated into a Linked List! Search is now O(n).');
      await new Promise(r => setTimeout(r, baseDelay * 4));
      if (!isMounted) return;

      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-[#8b5cf6] font-space text-lg mb-4 h-8 text-center bg-[#8b5cf6]/10 px-4 py-2 rounded-full border border-[#8b5cf6]/30">
        {message}
      </div>
      
      <div className="h-8 mb-4 text-[var(--color-electric-cyan)] font-mono text-sm">
        {cmpMsg}
      </div>

      <div className="relative w-[400px] h-[300px] flex items-center justify-center mt-4">
        {/* Draw Edges */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <AnimatePresence>
            {edges.map((edge, idx) => (
              <motion.line
                key={`edge-${edge.from.id}-${edge.to.id}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                x1={edge.from.x + 200}
                y1={edge.from.y + 150}
                x2={edge.to.x + 200}
                y2={edge.to.y + 150}
                stroke="#4b5563"
                strokeWidth="2"
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Draw Nodes */}
        <AnimatePresence>
          {nodes.map(node => {
            const isActive = activeNode === node.id;
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-space font-bold z-10 transition-colors duration-300
                  ${isActive ? 'bg-[#8b5cf6] text-white shadow-[0_0_20px_#8b5cf6]' : 'bg-[#050d1a] border-2 border-[#8b5cf6] text-[#8b5cf6]'}
                `}
                style={{
                  left: node.x + 200 - 24,
                  top: node.y + 150 - 24
                }}
              >
                {node.val}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BSTAnim;
