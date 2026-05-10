import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Zap, ServerCrash, ShieldCheck, Banknote, RefreshCcw, HardDrive } from 'lucide-react';

const ACIDScalingAnim = ({ currentStep, isPlaying, speed }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    setInternalStep(0);
  }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 0) { // Vertical scaling
      interval = setInterval(() => setInternalStep(prev => prev < 4 ? prev + 1 : prev), 2000 / speed);
    } else if (currentStep === 1) { // Atomicity
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 2500 / speed);
    } else if (currentStep === 2) { // Consistency
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 2500 / speed);
    } else if (currentStep === 3) { // Isolation
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 2500 / speed);
    } else if (currentStep === 4) { // Durability
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 2500 / speed);
    }
    return () => clearInterval(interval);
  }, [currentStep, speed]);

  const color = '#f59e0b';

  // Step 0: Vertical Scaling
  if (currentStep === 0) {
    const scales = [
      { cores: 4, ram: 16, cost: 200, label: 'Small' },
      { cores: 8, ram: 32, cost: 800, label: 'Medium' },
      { cores: 32, ram: 128, cost: 4500, label: 'Large' },
      { cores: 64, ram: 512, cost: 25000, label: 'X-Large' },
      { cores: 128, ram: 12288, cost: 100000, label: 'AWS Maximum (Ceiling)' },
    ];
    
    const scale = scales[internalStep];

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-8">
        <h2 className="text-3xl font-space font-bold text-white mb-4">Vertical Scaling</h2>
        
        <div className="relative flex flex-col items-center justify-end h-80 w-full max-w-xl border-b-2 border-gray-800 pb-4">
          <motion.div
            initial={{ width: 100, height: 100 }}
            animate={{ 
              width: 100 + (internalStep * 40), 
              height: 100 + (internalStep * 40) 
            }}
            transition={{ type: 'spring', damping: 20 }}
            className={`flex flex-col items-center justify-center border-2 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] ${internalStep === 4 ? 'bg-[#ef4444]/20 border-[#ef4444]' : 'bg-[#3b82f6]/20 border-[#3b82f6]'}`}
          >
            <Server className={`w-1/3 h-1/3 mb-2 ${internalStep === 4 ? 'text-[#ef4444]' : 'text-[#3b82f6]'}`} />
            <div className="font-mono text-white text-xs">{scale.label}</div>
          </motion.div>

          {internalStep === 4 && (
            <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="absolute top-0 w-full border-t-4 border-dashed border-[#ef4444] text-center pt-2">
               <span className="bg-[#ef4444] text-white font-space font-bold px-4 py-1 rounded text-sm uppercase">Physics Ceiling Reached</span>
            </motion.div>
          )}
        </div>

        <div className="flex gap-8 mt-4 font-mono w-full max-w-xl">
          <div className="flex-1 bg-[#0a1526] border border-gray-800 p-4 rounded-xl text-center">
             <div className="text-gray-500 text-xs mb-1">Cores</div>
             <div className="text-[#3b82f6] text-2xl font-bold">{scale.cores}</div>
          </div>
          <div className="flex-1 bg-[#0a1526] border border-gray-800 p-4 rounded-xl text-center">
             <div className="text-gray-500 text-xs mb-1">RAM (GB)</div>
             <div className="text-[#10b981] text-2xl font-bold">{scale.ram}</div>
          </div>
          <div className="flex-1 bg-[#0a1526] border border-[#ef4444]/50 p-4 rounded-xl text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
             <div className="text-gray-500 text-xs mb-1">Cost / Month</div>
             <div className="text-[#ef4444] text-2xl font-bold">${scale.cost.toLocaleString()}</div>
          </div>
        </div>

        {internalStep === 4 && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-4 text-[#f59e0b] font-space font-bold border border-[#f59e0b]/50 bg-[#f59e0b]/10 px-6 py-3 rounded-lg">
            Next Stop: Horizontal Scaling (NoSQL Territory) →
          </motion.div>
        )}
      </div>
    );
  }

  // ACID Shared Bank State layout
  const BankAccount = ({ name, balance, action, status, isError }) => (
    <div className={`flex flex-col items-center bg-[#0a1526] border p-6 rounded-2xl w-64 ${isError ? 'border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-gray-800'}`}>
      <Banknote className={`w-12 h-12 mb-4 ${isError ? 'text-[#ef4444]' : 'text-[#39ff14]'}`}/>
      <h3 className="font-space font-bold text-white text-xl mb-1">{name}</h3>
      <div className={`font-mono text-3xl font-bold mb-4 ${balance < 0 ? 'text-[#ef4444]' : 'text-white'}`}>
        ${balance}
      </div>
      <div className="h-16 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {action && (
            <motion.div 
              key={action}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`font-mono text-sm px-3 py-1.5 rounded-lg w-full text-center ${status === 'fail' ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/50' : status === 'wait' ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/50' : 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50'}`}
            >
              {action}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-8 relative">
      <div className="absolute top-8 left-8 text-2xl font-space font-bold uppercase tracking-widest text-gray-700 flex items-center gap-2">
        <ShieldCheck className="w-8 h-8"/> ACID Transactions
      </div>

      {currentStep === 1 && ( // Atomicity
        <div className="flex flex-col items-center gap-12">
          <div className="flex gap-16 relative">
             <BankAccount 
               name="Account A" 
               balance={internalStep >= 1 && internalStep < 2 ? 500 : 1000} 
               action={internalStep === 0 ? "Transfer $500 → B" : internalStep === 1 ? "-$500 (Success)" : "ROLLBACK"}
               status={internalStep === 2 ? 'fail' : 'success'}
             />
             
             {internalStep >= 1 && internalStep < 2 && (
               <motion.div initial={{opacity:0, scale:0}} animate={{opacity:1, scale:1}} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#ef4444] rounded-full p-2">
                 <ServerCrash className="w-8 h-8 text-white"/>
               </motion.div>
             )}

             <BankAccount 
               name="Account B" 
               balance={0} 
               action={internalStep === 1 ? "+$500 (FAILED)" : internalStep === 2 ? "ROLLBACK" : ""}
               status={internalStep >= 1 ? 'fail' : ''}
               isError={internalStep === 1}
             />
          </div>

          <AnimatePresence>
            {internalStep === 2 && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[#f59e0b]/10 border border-[#f59e0b] text-[#f59e0b] px-6 py-3 rounded-lg flex items-center gap-3 font-mono">
                <RefreshCcw className="w-5 h-5"/> ALL-OR-NOTHING: Money cannot vanish. State restored.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {currentStep === 2 && ( // Consistency
        <div className="flex flex-col items-center gap-12">
          <div className="bg-[#0a1526] border border-gray-700 px-6 py-3 rounded-xl font-mono text-white text-sm text-center shadow-lg">
            Constraint: <span className="text-[#f59e0b]">CHECK (balance &gt;= 0)</span>
          </div>

          <BankAccount 
            name="Checking" 
            balance={internalStep === 1 ? -500 : 500} 
            action={internalStep === 1 ? "-$1000 (Overdraft)" : internalStep === 2 ? "REJECTED" : "Current Balance"}
            status={internalStep === 1 ? 'wait' : internalStep === 2 ? 'fail' : 'success'}
            isError={internalStep === 1}
          />

          <AnimatePresence>
            {internalStep === 2 && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[#39ff14]/10 border border-[#39ff14] text-[#39ff14] px-6 py-3 rounded-lg flex items-center gap-3 font-mono">
                <ShieldCheck className="w-5 h-5"/> CONSISTENCY: Invalid states are physically impossible.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {currentStep === 3 && ( // Isolation
        <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
          <div className="text-center bg-[#0a1526] border border-gray-800 p-6 rounded-2xl w-64 mb-4 relative z-10">
             <div className="text-gray-500 font-mono text-xs mb-2">Account A Balance</div>
             <div className="text-white text-4xl font-mono font-bold">$1000</div>
          </div>

          <div className="flex justify-between w-full relative">
            <svg className="absolute top-[-60px] left-0 w-full h-24 pointer-events-none z-0">
               <path d="M 50% 0 L 20% 100%" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4 4" />
               <path d="M 50% 0 L 80% 100%" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            </svg>

            <div className="w-[40%] bg-[#0a1526] border border-[#3b82f6] rounded-xl p-6 shadow-xl">
              <h4 className="text-[#3b82f6] font-space font-bold mb-4">Transaction 1</h4>
              <div className="font-mono text-sm space-y-2 text-gray-300">
                <div className="bg-gray-800/50 p-2 rounded">READ balance ($1000)</div>
                {internalStep >= 1 && <div className="bg-gray-800/50 p-2 rounded">balance = balance - 500</div>}
                {internalStep >= 2 && <div className="bg-[#39ff14]/20 text-[#39ff14] p-2 rounded border border-[#39ff14]/30">COMMIT ($500)</div>}
              </div>
            </div>

            <div className="w-[40%] bg-[#0a1526] border border-[#f59e0b] rounded-xl p-6 shadow-xl">
              <h4 className="text-[#f59e0b] font-space font-bold mb-4">Transaction 2</h4>
              <div className="font-mono text-sm space-y-2 text-gray-300">
                <div className="bg-gray-800/50 p-2 rounded">READ balance ($1000)</div>
                {internalStep >= 1 && (
                  <div className="bg-gray-800/50 p-2 rounded">
                    balance = balance - 300
                    <div className="text-xs text-[#ef4444] mt-1">Dirty read risk!</div>
                  </div>
                )}
                {internalStep >= 2 && <div className="bg-[#f59e0b]/20 text-[#f59e0b] p-2 rounded border border-[#f59e0b]/30 flex items-center justify-between">WAITING FOR T1... <Clock className="w-4 h-4"/></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && ( // Durability
        <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
          <div className="flex gap-16 items-center">
            <BankAccount 
              name="Database Memory" 
              balance={internalStep >= 2 ? 500 : 1000} 
              action={internalStep === 0 ? "Commit Success" : internalStep === 1 ? "POWER LOSS" : "RECOVERED"}
              status={internalStep === 0 ? 'success' : internalStep === 1 ? 'fail' : 'success'}
              isError={internalStep === 1}
            />

            <div className="flex flex-col items-center gap-2">
              <motion.div 
                animate={internalStep === 0 ? {x: [0, 20, 0]} : {}} 
                transition={{repeat: Infinity, duration: 1}}
              >
                <Zap className="w-8 h-8 text-[#f59e0b]" />
              </motion.div>
            </div>

            <div className="bg-[#0a1526] border-2 border-[#10b981] p-6 rounded-2xl w-64 flex flex-col items-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
               <HardDrive className="w-12 h-12 text-[#10b981] mb-4"/>
               <h3 className="font-space font-bold text-white text-xl mb-1">WAL</h3>
               <div className="text-gray-500 text-xs font-mono mb-4 text-center">Write-Ahead Log<br/>(Disk Storage)</div>
               <div className="bg-gray-900 w-full p-2 rounded font-mono text-[10px] text-[#10b981] overflow-hidden">
                 {internalStep >= 0 && <div>01: BEGIN TX</div>}
                 {internalStep >= 0 && <div>02: UPDATE BAL=500</div>}
                 {internalStep >= 0 && <div>03: COMMIT</div>}
               </div>
            </div>
          </div>

          <AnimatePresence>
            {internalStep >= 2 && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[#10b981]/10 border border-[#10b981] text-[#10b981] px-6 py-3 rounded-lg flex items-center gap-3 font-mono">
                <ShieldCheck className="w-5 h-5"/> DURABILITY: Committed data survives hardware failure.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};

// Simple Clock icon component since it wasn't imported properly
const Clock = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default ACIDScalingAnim;
