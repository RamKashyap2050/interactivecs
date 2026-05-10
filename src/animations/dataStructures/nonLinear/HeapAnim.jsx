import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeapAnim = ({ isPlaying, speed }) => {
  const [heap, setHeap] = useState([]);
  const [message, setMessage] = useState('Initializing Max-Heap...');
  const [activeIndices, setActiveIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);

  useEffect(() => {
    if (!isPlaying) {
      setHeap([]);
      setMessage('Paused');
      setActiveIndices([]);
      setSwapIndices([]);
      return;
    }

    let isMounted = true;
    const baseDelay = 1500 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      
      setHeap([]);
      setActiveIndices([]);
      setSwapIndices([]);
      setMessage('Building a Max-Heap (Parent ≥ Children)');

      const valsToInsert = [10, 20, 15, 30, 40];
      const currentHeap = [];

      // Insert logic with visual bubble up
      for (let val of valsToInsert) {
        if (!isMounted) return;
        currentHeap.push(val);
        setHeap([...currentHeap]);
        setMessage(`Insert ${val} at end of array (bottom of tree).`);
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;

        let currIdx = currentHeap.length - 1;
        setActiveIndices([currIdx]);
        await new Promise(r => setTimeout(r, baseDelay * 0.5));

        // Bubble up
        while (currIdx > 0) {
          if (!isMounted) return;
          let parentIdx = Math.floor((currIdx - 1) / 2);
          setActiveIndices([currIdx, parentIdx]);
          
          if (currentHeap[currIdx] > currentHeap[parentIdx]) {
            setMessage(`${currentHeap[currIdx]} > ${currentHeap[parentIdx]}. Swapping...`);
            setSwapIndices([currIdx, parentIdx]);
            await new Promise(r => setTimeout(r, baseDelay * 0.8));
            
            // Swap
            const temp = currentHeap[currIdx];
            currentHeap[currIdx] = currentHeap[parentIdx];
            currentHeap[parentIdx] = temp;
            
            if (!isMounted) return;
            setHeap([...currentHeap]);
            setSwapIndices([]);
            currIdx = parentIdx;
            await new Promise(r => setTimeout(r, baseDelay * 0.5));
          } else {
            setMessage(`${currentHeap[currIdx]} ≤ ${currentHeap[parentIdx]}. Heap property satisfied.`);
            await new Promise(r => setTimeout(r, baseDelay));
            break;
          }
        }
        
        setActiveIndices([]);
        await new Promise(r => setTimeout(r, baseDelay * 0.5));
      }

      if (!isMounted) return;
      setMessage('Max-Heap built! O(log n) insertion.');
      await new Promise(r => setTimeout(r, baseDelay * 2));

      // Extract Max
      if (!isMounted) return;
      setMessage('Extract Max: Remove root, move last element to root.');
      const max = currentHeap[0];
      currentHeap[0] = currentHeap.pop();
      setHeap([...currentHeap]);
      setActiveIndices([0]);
      await new Promise(r => setTimeout(r, baseDelay));

      // Sink down
      let idx = 0;
      while (true) {
        if (!isMounted) return;
        let leftIdx = 2 * idx + 1;
        let rightIdx = 2 * idx + 2;
        let largest = idx;

        if (leftIdx < currentHeap.length && currentHeap[leftIdx] > currentHeap[largest]) {
          largest = leftIdx;
        }
        if (rightIdx < currentHeap.length && currentHeap[rightIdx] > currentHeap[largest]) {
          largest = rightIdx;
        }

        if (largest !== idx) {
          setActiveIndices([idx, largest]);
          setMessage(`${currentHeap[idx]} < ${currentHeap[largest]}. Swapping down...`);
          setSwapIndices([idx, largest]);
          await new Promise(r => setTimeout(r, baseDelay * 0.8));

          const temp = currentHeap[idx];
          currentHeap[idx] = currentHeap[largest];
          currentHeap[largest] = temp;

          if (!isMounted) return;
          setHeap([...currentHeap]);
          setSwapIndices([]);
          idx = largest;
        } else {
          setMessage('Heap property restored. O(log n) extraction.');
          setActiveIndices([]);
          break;
        }
        await new Promise(r => setTimeout(r, baseDelay * 0.5));
      }

      await new Promise(r => setTimeout(r, baseDelay * 3));
      if (!isMounted) return;
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  const getTreeCoords = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const maxNodesInLevel = Math.pow(2, level);
    const positionInLevel = index - (Math.pow(2, level) - 1);
    
    // Width of the current level spread
    const width = 300 / Math.pow(1.5, level);
    
    const x = (positionInLevel - (maxNodesInLevel - 1) / 2) * width;
    const y = level * 70 - 60;
    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-[#8b5cf6] font-space text-lg mb-8 h-8 text-center bg-[#8b5cf6]/10 px-4 py-2 rounded-full border border-[#8b5cf6]/30">
        {message}
      </div>

      {/* Array Representation */}
      <div className="flex mb-12">
        <AnimatePresence>
          {heap.map((val, idx) => {
            const isActive = activeIndices.includes(idx);
            const isSwapping = swapIndices.includes(idx);
            return (
              <motion.div
                layout
                key={val + '-' + idx} // Value might be same but position matters, using composite key safely since values are unique in our test
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: isSwapping ? -10 : 0 }}
                exit={{ opacity: 0, scale: 0 }}
                className={`w-12 h-12 border-2 flex items-center justify-center rounded-md font-space text-lg mx-1 transition-colors duration-300
                  ${isActive ? 'border-[#06b6d4] bg-[#06b6d4]/20 text-[#06b6d4]' : 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-white'}
                `}
              >
                {val}
                <div className="absolute -bottom-5 text-gray-500 text-[10px]">{idx}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tree Representation */}
      <div className="relative w-[400px] h-[200px] flex items-center justify-center">
        {/* Draw Edges */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {heap.map((val, idx) => {
            if (idx === 0) return null;
            const parentIdx = Math.floor((idx - 1) / 2);
            const fromC = getTreeCoords(parentIdx);
            const toC = getTreeCoords(idx);
            return (
              <motion.line
                key={`edge-${idx}`}
                x1={fromC.x + 200}
                y1={fromC.y + 100}
                x2={toC.x + 200}
                y2={toC.y + 100}
                stroke="#4b5563"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Draw Nodes */}
        <AnimatePresence>
          {heap.map((val, idx) => {
            const coords = getTreeCoords(idx);
            const isActive = activeIndices.includes(idx);
            return (
              <motion.div
                layout
                key={val + '-' + idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, left: coords.x + 200 - 20, top: coords.y + 100 - 20 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-space font-bold z-10 transition-colors duration-300
                  ${isActive ? 'bg-[#06b6d4] text-[#050d1a] shadow-[0_0_15px_#06b6d4]' : 'bg-[#050d1a] border-2 border-[#8b5cf6] text-[#8b5cf6]'}
                `}
              >
                {val}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeapAnim;
