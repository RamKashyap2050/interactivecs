import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Scissors } from 'lucide-react';
import TableVisualizer from '../../../components/TableVisualizer';

const NormalizationAnim = ({ currentStep, isPlaying, speed }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    setInternalStep(0);
  }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 1) { // Anomalies
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 2500 / speed);
    } else if (currentStep === 3) { // 2NF Split
      interval = setInterval(() => setInternalStep(prev => prev < 1 ? prev + 1 : prev), 2000 / speed);
    } else if (currentStep === 4) { // 3NF Split
      interval = setInterval(() => setInternalStep(prev => prev < 1 ? prev + 1 : prev), 2000 / speed);
    }
    return () => clearInterval(interval);
  }, [currentStep, speed]);

  const color = '#f59e0b';

  const rawTableCols = [
    {name: 'order_id', key: true}, {name: 'cust_name'}, {name: 'cust_email'},
    {name: 'product_name'}, {name: 'product_price'}, {name: 'order_date'}
  ];
  
  const rawData = [
    {order_id: 1, cust_name: 'Ram', cust_email: 'r@mail.com', product_name: 'Laptop', product_price: 999.00, order_date: '2024-01-15'},
    {order_id: 2, cust_name: 'Ram', cust_email: 'r@mail.com', product_name: 'Mouse', product_price: 29.00, order_date: '2024-01-15'},
    {order_id: 3, cust_name: 'Varsha', cust_email: 'v@mail.com', product_name: 'Laptop', product_price: 999.00, order_date: '2024-01-16'}
  ];

  return (
    <div className="w-full h-full relative font-source flex flex-col items-center justify-center p-8 bg-[#020611]">
      
      {/* Step 0 & 1: Denormalized & Anomalies */}
      {(currentStep <= 1) && (
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 relative">
          <AnimatePresence mode="wait">
            {currentStep === 1 && internalStep === 1 && (
              <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} className="bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] px-4 py-2 rounded flex items-center gap-2 font-mono">
                <AlertTriangle className="w-5 h-5"/> UPDATE ANOMALY: Forgot to update second email!
              </motion.div>
            )}
            {currentStep === 1 && internalStep === 2 && (
              <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} className="bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] px-4 py-2 rounded flex items-center gap-2 font-mono">
                <AlertTriangle className="w-5 h-5"/> DELETE ANOMALY: Deleted order, lost customer Varsha!
              </motion.div>
            )}
          </AnimatePresence>

          <TableVisualizer 
            tableName="sales_data (Denormalized)"
            columns={rawTableCols}
            rows={
              currentStep === 1 && internalStep === 1 ? [
                {...rawData[0], cust_email: 'ram.new@mail.com'}, // Updated one
                rawData[1], // Forgot this one
                rawData[2]
              ] : 
              currentStep === 1 && internalStep === 2 ? [
                rawData[0], rawData[1] // Varsha deleted
              ] : rawData
            }
            highlightedCells={
              currentStep === 1 && internalStep === 1 ? [{rowIdx: 0, colIdx: 2, color: '#ef4444'}, {rowIdx: 1, colIdx: 2, color: '#ef4444'}] :
              []
            }
            dimmedRows={currentStep === 1 && internalStep === 2 ? [] : []} // the row is actually gone
            color="#ef4444"
          />
        </div>
      )}

      {/* Step 2: 1NF */}
      {currentStep === 2 && (
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-[#39ff14] mb-4" />
          <h2 className="text-3xl font-space font-bold text-white mb-2">First Normal Form (1NF)</h2>
          <p className="text-gray-400 font-mono text-lg max-w-2xl">
            Each cell holds a single, atomic value. No arrays. No comma-separated lists.<br/><br/>
            <span className="text-[#f59e0b]">Status: Already in 1NF. But anomalies remain!</span>
          </p>
          <TableVisualizer 
            tableName="sales_data (1NF)"
            columns={rawTableCols}
            rows={rawData}
            color="#39ff14"
          />
        </div>
      )}

      {/* Step 3: 2NF */}
      {currentStep === 3 && (
        <div className="w-full max-w-6xl flex flex-col items-center gap-12">
          {internalStep === 0 ? (
            <div className="relative">
              <TableVisualizer 
                tableName="sales_data (1NF)"
                columns={rawTableCols}
                rows={rawData}
                highlightedCells={[
                  {rowIdx: 0, colIdx: 3, color: '#f59e0b'}, {rowIdx: 0, colIdx: 4, color: '#f59e0b'},
                  {rowIdx: 1, colIdx: 3, color: '#f59e0b'}, {rowIdx: 1, colIdx: 4, color: '#f59e0b'},
                  {rowIdx: 2, colIdx: 3, color: '#f59e0b'}, {rowIdx: 2, colIdx: 4, color: '#f59e0b'}
                ]}
                color="#f59e0b"
              />
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020611] p-4 rounded-full border-2 border-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.5)] z-20">
                <Scissors className="w-8 h-8 text-[#ef4444]" />
              </motion.div>
            </div>
          ) : (
            <div className="flex gap-16 w-full items-start justify-center relative">
              <div className="flex-1">
                <TableVisualizer 
                  tableName="orders (2NF)"
                  columns={[{name: 'id', key: true}, {name: 'cust_name'}, {name: 'cust_email'}, {name: 'product_id', fk: true}, {name: 'order_date'}]}
                  rows={[
                    {id: 1, cust_name: 'Ram', cust_email: 'r@mail.com', product_id: 101, order_date: '2024-01-15'},
                    {id: 2, cust_name: 'Ram', cust_email: 'r@mail.com', product_id: 102, order_date: '2024-01-15'},
                    {id: 3, cust_name: 'Varsha', cust_email: 'v@mail.com', product_id: 101, order_date: '2024-01-16'}
                  ]}
                  color="#3b82f6"
                />
              </div>

              {/* Connecting line */}
              <svg className="absolute left-1/2 top-20 -translate-x-1/2 w-32 h-16 pointer-events-none z-10">
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 0 L 128 0" stroke="#39ff14" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              </svg>

              <div className="w-1/3">
                <TableVisualizer 
                  tableName="products (2NF)"
                  columns={[{name: 'id', key: true}, {name: 'name'}, {name: 'price'}]}
                  rows={[
                    {id: 101, name: 'Laptop', price: 999.00},
                    {id: 102, name: 'Mouse', price: 29.00}
                  ]}
                  color="#39ff14"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: 3NF */}
      {currentStep === 4 && (
        <div className="w-full max-w-6xl flex flex-col items-center gap-12">
          {internalStep === 0 ? (
            <div className="relative">
              <TableVisualizer 
                tableName="orders (2NF)"
                columns={[{name: 'id', key: true}, {name: 'cust_name'}, {name: 'cust_email'}, {name: 'product_id', fk: true}, {name: 'order_date'}]}
                rows={[
                  {id: 1, cust_name: 'Ram', cust_email: 'r@mail.com', product_id: 101, order_date: '2024-01-15'},
                  {id: 2, cust_name: 'Ram', cust_email: 'r@mail.com', product_id: 102, order_date: '2024-01-15'},
                  {id: 3, cust_name: 'Varsha', cust_email: 'v@mail.com', product_id: 101, order_date: '2024-01-16'}
                ]}
                highlightedCells={[
                  {rowIdx: 0, colIdx: 1, color: '#f59e0b'}, {rowIdx: 0, colIdx: 2, color: '#f59e0b'},
                  {rowIdx: 1, colIdx: 1, color: '#f59e0b'}, {rowIdx: 1, colIdx: 2, color: '#f59e0b'},
                  {rowIdx: 2, colIdx: 1, color: '#f59e0b'}, {rowIdx: 2, colIdx: 2, color: '#f59e0b'}
                ]}
                color="#3b82f6"
              />
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 bg-[#020611] p-4 rounded-full border-2 border-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.5)] z-20">
                <Scissors className="w-8 h-8 text-[#ef4444]" />
              </motion.div>
            </div>
          ) : (
            <div className="flex gap-8 w-full items-start justify-center relative">
              <div className="w-[30%]">
                <TableVisualizer 
                  tableName="customers (3NF)"
                  columns={[{name: 'id', key: true}, {name: 'name'}, {name: 'email'}]}
                  rows={[
                    {id: 501, name: 'Ram', email: 'r@mail.com'},
                    {id: 502, name: 'Varsha', email: 'v@mail.com'}
                  ]}
                  color="#f59e0b"
                />
              </div>

              {/* Connecting line */}
              <svg className="absolute left-[30%] top-20 w-16 h-16 pointer-events-none z-10">
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 0 L 64 0" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              </svg>

              <div className="w-[35%]">
                <TableVisualizer 
                  tableName="orders (3NF)"
                  columns={[{name: 'id', key: true}, {name: 'cust_id', fk: true}, {name: 'product_id', fk: true}, {name: 'order_date'}]}
                  rows={[
                    {id: 1, cust_id: 501, product_id: 101, order_date: '2024-01-15'},
                    {id: 2, cust_id: 501, product_id: 102, order_date: '2024-01-15'},
                    {id: 3, cust_id: 502, product_id: 101, order_date: '2024-01-16'}
                  ]}
                  color="#3b82f6"
                />
              </div>

              <svg className="absolute right-[30%] top-20 w-16 h-16 pointer-events-none z-10">
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 0 L 64 0" stroke="#39ff14" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              </svg>

              <div className="w-[25%]">
                <TableVisualizer 
                  tableName="products (3NF)"
                  columns={[{name: 'id', key: true}, {name: 'name'}, {name: 'price'}]}
                  rows={[
                    {id: 101, name: 'Laptop', price: 999.00},
                    {id: 102, name: 'Mouse', price: 29.00}
                  ]}
                  color="#39ff14"
                />
              </div>
            </div>
          )}
          
          {internalStep === 1 && (
             <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-[#39ff14]/10 border border-[#39ff14] text-[#39ff14] px-6 py-3 rounded-lg flex items-center gap-3 font-mono font-bold">
               <CheckCircle2 className="w-6 h-6"/> 3NF ACHIEVED: No duplication. No anomalies. Pure structure.
             </motion.div>
          )}
        </div>
      )}

    </div>
  );
};

export default NormalizationAnim;
