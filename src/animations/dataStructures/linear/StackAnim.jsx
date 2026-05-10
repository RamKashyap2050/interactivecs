import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StackAnim = ({ isPlaying, speed }) => {
  const [stack, setStack] = useState([]);
  const [message, setMessage] = useState('Initializing Stack (LIFO)...');
  const [opLabel, setOpLabel] = useState(''); // PUSH, POP

  useEffect(() => {
    if (!isPlaying) {
      setStack([]);
      setMessage('Paused');
      setOpLabel('');
      return;
    }

    let isMounted = true;
    const baseDelay = 1200 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      setStack([]);
      setMessage('A stack operates on Last-In-First-Out (LIFO).');
      
      // Push 4 items
      for (let i = 1; i <= 4; i++) {
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;
        setOpLabel('PUSH');
        setStack(prev => [...prev, { id: i, val: `Call ${i}` }]);
        setMessage(`Pushed Call ${i} onto the stack. O(1)`);
        await new Promise(r => setTimeout(r, 500 / speed));
        setOpLabel('');
      }

      await new Promise(r => setTimeout(r, baseDelay * 1.5));
      if (!isMounted) return;

      // Pop 4 items
      for (let i = 4; i >= 1; i--) {
        setOpLabel('POP');
        setMessage(`Popping Call ${i}. LIFO means newest comes off first. O(1)`);
        setStack(prev => prev.slice(0, -1));
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;
        setOpLabel('');
      }

      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      runAnimation(); // loop
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-[#f59e0b] font-space text-lg mb-12 h-8 text-center bg-[#f59e0b]/10 px-4 py-2 rounded-full border border-[#f59e0b]/30">
        {message}
      </div>

      <div className="relative w-48 h-64 border-x-4 border-b-4 border-gray-700 rounded-b-xl flex flex-col-reverse items-center justify-start pb-2">
        <AnimatePresence>
          {stack.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-40 h-12 mb-2 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded flex items-center justify-center shadow-[0_0_15px_#f59e0b40] text-[#050d1a] font-space font-bold z-10"
            >
              {item.val}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Operation Label Bubble */}
        <AnimatePresence>
          {opLabel && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0 }}
              animate={{ opacity: 1, x: 80, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-10 right-0 font-space font-bold text-2xl text-[var(--color-electric-cyan)]"
            >
              {opLabel}!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 text-gray-500 font-source text-sm">
        Call Stack Memory Metaphor
      </div>
    </div>
  );
};

export default StackAnim;
