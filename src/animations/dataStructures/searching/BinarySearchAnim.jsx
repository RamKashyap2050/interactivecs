import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BinarySearchAnim = ({ isPlaying, speed }) => {
  const [array] = useState([7, 9, 12, 13, 23, 24, 34, 47, 64, 89]);
  const [target] = useState(47);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(array.length - 1);
  const [mid, setMid] = useState(null);
  const [message, setMessage] = useState('Initializing Binary Search...');

  useEffect(() => {
    if (!isPlaying) {
      setLeft(0);
      setRight(array.length - 1);
      setMid(null);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1500 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      let l = 0;
      let r = array.length - 1;
      setLeft(l);
      setRight(r);
      setMid(null);
      setMessage(`Searching for Target: ${target} in a sorted array. O(log n)`);
      await new Promise(res => setTimeout(res, baseDelay));
      
      while (l <= r) {
        if (!isMounted) return;
        const m = Math.floor((l + r) / 2);
        setMid(m);
        setMessage(`Calculating Midpoint: (${l} + ${r}) / 2 = index ${m}`);
        await new Promise(res => setTimeout(res, baseDelay));
        if (!isMounted) return;
        
        if (array[m] === target) {
          setMessage(`Found ${target} at index ${m}!`);
          await new Promise(res => setTimeout(res, baseDelay * 3));
          if (isMounted) runAnimation();
          return;
        } else if (array[m] < target) {
          setMessage(`${array[m]} < ${target}. Target must be in the right half.`);
          await new Promise(res => setTimeout(res, baseDelay));
          l = m + 1;
          setLeft(l);
        } else {
          setMessage(`${array[m]} > ${target}. Target must be in the left half.`);
          await new Promise(res => setTimeout(res, baseDelay));
          r = m - 1;
          setRight(r);
        }
      }
      
      if (!isMounted) return;
      setMessage('Target not found.');
      await new Promise(res => setTimeout(res, baseDelay * 2));
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed, array, target]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-[#10b981] font-space text-lg mb-12 h-8 text-center bg-[#10b981]/10 px-4 py-2 rounded-full border border-[#10b981]/30">
        {message}
      </div>

      <div className="flex relative mt-8">
        <AnimatePresence>
          {array.map((val, idx) => {
            const isMid = mid === idx;
            const inRange = idx >= left && idx <= right;
            const isFound = isMid && val === target;
            
            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col items-center mx-1"
              >
                {/* Pointer Labels */}
                <div className="absolute -top-6 flex flex-col items-center">
                  {left === idx && <span className="text-xs font-space text-blue-400">L↓</span>}
                  {right === idx && <span className="text-xs font-space text-blue-400">R↓</span>}
                  {isMid && <span className="text-xs font-space text-[#10b981]">M↓</span>}
                </div>

                <motion.div 
                  className={`w-14 h-14 border-2 flex items-center justify-center rounded-md font-space text-xl transition-all duration-500
                    ${isFound ? 'border-[#f59e0b] bg-[#f59e0b] text-[#050d1a] shadow-[0_0_20px_#f59e0b] scale-110' : ''}
                    ${isMid && !isFound ? 'border-[#10b981] bg-[#10b981]/20 text-[#10b981] scale-105 shadow-[0_0_10px_#10b981]' : ''}
                    ${inRange && !isMid && !isFound ? 'border-gray-500 bg-[#050d1a] text-white' : ''}
                    ${!inRange ? 'border-gray-800 bg-gray-900/50 text-gray-700 opacity-30 scale-95' : ''}
                  `}
                >
                  {val}
                </motion.div>
                <div className="text-gray-500 font-mono text-xs mt-2">[{idx}]</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="mt-12 flex space-x-8 text-center text-gray-400 font-source">
        <div>Search Space: <span className="text-white font-mono">[{left}, {right}]</span></div>
        <div>Target: <span className="text-[#f59e0b] font-space font-bold text-xl">{target}</span></div>
      </div>
    </div>
  );
};

export default BinarySearchAnim;
