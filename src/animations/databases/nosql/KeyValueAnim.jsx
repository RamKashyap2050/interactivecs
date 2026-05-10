import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STRUCTURES = ['STRING', 'LIST', 'HASH', 'SET', 'SORTED_SET'];

const KeyValueAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);
  const [listItems, setListItems] = useState([]);
  const [activeHashField, setActiveHashField] = useState(null);
  const [checkedMember, setCheckedMember] = useState(null);

  useEffect(() => {
    setInternalStep(0);
    setListItems([]);
    setActiveHashField(null);
    setCheckedMember(null);
  }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 0) {
      interval = setInterval(() => setInternalStep(p => p < 3 ? p + 1 : p), 1200);
    } else if (currentStep === 1) { // STRING
      interval = setInterval(() => setInternalStep(p => p < 3 ? p + 1 : p), 1500);
    } else if (currentStep === 2) { // LIST
      interval = setInterval(() => setInternalStep(p => {
        if (p < 4) {
          const newItem = p === 0 ? 'New follower' : p === 1 ? 'Post liked' : p === 2 ? 'Comment' : 'Mention';
          setListItems(prev => [newItem, ...prev].slice(0, 6));
          return p + 1;
        }
        return p;
      }), 1000);
    } else if (currentStep === 3) { // HASH
      interval = setInterval(() => {
        setInternalStep(p => p < 3 ? p + 1 : p);
      }, 1200);
    } else if (currentStep === 4) { // SET
      interval = setInterval(() => setInternalStep(p => p < 3 ? p + 1 : p), 1200);
    } else if (currentStep === 5) { // SORTED SET
      interval = setInterval(() => setInternalStep(p => p < 3 ? p + 1 : p), 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const color = '#06b6d4';

  const hashFields = [
    { field: 'name', value: 'Ram' },
    { field: 'age', value: '26' },
    { field: 'city', value: 'Toronto' },
    { field: 'role', value: 'engineer' },
  ];

  const setMembers = ['ram', 'varsha', 'praneel', 'alice', 'bob'];

  const leaderboard = [
    { name: 'Ram', score: 9850 },
    { name: 'Praneel', score: 8100 },
    { name: 'Varsha', score: 7200 },
    { name: 'Alice', score: 5400 },
    { name: 'Bob', score: 3100 },
  ];

  const Command = ({ text }) => (
    <div className="bg-[#050d1a] border border-gray-700 rounded-lg p-3 font-mono text-xs text-amber-400 mb-4">
      {text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
    </div>
  );

  const Badge = ({ label, color: c }) => (
    <div className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: c, borderColor: c + '40', backgroundColor: c + '10' }}>
      {label}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] font-source gap-6">

      {/* Step 0: Overview of 5 structures */}
      {currentStep === 0 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl mb-2">Redis — 5 Native Data Structures</div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: 'String', icon: '🔑', desc: 'key → value', use: 'Sessions, counters', color: '#06b6d4' },
              { name: 'List', icon: '📋', desc: 'Ordered items', use: 'Queues, feeds', color: '#8b5cf6' },
              { name: 'Hash', icon: '🗂️', desc: 'Field → value', use: 'Objects, sessions', color: '#f59e0b' },
              { name: 'Set', icon: '🔵', desc: 'Unique items', use: 'Tags, visitors', color: '#10b981' },
              { name: 'Sorted Set', icon: '🏆', desc: 'Score + member', use: 'Leaderboards', color: '#ef4444' },
            ].map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                animate={internalStep >= 0 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="bg-[#0a1526] border rounded-xl p-4 text-center flex flex-col items-center gap-2"
                style={{ borderColor: s.color + '40' }}
              >
                <div className="text-2xl">{s.icon}</div>
                <div className="font-space font-bold text-sm text-white">{s.name}</div>
                <div className="font-mono text-[10px] text-gray-400">{s.desc}</div>
                <Badge label={s.use} color={s.color} />
              </motion.div>
            ))}
          </div>
          <div className="text-center font-mono text-xs text-gray-500">Each structure is optimized for a different access pattern — choosing wrong costs you 10x</div>
        </div>
      )}

      {/* Step 1: STRING */}
      {currentStep === 1 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-space font-bold text-white">STRING</div>
            <Badge label="O(1) get/set" color={color} />
          </div>
          <Command text={'SET user:1:name "Ram Kashyap"\nSET session:abc123 "{...}" EX 3600\nGET user:1:name → "Ram Kashyap"'} />
          <div className="flex gap-6">
            {/* Key box */}
            <div className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl p-5">
              <div className="font-mono text-[10px] text-gray-500 mb-3 uppercase">Key</div>
              <motion.div animate={internalStep >= 1 ? { borderColor: color } : {}} className="border border-gray-700 rounded-lg p-3 font-mono text-sm text-cyan-400">
                user:1:name
              </motion.div>
            </div>
            {/* Arrow */}
            <div className="flex items-center">
              <motion.div animate={internalStep >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }} className="text-2xl text-cyan-400 font-mono">→</motion.div>
            </div>
            {/* Value box */}
            <div className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl p-5">
              <div className="font-mono text-[10px] text-gray-500 mb-3 uppercase">Value</div>
              <motion.div animate={internalStep >= 2 ? { borderColor: '#39ff14' } : {}} className="border border-gray-700 rounded-lg p-3 font-mono text-sm text-green-400">
                "Ram Kashyap"
              </motion.div>
              {internalStep >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2">
                  <div className="text-[10px] font-mono text-gray-500">TTL:</div>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div animate={{ width: ['100%', '0%'] }} transition={{ duration: 3600, ease: 'linear' }} className="h-full bg-cyan-500 rounded-full" />
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">3600s</div>
                </motion.div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Session tokens', 'Cached HTML pages', 'Atomic counters (INCR)'].map(u => (
              <div key={u} className="bg-[#0a1526] border border-gray-800 rounded-lg p-3 text-center text-xs font-mono text-gray-400">{u}</div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: LIST */}
      {currentStep === 2 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-space font-bold text-white">LIST</div>
            <Badge label="Ordered, duplicates allowed" color="#8b5cf6" />
          </div>
          <Command text={'LPUSH notifications:user1 "New follower"\nRPUSH notifications:user1 "Post liked"\nLRANGE notifications:user1 0 9  ← latest 10'} />
          <div className="flex gap-8 items-start">
            <div className="flex-1 flex flex-col items-center gap-0">
              <div className="font-mono text-[10px] text-purple-400 mb-2">HEAD (LPUSH here)</div>
              {listItems.length === 0 && (
                <div className="border-2 border-dashed border-gray-700 rounded-xl w-full h-16 flex items-center justify-center text-gray-600 text-xs font-mono">Empty list</div>
              )}
              <AnimatePresence mode="popLayout">
                {listItems.map((item, i) => (
                  <motion.div
                    key={`${item}-${i}`}
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`w-full border rounded-lg px-4 py-2.5 mb-1 font-mono text-sm ${i === 0 ? 'border-purple-500 bg-purple-500/10 text-purple-300' : 'border-gray-700 bg-[#0a1526] text-gray-300'}`}
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="font-mono text-[10px] text-gray-600 mt-2">TAIL (RPUSH here)</div>
            </div>
            <div className="w-48 flex flex-col gap-3">
              {['Activity feeds', 'Task queues (BRPOP)', 'Message buffers', 'History logs'].map(u => (
                <div key={u} className="bg-[#0a1526] border border-purple-900/40 rounded-lg p-2 text-[10px] font-mono text-gray-400 text-center">{u}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: HASH */}
      {currentStep === 3 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-space font-bold text-white">HASH</div>
            <Badge label="Object with named fields" color="#f59e0b" />
          </div>
          <Command text={'HSET user:1 name "Ram" age 26 city "Toronto"\nHGET user:1 name  →  "Ram"\nHGETALL user:1   →  all fields'} />
          <div className="flex gap-6 items-start">
            <div className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-[#050d1a] px-4 py-2 border-b border-gray-800 font-mono text-xs text-amber-400 font-bold">user:1</div>
              <table className="w-full text-xs font-mono">
                <thead className="bg-[#050d1a]/50 border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500">field</th>
                    <th className="px-4 py-2 text-left text-gray-500">value</th>
                  </tr>
                </thead>
                <tbody>
                  {hashFields.slice(0, internalStep + 1).map((hf, i) => (
                    <motion.tr
                      key={hf.field}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b border-gray-800/50 last:border-0"
                    >
                      <td className="px-4 py-3 text-amber-400">{hf.field}</td>
                      <td className="px-4 py-3 text-white">{hf.value}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-48 flex flex-col gap-3">
              {['User sessions', 'Object caching', 'Config storage', 'Partial updates (no deserialize)'].map(u => (
                <div key={u} className="bg-[#0a1526] border border-amber-900/40 rounded-lg p-2 text-[10px] font-mono text-gray-400 text-center">{u}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: SET */}
      {currentStep === 4 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-space font-bold text-white">SET</div>
            <Badge label="Unique, unordered" color="#10b981" />
          </div>
          <Command text={'SADD online_users "ram" "varsha" "praneel"\nSISMEMBER online_users "ram"  →  1 (true)\nSISMEMBER online_users "john"  →  0 (false)'} />
          <div className="flex gap-6 items-start">
            <div className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl p-5">
              <div className="font-mono text-[10px] text-green-400 mb-4 uppercase">online_users</div>
              <div className="flex flex-wrap gap-2">
                {setMembers.slice(0, internalStep + 2).map((m, i) => (
                  <motion.div
                    key={m}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-3 py-1.5 rounded-full border border-green-500/50 bg-green-500/10 font-mono text-sm text-green-300"
                  >
                    {m}
                  </motion.div>
                ))}
              </div>
              {internalStep >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-[#050d1a] rounded-lg font-mono text-xs text-gray-400">
                  <div>SISMEMBER online_users "ram" → <span className="text-green-400">1</span></div>
                  <div>SISMEMBER online_users "john" → <span className="text-red-400">0</span></div>
                  <div>SCARD online_users → <span className="text-cyan-400">{Math.min(internalStep + 2, 5)}</span></div>
                </motion.div>
              )}
            </div>
            <div className="w-48 flex flex-col gap-3">
              {['Unique daily visitors', 'Online user lists', 'Tag systems', 'Set ops: SINTER, SUNION'].map(u => (
                <div key={u} className="bg-[#0a1526] border border-green-900/40 rounded-lg p-2 text-[10px] font-mono text-gray-400 text-center">{u}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: SORTED SET */}
      {currentStep === 5 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-space font-bold text-white">SORTED SET</div>
            <Badge label="Score-ordered, O(log N)" color="#ef4444" />
          </div>
          <Command text={'ZADD leaderboard 9850 "ram" 8100 "praneel" 7200 "varsha"\nZRANGE leaderboard 0 -1 WITHSCORES  ← sorted ascending\nZRANK leaderboard "ram"  →  2 (0-indexed)'} />
          <div className="flex gap-6 items-start">
            <div className="flex-1 bg-[#0a1526] border border-gray-800 rounded-xl p-5">
              <div className="font-mono text-[10px] text-red-400 mb-4 uppercase">leaderboard (sorted by score)</div>
              <div className="flex flex-col gap-2">
                {leaderboard.slice(0, internalStep + 2).map((entry, i) => {
                  const maxScore = 9850;
                  const pct = (entry.score / maxScore) * 100;
                  return (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 flex items-center justify-center text-xs font-space font-bold text-gray-500">#{i + 1}</div>
                      <div className="w-16 font-mono text-sm text-white">{entry.name}</div>
                      <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#374151' }}
                        />
                      </div>
                      <div className="w-14 text-right font-mono text-xs text-gray-400">{entry.score.toLocaleString()}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <div className="w-48 flex flex-col gap-3">
              {['Gaming leaderboards', 'Rate limiting (sliding window)', 'Priority queues', 'Time-series ranking'].map(u => (
                <div key={u} className="bg-[#0a1526] border border-red-900/40 rounded-lg p-2 text-[10px] font-mono text-gray-400 text-center">{u}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyValueAnim;
