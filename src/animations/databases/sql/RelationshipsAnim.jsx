import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Database, Trash2, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import TableVisualizer from '../../../components/TableVisualizer';

const RelationshipsAnim = ({ currentStep, isPlaying, speed }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    setInternalStep(0);
  }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 1) {
      interval = setInterval(() => setInternalStep(prev => prev < 3 ? prev + 1 : prev), 1500 / speed);
    } else if (currentStep === 2) {
      interval = setInterval(() => setInternalStep(prev => prev < 1 ? prev + 1 : prev), 2500 / speed);
    } else if (currentStep === 3) {
      interval = setInterval(() => setInternalStep(prev => prev < 3 ? prev + 1 : prev), 1000 / speed);
    } else if (currentStep === 4) {
      interval = setInterval(() => setInternalStep(prev => prev < 3 ? prev + 1 : prev), 1500 / speed);
    } else if (currentStep === 5) {
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 1500 / speed);
    } else if (currentStep === 6) {
      interval = setInterval(() => setInternalStep(prev => prev < 1 ? prev + 1 : prev), 2000 / speed);
    } else if (currentStep === 7) {
      interval = setInterval(() => setInternalStep(prev => prev < 1 ? prev + 1 : prev), 2000 / speed);
    } else if (currentStep === 8) {
      interval = setInterval(() => setInternalStep(prev => prev < 2 ? prev + 1 : prev), 1500 / speed);
    } else if (currentStep === 9) {
      interval = setInterval(() => setInternalStep(prev => prev < 1 ? prev + 1 : prev), 1500 / speed);
    }
    return () => clearInterval(interval);
  }, [currentStep, speed]);

  const color = '#f59e0b';

  return (
    <div className="w-full h-full relative font-source flex items-center justify-center p-8 bg-[#020611]">
      
      {/* 1:1 Relationship */}
      {(currentStep >= 0 && currentStep <= 2) && (
        <div className="w-full max-w-5xl flex flex-col gap-12">
          {currentStep === 2 && internalStep === 0 ? (
            <div className="flex flex-col items-center">
              <div className="bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] px-4 py-2 rounded mb-4 font-mono">
                BAD: Denormalized Wide Table (I/O Waste)
              </div>
              <TableVisualizer
                tableName="users_with_profiles"
                columns={[
                  { name: 'id', key: true }, { name: 'name' }, { name: 'email' },
                  { name: 'bio' }, { name: 'avatar_url' }, { name: 'twitter_handle' },
                  { name: '...' }
                ]}
                rows={[
                  { id: 1, name: 'Ram', email: 'ram@', bio: 'Dev', avatar_url: '/r.png', twitter_handle: '@ram', '...': '...' },
                  { id: 2, name: 'Varsha', email: 'varsha@', bio: 'Des', avatar_url: '/v.png', twitter_handle: '@var', '...': '...' }
                ]}
                highlightedCells={[{rowIdx: 0, colIdx: 3, color: '#ef4444'}, {rowIdx: 0, colIdx: 4, color: '#ef4444'}, {rowIdx: 0, colIdx: 5, color: '#ef4444'}]}
                color={color}
              />
            </div>
          ) : (
            <div className="flex items-start justify-center gap-16 relative">
              <div className="flex flex-col gap-4">
                <TableVisualizer 
                  tableName="users (Parent)"
                  columns={[{name: 'id', key: true}, {name: 'name'}, {name: 'email'}]}
                  rows={[ {id: 1, name: 'Ram', email: 'ram@'}, {id: 2, name: 'Varsha', email: 'varsha@'} ]}
                  highlightedCells={(currentStep === 0 || currentStep === 1) ? [{rowIdx: 0, colIdx: 0, color: '#3b82f6'}] : []}
                  color={color}
                />
              </div>

              {/* Connecting line placeholder (absolute positioning simplified for react code) */}
              {(currentStep === 0 || (currentStep === 1 && internalStep >= 3) || (currentStep === 2 && internalStep === 1)) && (
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 pointer-events-none" style={{ zIndex: 10 }}>
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    d="M 0 30 L 128 30"
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeDasharray="4 4"
                  />
                  <rect x="54" y="20" width="20" height="20" fill="#0a1526" rx="4" />
                  <Link x="56" y="22" width="16" height="16" stroke="#3b82f6" />
                </svg>
              )}

              <div className="flex flex-col gap-4 relative">
                <TableVisualizer 
                  tableName="profiles (Child)"
                  columns={[{name: 'id', key: true}, {name: 'user_id', fk: true}, {name: 'bio'}]}
                  rows={
                    currentStep === 1 && internalStep === 0 ? [{id: 101, user_id: 999, bio: 'Dev'}] :
                    currentStep === 1 && internalStep === 1 ? [{id: 101, user_id: 999, bio: 'Dev'}] :
                    currentStep === 1 && internalStep >= 2 ? [{id: 101, user_id: 1, bio: 'Dev'}] :
                    [{id: 101, user_id: 1, bio: 'Dev'}]
                  }
                  highlightedCells={(currentStep === 0 || currentStep === 1) ? [{rowIdx: 0, colIdx: 1, color: '#3b82f6'}] : []}
                  color={color}
                  className={currentStep === 1 && internalStep === 1 ? "ring-2 ring-[#ef4444] animate-pulse" : ""}
                />
                
                {currentStep === 1 && internalStep === 1 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-12 left-0 right-0 bg-[#ef4444] text-white text-xs font-mono p-2 rounded text-center">
                    FOREIGN KEY CONSTRAINT FAILED (user_id=999)
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1:N Relationship */}
      {(currentStep >= 3 && currentStep <= 5) && (
        <div className="w-full max-w-5xl flex items-start justify-center gap-16 relative">
          
          <div className="flex flex-col gap-4">
             <TableVisualizer 
                tableName="users"
                columns={[{name: 'id', key: true}, {name: 'name'}]}
                rows={[
                  {id: 1, name: 'Ram'},
                  {id: 2, name: 'Varsha'},
                  {id: 3, name: 'Praneel'}
                ]}
                highlightedRows={
                  currentStep === 4 && internalStep >= 1 ? [0] : 
                  currentStep === 5 && internalStep >= 0 ? [0] : []
                }
                dimmedRows={
                  currentStep === 5 && internalStep >= 1 ? [0] : []
                }
                color={currentStep === 5 ? '#ef4444' : color}
             />
             
             {currentStep === 5 && (
               <div className="bg-[#0a1526] border border-[#ef4444] p-3 rounded mt-4">
                 <div className="font-mono text-[#ef4444] text-sm flex items-center gap-2">
                   <Trash2 className="w-4 h-4"/> DELETE FROM users WHERE id = 1;
                 </div>
               </div>
             )}
          </div>

          <div className="flex flex-col gap-4">
             <TableVisualizer 
                tableName="posts"
                columns={[{name: 'id', key: true}, {name: 'user_id', fk: true}, {name: 'title'}]}
                rows={[
                  {id: 10, user_id: 1, title: 'SQL Tips'},
                  {id: 11, user_id: 1, title: 'Indexing'},
                  {id: 12, user_id: 2, title: 'Design'},
                  {id: 13, user_id: 1, title: 'Joins'}
                ]}
                highlightedRows={currentStep === 4 && internalStep >= 2 ? [0, 1, 3] : []}
                dimmedRows={currentStep === 5 && internalStep === 2 ? [0, 1, 3] : []}
                color={color}
             />
             
             {currentStep === 5 && internalStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-0 top-1/2 translate-x-full ml-4 bg-[#ef4444] text-white text-xs font-mono p-2 rounded whitespace-nowrap">
                  ERROR: CANNOT DELETE (Posts exist)
                </motion.div>
             )}
             
             {currentStep === 5 && internalStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-0 top-1/2 translate-x-full ml-4 bg-[#10b981] text-white text-xs font-mono p-2 rounded whitespace-nowrap">
                  ON DELETE CASCADE TRIGGERED
                </motion.div>
             )}
          </div>

          {/* 1:N lines */}
          {(currentStep === 3) && (
            <svg className="absolute left-1/2 top-12 -translate-x-1/2 w-48 h-64 pointer-events-none z-10">
               {/* Line from Ram to Post 10 */}
               <motion.path initial={{ pathLength: 0 }} animate={internalStep >= 1 ? { pathLength: 1 } : {}} d="M 0 20 L 192 20" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
               {/* Line from Ram to Post 11 */}
               <motion.path initial={{ pathLength: 0 }} animate={internalStep >= 1 ? { pathLength: 1 } : {}} d="M 0 20 L 192 65" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
               {/* Line from Varsha to Post 12 */}
               <motion.path initial={{ pathLength: 0 }} animate={internalStep >= 2 ? { pathLength: 1 } : {}} d="M 0 65 L 192 110" stroke="#10b981" strokeWidth="1.5" fill="none" />
               {/* Line from Ram to Post 13 */}
               <motion.path initial={{ pathLength: 0 }} animate={internalStep >= 1 ? { pathLength: 1 } : {}} d="M 0 20 L 192 155" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
            </svg>
          )}

        </div>
      )}

      {/* M:N Relationship */}
      {(currentStep >= 6 && currentStep <= 9) && (
        <div className="w-full max-w-6xl flex flex-col items-center gap-8 relative">
          
          {currentStep === 6 && (
            <div className="flex gap-12">
               <div className="flex flex-col items-center gap-4">
                 <div className="bg-[#ef4444]/20 border border-[#ef4444] px-4 py-2 rounded font-mono text-[#ef4444] flex items-center gap-2">
                   <XCircle className="w-4 h-4"/> 1NF Violation
                 </div>
                 <TableVisualizer 
                   tableName="students"
                   columns={[{name: 'id', key: true}, {name: 'name'}, {name: 'course_ids'}]}
                   rows={[ {id: 1, name: 'Ram', course_ids: '[1, 2, 3]'} ]}
                   highlightedCells={[{rowIdx: 0, colIdx: 2, color: '#ef4444'}]}
                 />
               </div>
            </div>
          )}

          {currentStep >= 7 && (
            <div className="flex w-full items-start justify-between relative">
              <div className="w-[30%]">
                <TableVisualizer 
                  tableName="students"
                  columns={[{name: 'id', key: true}, {name: 'name'}]}
                  rows={[ {id: 1, name: 'Ram'}, {id: 2, name: 'Varsha'} ]}
                  highlightedRows={currentStep === 8 && internalStep >= 0 ? [0] : []}
                  color="#3b82f6"
                />
              </div>

              {/* Junction Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-[35%] relative z-10"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#f59e0b]/20 border border-[#f59e0b] px-3 py-1 rounded-full text-xs font-mono text-[#f59e0b] whitespace-nowrap">
                  JUNCTION TABLE (BRIDGE)
                </div>
                <TableVisualizer 
                  tableName="student_courses"
                  columns={[
                    {name: 'student_id', fk: true}, 
                    {name: 'course_id', fk: true}, 
                    {name: 'grade'}
                  ]}
                  rows={
                    currentStep === 9 && internalStep === 1 ? [
                      {student_id: 1, course_id: 2, grade: 'A'},
                      {student_id: 1, course_id: 2, grade: 'F'} // duplicate attempt
                    ] : [
                      {student_id: 1, course_id: 1, grade: 'A'},
                      {student_id: 1, course_id: 2, grade: 'B'},
                      {student_id: 2, course_id: 2, grade: 'A'}
                    ]
                  }
                  highlightedRows={currentStep === 8 && internalStep >= 1 ? [0, 1] : []}
                  highlightedCells={currentStep === 9 ? [
                    {rowIdx: 0, colIdx: 0, color: '#f59e0b'}, {rowIdx: 0, colIdx: 1, color: '#f59e0b'},
                    {rowIdx: 1, colIdx: 0, color: '#ef4444'}, {rowIdx: 1, colIdx: 1, color: '#ef4444'}
                  ] : []}
                  dimmedRows={currentStep === 9 && internalStep === 1 ? [1] : []}
                  color="#f59e0b"
                />
                {currentStep === 9 && internalStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white text-xs font-mono p-1.5 rounded whitespace-nowrap">
                    UNIQUE CONSTRAINT FAILED (1, 2)
                  </motion.div>
                )}
              </motion.div>

              <div className="w-[30%]">
                <TableVisualizer 
                  tableName="courses"
                  columns={[{name: 'id', key: true}, {name: 'title'}]}
                  rows={[ {id: 1, title: 'Math'}, {id: 2, title: 'Physics'} ]}
                  highlightedRows={currentStep === 8 && internalStep >= 2 ? [0, 1] : []}
                  color="#10b981"
                />
              </div>

              {/* M:N Lines (Abstract representation) */}
              {(currentStep === 7 || (currentStep === 8 && internalStep >= 1)) && (
                <svg className="absolute left-[30%] right-[30%] top-16 h-48 pointer-events-none z-0" style={{ width: '40%' }}>
                   {/* Left to center lines */}
                   <path d="M 0 20 L 50% 20" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" opacity={currentStep===8 && internalStep<1 ? 0.2 : 1}/>
                   <path d="M 0 20 L 50% 65" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" opacity={currentStep===8 && internalStep<1 ? 0.2 : 1}/>
                   {/* Right to center lines */}
                   <path d="M 50% 20 L 100% 20" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" opacity={currentStep===8 && internalStep<2 ? 0.2 : 1}/>
                   <path d="M 50% 65 L 100% 65" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" opacity={currentStep===8 && internalStep<2 ? 0.2 : 1}/>
                </svg>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default RelationshipsAnim;
