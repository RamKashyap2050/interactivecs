import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ArrayAnim = ({ isPlaying, speed }) => {
  const [array, setArray] = useState([]);
  const [phase, setPhase] = useState('init'); // init, push, pop, access, search, insert
  const [pointer, setPointer] = useState(null);
  const [message, setMessage] = useState('Initializing Array...');

  useEffect(() => {
    if (!isPlaying) {
      setArray([]);
      setPhase('init');
      setPointer(null);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1000 / speed;

    const runAnimation = async () => {
      // 1. Init
      if (!isMounted) return;
      setMessage('Contiguous memory allocated. Initializing elements...');
      setArray([]);
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, baseDelay * 0.5));
        if (!isMounted) return;
        setArray(prev => [...prev, Math.floor(Math.random() * 90) + 10]);
      }
      
      await new Promise(r => setTimeout(r, baseDelay * 1.5));
      if (!isMounted) return;

      // 2. Push
      setMessage('Pushing to end: O(1) mostly...');
      setPhase('push');
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      setArray(prev => [...prev, 99]);
      await new Promise(r => setTimeout(r, baseDelay * 1.5));
      if (!isMounted) return;

      // 3. Pop
      setMessage('Popping from end: O(1)');
      setPhase('pop');
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      setArray(prev => prev.slice(0, -1));
      await new Promise(r => setTimeout(r, baseDelay * 1.5));
      if (!isMounted) return;

      // 4. Access
      setMessage('Random Access: O(1). Direct addressing via index.');
      setPhase('access');
      setPointer(2); // access index 2
      await new Promise(r => setTimeout(r, baseDelay * 2));
      if (!isMounted) return;
      setPointer(null);

      // 5. Linear Search
      setMessage('Linear Search: O(n). Scanning sequentially...');
      setPhase('search');
      for (let i = 0; i < array.length; i++) {
        if (!isMounted) return;
        setPointer(i);
        await new Promise(r => setTimeout(r, baseDelay * 0.8));
      }
      setPointer(null);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      // 6. Insert at middle
      setMessage('Insert at index 2: O(n). Shifting elements to the right.');
      setPhase('insert');
      setPointer(2);
      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      
      // Shift animation logic is implicit in the array update, framer-motion layout handles it
      setArray(prev => {
        const newArr = [...prev];
        newArr.splice(2, 0, 42);
        return newArr;
      });

      await new Promise(r => setTimeout(r, baseDelay * 3));
      if (!isMounted) return;
      
      runAnimation(); // Loop
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-[#f59e0b] font-space text-lg mb-8 h-8 text-center bg-[#f59e0b]/10 px-4 py-2 rounded-full border border-[#f59e0b]/30">
        {message}
      </div>

      <div className="flex relative">
        <AnimatePresence mode="popLayout">
          {array.map((val, idx) => (
            <motion.div
              layout
              key={idx + '-' + val}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative flex flex-col items-center mx-1"
            >
              <div className="text-gray-500 font-mono text-xs mb-2">[{idx}]</div>
              <motion.div 
                className={`w-16 h-16 border-2 flex items-center justify-center rounded-md font-space text-xl
                  ${pointer === idx 
                    ? 'border-[#06b6d4] bg-[#06b6d4]/20 text-[#06b6d4] shadow-[0_0_15px_#06b6d4]' 
                    : 'border-[#f59e0b] bg-[#f59e0b]/10 text-white'
                  }
                `}
                animate={{
                  y: phase === 'insert' && pointer === idx ? -10 : 0
                }}
              >
                {val}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArrayAnim;
