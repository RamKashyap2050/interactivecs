import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QueueAnim = ({ isPlaying, speed }) => {
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState('Initializing Queue (FIFO)...');
  const [opLabel, setOpLabel] = useState('');
  const [isCircular, setIsCircular] = useState(false);
  const [frontPtr, setFrontPtr] = useState(0);
  const [rearPtr, setRearPtr] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setQueue([]);
      setMessage('Paused');
      setOpLabel('');
      setIsCircular(false);
      return;
    }

    let isMounted = true;
    const baseDelay = 1200 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      setIsCircular(false);
      setQueue([]);
      setMessage('A standard Queue operates on First-In-First-Out (FIFO).');
      
      // Enqueue 4 items
      for (let i = 1; i <= 4; i++) {
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;
        setOpLabel('ENQUEUE');
        setQueue(prev => [...prev, { id: i, val: `Job ${i}` }]);
        setMessage(`Enqueued Job ${i}. Entering from the rear.`);
        await new Promise(r => setTimeout(r, 600 / speed));
        setOpLabel('');
      }

      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;

      // Dequeue 3 items
      for (let i = 1; i <= 3; i++) {
        setOpLabel('DEQUEUE');
        setMessage(`Dequeuing Job ${i}. Exiting from the front.`);
        setQueue(prev => prev.slice(1));
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;
        setOpLabel('');
      }

      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      
      // Morph to circular queue
      setIsCircular(true);
      setMessage('Morphing into a Circular Queue (Ring Buffer)...');
      setQueue([
        { id: 'c1', val: '1' }, { id: 'c2', val: '2' }, 
        { id: 'c3', val: '3' }, { id: 'c4', val: '4' }, 
        { id: 'c5', val: '5' }
      ]);
      setFrontPtr(0);
      setRearPtr(0);

      await new Promise(r => setTimeout(r, baseDelay * 2));
      
      // Circular queue animation
      for (let i = 0; i < 8; i++) {
        if (!isMounted) return;
        if (i % 2 === 0) {
          setMessage('Enqueue: Rear pointer moves forward, wrapping around.');
          setRearPtr(prev => (prev + 1) % 5);
        } else {
          setMessage('Dequeue: Front pointer follows, freeing up space.');
          setFrontPtr(prev => (prev + 1) % 5);
        }
        await new Promise(r => setTimeout(r, baseDelay));
      }

      await new Promise(r => setTimeout(r, baseDelay));
      if (!isMounted) return;
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-[#f59e0b] font-space text-lg mb-12 h-8 text-center bg-[#f59e0b]/10 px-4 py-2 rounded-full border border-[#f59e0b]/30">
        {message}
      </div>

      {!isCircular ? (
        <div className="relative w-full max-w-lg h-32 border-y-4 border-gray-700 flex items-center justify-start overflow-hidden px-4">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050d1a] to-transparent z-20"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050d1a] to-transparent z-20"></div>
          
          <div className="absolute left-2 top-2 text-xs font-space text-gray-500">FRONT (Dequeue) ←</div>
          <div className="absolute right-2 top-2 text-xs font-space text-gray-500">← REAR (Enqueue)</div>

          <div className="flex space-x-4 w-full justify-start items-center">
            <AnimatePresence mode="popLayout">
              {queue.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="min-w-[100px] h-16 bg-[#f59e0b] rounded-md flex items-center justify-center text-[#050d1a] font-space font-bold shadow-lg"
                >
                  {item.val}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="relative w-64 h-64 border-4 border-gray-700 rounded-full flex items-center justify-center">
          {queue.map((item, idx) => {
            const angle = (idx / 5) * 2 * Math.PI - Math.PI / 2;
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const isFront = idx === frontPtr;
            const isRear = idx === rearPtr;
            const isActive = (idx >= frontPtr && idx < rearPtr) || (rearPtr < frontPtr && (idx >= frontPtr || idx < rearPtr));

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-space font-bold transition-colors duration-300
                  ${isActive ? 'bg-[#f59e0b] text-[#050d1a]' : 'bg-gray-800 text-gray-500'}
                  ${isFront ? 'border-2 border-[var(--color-electric-cyan)] shadow-[0_0_10px_var(--color-electric-cyan)]' : ''}
                  ${isRear ? 'border-2 border-[var(--color-phosphor-green)] shadow-[0_0_10px_var(--color-phosphor-green)]' : ''}
                `}
                style={{ x, y }}
              >
                {item.val}
                {isFront && <div className="absolute -top-6 text-[10px] text-[var(--color-electric-cyan)]">Front</div>}
                {isRear && <div className="absolute -bottom-6 text-[10px] text-[var(--color-phosphor-green)]">Rear</div>}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Operation Label Bubble */}
      <AnimatePresence>
        {opLabel && !isCircular && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 font-space font-bold text-2xl text-[var(--color-electric-cyan)]"
          >
            {opLabel}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QueueAnim;
