import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TableVisualizer from '../../../components/TableVisualizer';

const JoinsVisualizer = ({ currentStep, isPlaying, speed }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    setInternalStep(0);
  }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 4) { // CROSS JOIN explosion
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 2500 / speed);
    } else {
      interval = setInterval(() => setInternalStep(prev => prev < 3 ? prev + 1 : prev), 1500 / speed);
    }
    return () => clearInterval(interval);
  }, [currentStep, speed]);

  const color = '#f59e0b';
  const highlightColor = '#39ff14'; // Green for match

  // Base Data
  const empCols = [{name: 'id', key: true}, {name: 'name'}, {name: 'dep_id', fk: true}];
  const depCols = [{name: 'id', key: true}, {name: 'dept_name'}];
  
  const employees = [
    {id: 1, name: 'Ram', dep_id: 1},
    {id: 2, name: 'Varsha', dep_id: 2},
    {id: 3, name: 'Praneel', dep_id: 1},
    {id: 4, name: 'Alice', dep_id: null},
    {id: 5, name: 'Bob', dep_id: 5}
  ];

  const departments = [
    {id: 1, dept_name: 'Engineering'},
    {id: 2, dept_name: 'Marketing'},
    {id: 3, dept_name: 'Finance'},
    {id: 4, dept_name: 'HR'}
  ];

  // Join logic helpers
  const getInnerJoin = () => {
    return employees.filter(e => departments.some(d => d.id === e.dep_id)).map(e => {
      const d = departments.find(d => d.id === e.dep_id);
      return {...e, dept_name: d.dept_name};
    });
  };

  const getLeftJoin = () => {
    return employees.map(e => {
      const d = departments.find(d => d.id === e.dep_id);
      return {...e, dept_name: d ? d.dept_name : null};
    });
  };

  const getRightJoin = () => {
    let res = [];
    departments.forEach(d => {
      const emps = employees.filter(e => e.dep_id === d.id);
      if (emps.length > 0) {
        emps.forEach(e => res.push({...e, dept_name: d.dept_name}));
      } else {
        res.push({id: null, name: null, dep_id: null, dept_name: d.dept_name});
      }
    });
    return res;
  };

  const getFullOuterJoin = () => {
    let res = getLeftJoin();
    departments.forEach(d => {
      if (!employees.some(e => e.dep_id === d.id)) {
        res.push({id: null, name: null, dep_id: null, dept_name: d.dept_name});
      }
    });
    return res;
  };

  // UI Helpers
  const renderQuery = (type) => {
    let query = `SELECT * FROM employees\n${type} JOIN departments ON employees.dep_id = departments.id`;
    if (type === 'CROSS') query = `SELECT * FROM employees\nCROSS JOIN departments`;
    if (type === 'SELF') query = `SELECT e.name, m.name as manager\nFROM employees e LEFT JOIN employees m\nON e.manager_id = m.id`;
    
    return (
      <div className="bg-[#0a1526] border border-gray-700 p-4 rounded-xl font-mono text-sm text-[#f59e0b] shadow-xl w-full max-w-2xl text-center whitespace-pre-wrap">
        {query}
      </div>
    );
  };

  const renderVennDiagram = (type) => {
    return (
      <div className="relative w-40 h-24 mx-auto my-4 flex items-center justify-center">
        <div className={`absolute left-4 w-16 h-16 rounded-full mix-blend-screen transition-colors duration-500 border border-[#3b82f6] ${
          ['LEFT', 'FULL'].includes(type) ? 'bg-[#3b82f6]/40' : 'bg-transparent'
        }`} />
        <div className={`absolute right-4 w-16 h-16 rounded-full mix-blend-screen transition-colors duration-500 border border-[#10b981] ${
          ['RIGHT', 'FULL'].includes(type) ? 'bg-[#10b981]/40' : 'bg-transparent'
        }`} />
        <div className={`absolute w-12 h-16 transition-colors duration-500 rounded-full ${
          ['INNER', 'LEFT', 'RIGHT', 'FULL'].includes(type) ? 'bg-[#39ff14]/60' : 'bg-transparent'
        }`} style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      </div>
    );
  };

  if (currentStep === 4) { // CROSS JOIN
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-8">
        {renderQuery('CROSS')}
        
        <div className="flex items-center gap-8 text-white font-space">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">5</div>
            <div className="text-gray-500 text-xs">Employees</div>
          </div>
          <div className="text-2xl text-[#f59e0b]">×</div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">4</div>
            <div className="text-gray-500 text-xs">Departments</div>
          </div>
          <div className="text-2xl text-[#f59e0b]">=</div>
          <div className="text-center">
            <motion.div 
              className="text-4xl font-bold mb-2 text-[#39ff14]"
              initial={{ scale: 1 }}
              animate={internalStep >= 1 ? { scale: [1, 1.2, 1] } : {}}
            >
              {internalStep >= 1 ? 20 : '?'}
            </motion.div>
            <div className="text-gray-500 text-xs">Result Rows</div>
          </div>
        </div>

        {internalStep >= 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 bg-[#ef4444]/20 border-2 border-[#ef4444] rounded-xl p-8 max-w-xl text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]"
          >
            <div className="text-[#ef4444] font-space font-bold text-2xl mb-4 uppercase tracking-widest animate-pulse">
              Danger Zone
            </div>
            <div className="font-mono text-gray-300">
              <span className="text-white">1M employees</span> × <span className="text-white">1M departments</span>
            </div>
            <div className="font-space text-4xl font-bold text-[#ef4444] mt-4">
              = 1 TRILLION ROWS
            </div>
            <div className="text-xs text-gray-400 mt-4 uppercase tracking-widest">
              Server Memory Exhausted
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (currentStep === 5) { // SELF JOIN
    const orgData = [
      {id: 1, name: 'Ram', manager_id: null},
      {id: 2, name: 'Varsha', manager_id: 1},
      {id: 3, name: 'Praneel', manager_id: 1},
      {id: 4, name: 'Alice', manager_id: 2}
    ];

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-8">
        {renderQuery('SELF')}
        
        <div className="flex gap-16 w-full max-w-5xl items-start relative">
           <div className="flex-1">
             <TableVisualizer 
               tableName="employees (AS e)"
               columns={[{name: 'id', key: true}, {name: 'name'}, {name: 'manager_id', fk: true}]}
               rows={orgData}
               highlightedCells={internalStep >= 1 ? [{rowIdx: 1, colIdx: 2, color: '#f59e0b'}, {rowIdx: 2, colIdx: 2, color: '#f59e0b'}, {rowIdx: 3, colIdx: 2, color: '#f59e0b'}] : []}
             />
           </div>

           {(internalStep >= 2) && (
             <svg className="absolute left-1/3 right-1/3 top-20 h-48 pointer-events-none z-10" style={{ width: '33%' }}>
               <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 65 L 100% 20" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
               <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 110 L 100% 20" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
               <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 155 L 100% 65" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
             </svg>
           )}

           <div className="flex-1 opacity-80">
             <TableVisualizer 
               tableName="employees (AS m)"
               columns={[{name: 'id', key: true}, {name: 'name'}]}
               rows={orgData.map(e => ({id: e.id, name: e.name}))}
               highlightedCells={internalStep >= 1 ? [{rowIdx: 0, colIdx: 0, color: '#f59e0b'}, {rowIdx: 1, colIdx: 0, color: '#f59e0b'}] : []}
             />
           </div>
        </div>

        <AnimatePresence>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mt-4">
              <TableVisualizer 
                tableName="Result"
                columns={[{name: 'employee'}, {name: 'manager'}]}
                rows={[
                  {employee: 'Ram', manager: null},
                  {employee: 'Varsha', manager: 'Ram'},
                  {employee: 'Praneel', manager: 'Ram'},
                  {employee: 'Alice', manager: 'Varsha'}
                ]}
                color="#39ff14"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // INNER, LEFT, RIGHT, FULL
  let joinType = 'INNER';
  if (currentStep === 1) joinType = 'LEFT';
  if (currentStep === 2) joinType = 'RIGHT';
  if (currentStep === 3) joinType = 'FULL';

  let resultData = [];
  if (joinType === 'INNER') resultData = getInnerJoin();
  if (joinType === 'LEFT') resultData = getLeftJoin();
  if (joinType === 'RIGHT') resultData = getRightJoin();
  if (joinType === 'FULL') resultData = getFullOuterJoin();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-8">
      {renderQuery(joinType)}
      
      {internalStep >= 0 && renderVennDiagram(joinType)}

      <div className="flex w-full max-w-6xl gap-8 relative">
        <div className="w-1/3">
          <TableVisualizer 
            tableName="employees"
            columns={empCols}
            rows={employees}
            dimmedRows={internalStep >= 1 && joinType === 'INNER' ? [3, 4] : internalStep >= 1 && joinType === 'RIGHT' ? [3, 4] : []}
            highlightedRows={internalStep >= 1 && ['LEFT', 'FULL'].includes(joinType) ? [3, 4] : []}
            color="#3b82f6"
          />
        </div>

        <div className="w-1/3 opacity-0 pointer-events-none">
           {/* Space for the result table later */}
        </div>

        <div className="w-1/3">
          <TableVisualizer 
            tableName="departments"
            columns={depCols}
            rows={departments}
            dimmedRows={internalStep >= 1 && joinType === 'INNER' ? [2, 3] : internalStep >= 1 && joinType === 'LEFT' ? [2, 3] : []}
            highlightedRows={internalStep >= 1 && ['RIGHT', 'FULL'].includes(joinType) ? [2, 3] : []}
            color="#10b981"
          />
        </div>

        {/* Dynamic connection lines */}
        {(internalStep >= 1) && (
          <svg className="absolute left-[33%] right-[33%] top-12 h-64 pointer-events-none z-10" style={{ width: '34%' }}>
            {/* Ram -> Engineering */}
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 20 L 100% 20" stroke={highlightColor} strokeWidth="2" fill="none" strokeDasharray="4 4" />
            {/* Varsha -> Marketing */}
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 65 L 100% 65" stroke={highlightColor} strokeWidth="2" fill="none" strokeDasharray="4 4" />
            {/* Praneel -> Engineering */}
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M 0 110 L 100% 20" stroke={highlightColor} strokeWidth="2" fill="none" strokeDasharray="4 4" />
          </svg>
        )}
      </div>

      <AnimatePresence>
        {internalStep >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            className="absolute bottom-24 w-[40%] shadow-2xl bg-[#020611] rounded-xl border-2 border-[#39ff14]/50 z-20"
          >
            <TableVisualizer 
              tableName={`${joinType} JOIN Result (${resultData.length} rows)`}
              columns={[...empCols, {name: 'dept_name'}]}
              rows={resultData}
              color="#39ff14"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JoinsVisualizer;
