import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, Braces, List, GitBranch, AlertTriangle, CheckCircle2, Code2 } from 'lucide-react';

const DocumentModelAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => { setInternalStep(0); }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 0) {
      interval = setInterval(() => setInternalStep(p => p < 3 ? p + 1 : p), 1200);
    } else if (currentStep === 1) {
      interval = setInterval(() => setInternalStep(p => p < 6 ? p + 1 : p), 600);
    } else if (currentStep === 2 || currentStep === 3) {
      interval = setInterval(() => setInternalStep(p => p < 4 ? p + 1 : p), 800);
    } else if (currentStep === 4) {
      interval = setInterval(() => setInternalStep(p => p < 2 ? p + 1 : p), 1500);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const color = '#06b6d4';

  const sqlCols = ['id', 'name', 'email', 'age', 'city', 'province', 'postal', 'skills', 'projects'];
  const sqlRow = [1, 'Ram Kashyap', 'ram@email.com', 26, 'Toronto', 'Ontario', 'M5V 2T6', 'Python,JS,ML', '[FK: proj table]'];

  const docLines = [
    '{ "_id": ObjectId("64f2a1b3..."),',
    '  "name": "Ram Kashyap",',
    '  "email": "ram@email.com",',
    '  "age": 26,',
    '  "address": {',
    '    "city": "Toronto",',
    '    "province": "Ontario",',
    '    "postal": "M5V 2T6"',
    '  },',
    '  "skills": ["Python", "JavaScript", "ML"],',
    '  "projects": [',
    '    { "name": "Interactive CS",',
    '      "status": "active",',
    '      "tech": ["React", "Framer Motion"] }',
    '  ]',
    '}',
  ];

  const threeUsers = [
    { label: 'User 1 (Full)', fields: ['_id', 'name', 'email', 'address', 'skills', 'projects'], color: color },
    { label: 'User 2 (Minimal)', fields: ['_id', 'name', 'email'], color: '#10b981' },
    { label: 'User 3 (+ company)', fields: ['_id', 'name', 'email', 'company'], color: '#8b5cf6' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] font-source gap-8">

      {/* Step 0: SQL Row rigidity */}
      {currentStep === 0 && (
        <div className="w-full max-w-5xl flex flex-col gap-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs mb-4">
              <Table className="w-3.5 h-3.5" /> SQL — Rigid Schema
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0a1526]">
            <table className="w-full text-xs font-mono">
              <thead className="bg-[#050d1a] border-b border-gray-800">
                <tr>
                  {sqlCols.map((col, i) => (
                    <th key={i} className="px-3 py-3 text-left text-gray-500 whitespace-nowrap border-r border-gray-800 last:border-0">
                      {col}
                      {(col === 'skills' || col === 'projects') && (
                        <span className="ml-1 text-red-400/60 text-[9px]">← problem</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-gray-800/50"
                >
                  {sqlRow.map((val, i) => (
                    <td key={i} className={`px-3 py-3 whitespace-nowrap border-r border-gray-800 last:border-0 text-white ${(i === 7 || i === 8) ? 'text-red-400' : ''}`}>
                      {val}
                    </td>
                  ))}
                </motion.tr>
                {internalStep >= 1 && (
                  <motion.tr initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="border-b border-gray-800/50">
                    {['2', 'Varsha', 'v@mail.com', '24', 'Mumbai', 'MH', 'NULL', 'NULL', '[FK: proj table]'].map((v, i) => (
                      <td key={i} className={`px-3 py-3 whitespace-nowrap border-r border-gray-800 last:border-0 ${v === 'NULL' ? 'text-gray-600 italic' : 'text-white'}`}>{v}</td>
                    ))}
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 font-mono text-sm text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Skills &amp; projects require junction tables → JOINs at read time. Nested data is impossible in a single row.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 1: MongoDB Document morphs in */}
      {currentStep === 1 && (
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
              <Braces className="w-3.5 h-3.5" /> MongoDB Document — one query, complete data
            </div>
          </div>
          <div className="bg-[#0a1526] border border-gray-800 rounded-xl p-6 font-mono text-sm overflow-auto">
            {docLines.slice(0, internalStep + 1).map((line, i) => {
              const isNested = line.startsWith('  ');
              const isDeep = line.startsWith('    ');
              const isKey = line.includes('"_id"') || line.includes('"name"') || line.includes('"email"') || line.includes('"age"');
              const isAddress = line.includes('address');
              const isSkills = line.includes('skills');
              const isProjects = line.includes('projects') || line.includes('"name": "Interactive');
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`leading-relaxed ${isDeep ? 'pl-8' : isNested ? 'pl-4' : ''}`}
                  style={{
                    color: isAddress ? '#06b6d4' : isSkills ? '#39ff14' : isProjects ? '#f59e0b' : isKey ? '#e2e8f0' : '#94a3b8'
                  }}
                >
                  {line}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Nested objects */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl flex gap-8 items-start">
          <div className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl p-6 font-mono text-xs">
            <div className="text-gray-500 mb-3 text-[10px] uppercase tracking-widest">Document</div>
            <div className="text-gray-300">{'{ "name": "Ram", ...'}</div>
            <motion.div animate={internalStep >= 1 ? { borderColor: '#06b6d4' } : { borderColor: '#374151' }} className="mt-2 border rounded-lg p-3 ml-4">
              <div className="text-cyan-400 font-bold mb-1">"address": {'{'}</div>
              {internalStep >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4 text-gray-300">
                "city": "Toronto",<br />"province": "Ontario",<br />"postal": "M5V 2T6"
              </motion.div>}
              <div className="text-cyan-400">{'}'}</div>
            </motion.div>
            <div className="text-gray-300 mt-1">{'}'}</div>
          </div>

          <div className="flex flex-col gap-3 text-center text-xs w-32">
            <div className={`p-3 rounded-xl border transition-all duration-500 ${internalStep >= 1 ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 bg-[#0a1526]'}`}>
              <div className="font-space font-bold text-white">No JOIN</div>
              <div className="text-gray-500 mt-1">address is inline</div>
            </div>
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-3 rounded-xl border border-green-500 bg-green-500/10">
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="font-mono text-green-400 text-[10px]">O(1) read</div>
              </motion.div>
            )}
          </div>

          <div className="flex-1 bg-[#0a1526] border border-red-900/30 rounded-xl p-6 font-mono text-xs opacity-60">
            <div className="text-red-400 text-[10px] uppercase tracking-widest mb-3">SQL equivalent</div>
            <div className="text-gray-400">SELECT u.*, a.*<br />FROM users u<br />JOIN addresses a<br />ON u.id = a.user_id<br />WHERE u.id = 1;</div>
            <div className="text-red-400 mt-3 text-[10px]">↑ Requires separate addresses table + JOIN</div>
          </div>
        </div>
      )}

      {/* Step 3: Arrays */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl flex gap-8 items-start">
          <div className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl p-6 font-mono text-xs">
            <div className="text-gray-300">{'{ ...'}</div>
            <motion.div animate={internalStep >= 1 ? { borderColor: '#39ff14' } : { borderColor: '#374151' }} className="mt-2 border rounded-lg p-3 ml-4">
              <div className="text-[#39ff14] font-bold mb-2">"skills": [</div>
              {['Python', 'JavaScript', 'ML'].slice(0, internalStep >= 1 ? 3 : 0).map((s, i) => (
                <motion.div key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="ml-4 text-white mb-1">"{s}",</motion.div>
              ))}
              <div className="text-[#39ff14]">]</div>
            </motion.div>
            <motion.div animate={internalStep >= 2 ? { borderColor: '#f59e0b' } : { borderColor: '#374151' }} className="mt-2 border rounded-lg p-3 ml-4">
              <div className="text-amber-400 font-bold mb-2">"projects": [</div>
              {internalStep >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4 text-gray-300">
                  {'{'} "name": "Interactive CS",<br />
                  &nbsp;&nbsp;"status": "active",<br />
                  &nbsp;&nbsp;"tech": ["React", "Framer Motion"] {'}'}
                </motion.div>
              )}
              <div className="text-amber-400">]</div>
            </motion.div>
            <div className="text-gray-300">{'}'}</div>
          </div>

          <div className="flex flex-col gap-3 text-center text-xs w-40">
            <div className="p-3 rounded-xl border border-red-900/50 bg-[#0a1526]">
              <div className="text-red-400 text-[10px] uppercase mb-2">SQL needs</div>
              <div className="font-mono text-gray-400 text-[9px] leading-relaxed">user_skills table<br />+ user_id FK<br />+ JOIN to query<br /><br />user_projects table<br />+ user_id FK<br />+ JOIN to query</div>
            </div>
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl border border-cyan-500 bg-cyan-500/10">
                <div className="text-cyan-400 font-space font-bold">MongoDB</div>
                <div className="text-gray-400 text-[9px] mt-1">Arrays inline<br />Indexed<br />One query</div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Schema Flexibility */}
      {currentStep === 4 && (
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">Same Collection — Different Shapes</div>
          <div className="grid grid-cols-3 gap-4">
            {threeUsers.slice(0, internalStep + 1).map((user, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#0a1526] border rounded-xl p-4 font-mono text-xs"
                style={{ borderColor: user.color + '50' }}
              >
                <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: user.color }}>{user.label}</div>
                <div className="flex flex-col gap-1">
                  {user.fields.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: user.color }} />
                      <span className="text-gray-300">{f}</span>
                      {f === 'company' && <span className="text-[9px] text-amber-400 ml-1">NEW</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[10px] text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Accepted
                </div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a1526] border border-amber-500/30 rounded-xl p-4 font-mono text-xs">
              <div className="text-red-400 font-bold mb-2">SQL equivalent for adding "company" field:</div>
              <div className="text-gray-400">ALTER TABLE users ADD COLUMN company VARCHAR(255);<br />
              <span className="text-red-400">↑ Locks entire table. Affects ALL rows. Requires migration. Risk of downtime at scale.</span></div>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 5: Trade-off */}
      {currentStep === 5 && (
        <div className="w-full max-w-3xl grid grid-cols-2 gap-6">
          <div className="bg-[#0a1526] border border-cyan-500/30 rounded-xl p-6 flex flex-col gap-4">
            <div className="text-cyan-400 font-space font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Flexibility Wins</div>
            <ul className="font-mono text-xs text-gray-300 space-y-2">
              {['Rapid iteration — no migrations', 'Add fields per-document', 'Perfect for agile teams', 'Polymorphic data models', 'Schema evolution = zero cost'].map(t => (
                <li key={t} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#0a1526] border border-red-500/30 rounded-xl p-6 flex flex-col gap-4">
            <div className="text-red-400 font-space font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Danger Zone</div>
            <ul className="font-mono text-xs text-gray-300 space-y-2">
              {['Inconsistency creeps in silently', '"email" vs "e_mail" — queries break', 'No enforcement = bugs in prod', 'Harder to maintain at scale', 'Solution: JSON Schema validation'].map(t => (
                <li key={t} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 font-mono text-xs text-center text-cyan-300">
            MongoDB Schema Validation: optional JSON Schema enforcement per collection.<br />Structure where you want it. Flexibility where you need it.
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentModelAnim;
