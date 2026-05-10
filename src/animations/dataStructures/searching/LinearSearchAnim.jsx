import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LinearSearchAnim = ({ isPlaying, speed }) => {
  const [array, setArray] = useState([24, 13, 9, 64, 7, 23, 34, 47, 89, 12]);
  const [target, setTarget] = useState(47);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [message, setMessage] = useState('Initializing Linear Search...');

  useEffect(() => {
    if (!isPlaying) {
      setCurrentIndex(null);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1000 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      setCurrentIndex(null);
      setMessage(`Searching for Target: ${target}. Scanning sequentially. O(n)`);
      await new Promise(r => setTimeout(r, baseDelay));
      
      for (let i = 0; i < array.length; i++) {
        if (!isMounted) return;
        setCurrentIndex(i);
        
        if (array[i] === target) {
          setMessage(`Found ${target} at index ${i}!`);
          await new Promise(r => setTimeout(r, baseDelay * 3));
          if (!isMounted) return;
          runAnimation(); // restart
          return;
        } else {
          setMessage(`${array[i]} != ${target}. Continuing...`);
          await new Promise(r => setTimeout(r, baseDelay * 0.8));
        }
      }
      
      if (!isMounted) return;
      setMessage('Target not found.');
      await new Promise(r => setTimeout(r, baseDelay * 2));
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-[#10b981] font-space text-lg mb-12 h-8 text-center bg-[#10b981]/10 px-4 py-2 rounded-full border border-[#10b981]/30">
        {message}
      </div>

      <div className="flex relative">
        <AnimatePresence>
          {array.map((val, idx) => {
            const isActive = currentIndex === idx;
            const isTarget = isActive && val === target;
            const isPast = currentIndex !== null && idx < currentIndex;
            
            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col items-center mx-1"
              >
                <div className="text-gray-500 font-mono text-xs mb-2">[{idx}]</div>
                <motion.div 
                  className={`w-14 h-14 border-2 flex items-center justify-center rounded-md font-space text-xl transition-all duration-300
                    ${isActive && isTarget ? 'border-[#f59e0b] bg-[#f59e0b] text-[#050d1a] shadow-[0_0_20px_#f59e0b]' : ''}
                    ${isActive && !isTarget ? 'border-[#10b981] bg-[#10b981]/20 text-[#10b981] scale-110 shadow-[0_0_15px_#10b981]' : ''}
                    ${!isActive && !isPast && !isTarget ? 'border-gray-700 bg-gray-800/50 text-gray-400' : ''}
                    ${isPast && !isTarget ? 'border-red-500/50 bg-red-500/10 text-gray-500 opacity-50' : ''}
                  `}
                >
                  {val}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="mt-12 text-center text-gray-400 font-source">
        Target Value: <span className="text-[#f59e0b] font-space font-bold text-2xl">{target}</span>
      </div>
    </div>
  );
};

export default LinearSearchAnim;
