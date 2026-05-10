import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Tag, Clock, Database, AlertCircle, FileText, CheckCircle2, Zap } from 'lucide-react';
import TableVisualizer from '../../../components/TableVisualizer';

const TableBirthAnim = ({ currentStep, isPlaying, speed }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    setInternalStep(0);
  }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 1) { // Columns step - always plays on arrival
      interval = setInterval(() => {
        setInternalStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 1000 / speed);
    } else if (currentStep === 2) { // Primary Key step
      interval = setInterval(() => {
        setInternalStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 1500 / speed);
    } else if (currentStep === 3) { // Row Insertion
      interval = setInterval(() => {
        setInternalStep(prev => (prev < 2 ? prev + 1 : prev));
      }, 1500 / speed);
    } else if (currentStep === 4) { // Index Creation
      interval = setInterval(() => {
        setInternalStep(prev => (prev < 2 ? prev + 1 : prev));
      }, 2000 / speed);
    }
    return () => clearInterval(interval);
  }, [currentStep, speed]);

  // Step 1 Data
  const rawData = [
    "user_id: 12, name is Ram, ram@email",
    "Praneel ordered 5 items on tuesday",
    "email: varsha@mail.com, active: yes",
    "John Doe 555-0192",
    "order 99: $45.00"
  ];

  // Step 2 Data
  const columnsDef = [
    { name: 'id', type: 'INT', icon: Key, color: '#3b82f6', constraint: 'PRIMARY KEY' },
    { name: 'name', type: 'VARCHAR(100)', icon: Tag, color: '#f59e0b', constraint: 'NOT NULL' },
    { name: 'email', type: 'VARCHAR(255)', icon: Tag, color: '#f59e0b', constraint: 'UNIQUE' },
    { name: 'created_at', type: 'TIMESTAMP', icon: Clock, color: '#10b981', constraint: 'DEFAULT NOW()' },
    { name: 'is_active', type: 'BOOLEAN', icon: Zap, color: '#8b5cf6', constraint: 'DEFAULT true' }
  ];

  // Step 3 & 4 Data
  const baseTableColumns = [
    { key: 'id', name: 'id', type: 'INT', key: true },
    { key: 'name', name: 'name', type: 'VARCHAR' },
    { key: 'email', name: 'email', type: 'VARCHAR' },
    { key: 'created_at', name: 'created_at', type: 'TIMESTAMP' },
    { key: 'is_active', name: 'is_active', type: 'BOOLEAN' }
  ];

  const initialRows = [
    { id: 1, name: 'Alice', email: 'alice@mail.com', created_at: '2024-01-14', is_active: true },
    { id: 2, name: 'Bob', email: 'bob@mail.com', created_at: '2024-01-14', is_active: false }
  ];

  const rowToInsert = { id: 3, name: 'Ram', email: 'ram@email.com', created_at: '2024-01-15', is_active: true };

  return (
    <div className="w-full h-full relative font-source flex items-center justify-center p-8 bg-[#020611]">
      
      {/* Step 0: Raw Data Problem */}
      {currentStep === 0 && (
        <div className="relative w-full max-w-2xl h-96 border border-gray-800 bg-[#0a1526] rounded-xl overflow-hidden p-8">
          <div className="absolute top-4 left-4 text-[#ef4444] font-space font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5"/> Unstructured Data
          </div>
          <div className="mt-12 flex flex-col gap-4">
            {rawData.map((text, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: (Math.random() - 0.5) * 100, y: -50, rotate: (Math.random() - 0.5) * 20 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
                className="bg-gray-800/50 p-3 rounded font-mono text-sm text-gray-400 border border-gray-700"
              >
                {text}
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isPlaying ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] px-4 py-2 rounded flex items-center gap-2 font-mono text-sm"
          >
            &gt; SELECT * WHERE user = 'Ram'
            <span className="text-white">→ FAILED (No Schema)</span>
          </motion.div>
        </div>
      )}

      {/* Step 1: Defining Columns */}
      {currentStep === 1 && (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="flex gap-4 w-full overflow-x-auto pb-8">
            {columnsDef.map((col, i) => {
              const Icon = col.icon;
              return (
                <motion.div
                  key={col.name}
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={internalStep >= i ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: -20 }}
                  className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl p-6 relative flex flex-col items-center text-center shadow-xl"
                  style={{ borderColor: internalStep >= i ? col.color : '' }}
                >
                  <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: `${col.color}20`, border: `1px solid ${col.color}` }}>
                    <Icon className="w-6 h-6" style={{ color: col.color }} />
                  </div>
                  <h3 className="text-white font-space font-bold text-lg mb-1">{col.name}</h3>
                  <div className="text-xs font-mono text-gray-400 mb-4 bg-[#050d1a] px-2 py-1 rounded w-full">{col.type}</div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={internalStep >= i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.3 }}
                    className="mt-auto text-[10px] font-mono px-2 py-1 rounded bg-gray-800 text-white w-full border border-gray-700"
                  >
                    {col.constraint}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Primary Key */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl flex flex-col items-center">
          <TableVisualizer 
            tableName="users"
            columns={baseTableColumns}
            rows={initialRows}
            highlightedCells={internalStep >= 1 ? [{rowIdx: 0, colIdx: 0, color: '#3b82f6'}, {rowIdx: 1, colIdx: 0, color: '#3b82f6'}] : []}
            color="#f59e0b"
          />

          <div className="mt-8 flex gap-8 w-full max-w-2xl">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={internalStep >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
               className="flex-1 bg-[#0a1526] border border-[#3b82f6] p-4 rounded-xl flex flex-col items-center text-center"
             >
               <Key className="w-8 h-8 text-[#3b82f6] mb-2" />
               <div className="text-white font-space font-bold mb-1">Auto-Increment</div>
               <div className="text-xs text-gray-400">Database assigns next integer automatically.</div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={internalStep >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
               className="flex-1 bg-[#0a1526] border border-[#ef4444] p-4 rounded-xl flex flex-col items-center text-center"
             >
               <AlertCircle className="w-8 h-8 text-[#ef4444] mb-2" />
               <div className="text-white font-space font-bold mb-1">Uniqueness Guarantee</div>
               <div className="text-xs font-mono text-[#ef4444] bg-[#ef4444]/10 px-2 py-1 rounded mt-2">
                 INSERT id=1 → FAILED
               </div>
             </motion.div>
          </div>
        </div>
      )}

      {/* Step 3: Row Insertion */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl flex flex-col gap-8">
          <div className="bg-[#0a1526] border border-gray-700 p-4 rounded-lg font-mono text-sm text-[#f59e0b]">
            <motion.span>INSERT INTO users (name, email) </motion.span>
            <motion.span initial={{ opacity: 0 }} animate={internalStep >= 1 ? { opacity: 1 } : {}}>VALUES ('Ram', 'ram@email.com');</motion.span>
          </div>

          <TableVisualizer 
            tableName="users"
            columns={baseTableColumns}
            rows={internalStep >= 2 ? [...initialRows, rowToInsert] : initialRows}
            highlightedRows={internalStep >= 2 ? [2] : []}
            color="#f59e0b"
          />
        </div>
      )}

      {/* Step 4: Index Creation */}
      {currentStep === 4 && (
        <div className="w-full max-w-5xl flex gap-8 items-center justify-center">
          <div className="flex-1 flex flex-col gap-4">
            <TableVisualizer 
              tableName="users"
              columns={baseTableColumns}
              rows={[...initialRows, rowToInsert, { id: 4, name: 'Zoe', email: 'z@mail.com', created_at: '2024-01-16', is_active: true }]}
              highlightedRows={internalStep === 1 ? [0, 1, 2, 3] : internalStep === 2 ? [2] : []}
              color="#f59e0b"
            />
            
            <div className="bg-[#0a1526] border border-gray-700 p-3 rounded font-mono text-xs text-gray-300 text-center">
              SELECT * FROM users WHERE name = 'Ram';
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {internalStep === 1 ? (
                 <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-[#ef4444]">
                   <Database className="w-16 h-16 mb-4 animate-pulse" />
                   <div className="font-space font-bold text-xl mb-2">Full Table Scan</div>
                   <div className="text-sm font-mono bg-[#ef4444]/20 px-3 py-1 rounded">O(N) Complexity</div>
                   <div className="mt-4 text-xs text-gray-400 text-center">Checking every single row...</div>
                 </motion.div>
              ) : internalStep === 2 ? (
                 <motion.div key="index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                   <div className="font-space font-bold text-xl text-[#39ff14] mb-4">B-Tree Index (name)</div>
                   
                   {/* Simplified B-Tree Vis */}
                   <div className="flex flex-col items-center gap-4">
                     <div className="border border-[#39ff14] bg-[#39ff14]/10 text-white px-4 py-2 rounded-lg font-mono">M</div>
                     <div className="flex gap-16">
                       <div className="relative">
                         <svg className="absolute -top-4 left-1/2 w-16 h-4 -translate-x-[110%]"><line x1="100%" y1="0" x2="0" y2="100%" stroke="#39ff14" strokeWidth="2"/></svg>
                         <div className="border border-[#39ff14] bg-[#39ff14]/10 text-white px-4 py-2 rounded-lg font-mono">A-L</div>
                       </div>
                       <div className="relative">
                         <svg className="absolute -top-4 right-1/2 w-16 h-4 translate-x-[110%]"><line x1="0" y1="0" x2="100%" y2="100%" stroke="#39ff14" strokeWidth="2"/></svg>
                         <div className="border border-[#39ff14] bg-[#39ff14]/10 text-white px-4 py-2 rounded-lg font-mono shadow-[0_0_15px_rgba(57,255,20,0.5)] ring-2 ring-[#39ff14]">N-Z</div>
                       </div>
                     </div>
                     <div className="flex gap-4 ml-16">
                       <div className="border border-[#39ff14] bg-[#39ff14]/10 text-white px-2 py-1 rounded-lg font-mono text-xs">Praneel</div>
                       <div className="border border-[#39ff14] bg-[#39ff14]/10 text-white px-2 py-1 rounded-lg font-mono text-xs shadow-[0_0_15px_rgba(57,255,20,0.5)] ring-2 ring-[#39ff14]">Ram → row 3</div>
                       <div className="border border-[#39ff14] bg-[#39ff14]/10 text-white px-2 py-1 rounded-lg font-mono text-xs">Zoe</div>
                     </div>
                   </div>

                   <div className="mt-6 text-sm font-mono bg-[#39ff14]/20 text-[#39ff14] px-3 py-1 rounded">O(log N) Complexity</div>
                 </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      )}

    </div>
  );
};

export default TableBirthAnim;
