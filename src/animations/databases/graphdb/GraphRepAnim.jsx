import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const color = '#8b5cf6';

const GraphRepAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);
  useEffect(() => { setInternalStep(0); }, [currentStep]);
  useEffect(() => {
    const maxes = [4, 3, 4, 5, 4];
    const interval = setInterval(() => setInternalStep(p => p < maxes[currentStep] ? p + 1 : p), 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  const people = ['Ram', 'Varsha', 'Praneel', 'Alice', 'Bob'];
  // adjacency matrix: Ram→Varsha, Ram→Praneel, Varsha→Alice, Alice→Bob
  const matrix = [
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
  ];
  const adjList = {
    Ram: ['Varsha', 'Praneel'],
    Varsha: ['Alice'],
    Praneel: [],
    Alice: ['Bob'],
    Bob: [],
  };

  // Graph nodes for SVG
  const nodes = [
    { id: 'Ram', x: 210, y: 60 },
    { id: 'Varsha', x: 80, y: 160 },
    { id: 'Praneel', x: 340, y: 160 },
    { id: 'Alice', x: 80, y: 260 },
    { id: 'Bob', x: 80, y: 340 },
  ];
  const edges = [
    { from: 'Ram', to: 'Varsha' }, { from: 'Ram', to: 'Praneel' },
    { from: 'Varsha', to: 'Alice' }, { from: 'Alice', to: 'Bob' },
  ];

  const MiniGraph = ({ highlightEdgeIdx = -1 }) => (
    <svg width="200" height="220" className="rounded-xl bg-[#050d1a] border border-gray-800">
      {edges.map((e, i) => {
        const f = nodes.find(n => n.id === e.from);
        const t = nodes.find(n => n.id === e.to);
        const hl = i === highlightEdgeIdx;
        const dx = t.x - f.x, dy = t.y - f.y, len = Math.sqrt(dx * dx + dy * dy);
        const r = 16;
        const x1 = f.x / 2.2 + 10 + (dx / len) * r, y1 = f.y / 2.2 + (dy / len) * r;
        const x2 = t.x / 2.2 + 10 - (dx / len) * r, y2 = t.y / 2.2 - (dy / len) * r;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hl ? color : '#374151'} strokeWidth={hl ? 2 : 1} />;
      })}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x / 2.2 + 10} cy={n.y / 2.2} r={16} fill="#0a1526" stroke="#374151" strokeWidth="1.5" />
          <text x={n.x / 2.2 + 10} y={n.y / 2.2 + 1} fill="#9ca3af" fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">{n.id}</text>
        </g>
      ))}
    </svg>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-6 font-source">

      {/* Step 0: Adjacency Matrix */}
      {currentStep === 0 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <MiniGraph />
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-white font-space font-bold text-lg">Adjacency Matrix</div>
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0a1526]">
              <table className="font-mono text-xs">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-gray-600 border-r border-gray-800"> </th>
                    {people.map(p => <th key={p} className="px-3 py-2 text-gray-500 border-r border-gray-800 last:border-0">{p.slice(0, 3)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, ri) => (
                    <tr key={ri} className="border-t border-gray-800">
                      <td className="px-3 py-2 text-gray-500 border-r border-gray-800 font-bold">{people[ri].slice(0, 3)}</td>
                      {row.map((cell, ci) => (
                        <td key={ci} className={`px-3 py-2 text-center border-r border-gray-800 last:border-0 transition-all duration-300 ${cell === 1 ? 'text-violet-400 font-bold' : 'text-gray-700'}`}
                          style={internalStep >= 2 && ri === 0 && ci === 3 ? { backgroundColor: '#ef444420', color: '#ef4444' } : {}}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {internalStep >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-gray-400 bg-[#050d1a] border border-gray-700 rounded-xl p-3">
                Edge lookup O(1): matrix[Ram][Varsha] = <span className="text-violet-400">1 ✓</span><br />
                {internalStep >= 2 && <span>Does Ram know Alice? matrix[Ram][Alice] = <span className="text-red-400">0 ✗</span><br /></span>}
                {internalStep >= 3 && <span>Find Ram's friends: scan entire row → O(V)<br /></span>}
                {internalStep >= 4 && <span className="text-amber-400">Space: 5×5 = 25 cells for 4 edges → 21 zeros wasted</span>}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Sparse matrix problem */}
      {currentStep === 1 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="text-white font-space font-bold text-xl text-center">The Sparse Matrix Problem</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { scale: '5 users', edges: '4', cells: '25', zeros: '21', waste: '84%', color: '#10b981' },
              { scale: '1K users', edges: '~200K', cells: '1M', zeros: '800K', waste: '80%', color: '#f59e0b' },
              { scale: '1M users', edges: '200M', cells: '1 Trillion', zeros: '99.98%', waste: '99.98%', color: '#ef4444' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={internalStep >= i ? { opacity: 1, y: 0 } : {}} className="bg-[#0a1526] border rounded-xl p-4 font-mono text-xs" style={{ borderColor: s.color + '50' }}>
                <div className="font-bold mb-3" style={{ color: s.color }}>{s.scale}</div>
                <div className="space-y-1 text-gray-400">
                  <div>Edges: <span className="text-white">{s.edges}</span></div>
                  <div>Matrix cells: <span className="text-white">{s.cells}</span></div>
                  <div>Zeros (waste): <span style={{ color: s.color }}>{s.waste}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center font-mono text-xs text-red-400">
              1M × 1M matrix = 8 terabytes of RAM (64-bit floats). For 200M actual edges.<br />
              99.98% is empty space. No production system uses this.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: Adjacency List */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl flex gap-8 items-start">
          <MiniGraph />
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-white font-space font-bold text-lg">Adjacency List</div>
            <div className="flex flex-col gap-2">
              {Object.entries(adjList).slice(0, internalStep + 1).map(([node, neighbors]) => (
                <motion.div key={node} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 bg-[#0a1526] border border-gray-800 rounded-xl px-4 py-3">
                  <div className="font-mono text-sm font-bold" style={{ color }}>{node}:</div>
                  <div className="flex gap-2">
                    {neighbors.length === 0
                      ? <div className="font-mono text-xs text-gray-600 italic">[ ]</div>
                      : neighbors.map(n => (
                        <div key={n} className="bg-violet-500/10 border border-violet-500/30 rounded px-2 py-0.5 font-mono text-xs text-violet-300">{n}</div>
                      ))}
                  </div>
                </motion.div>
              ))}
            </div>
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 font-mono text-xs text-green-400">
                Space: O(V + E). At 1M users, 200M edges → 200M entries.<br />
                vs 1 trillion for matrix. 5,000× more efficient ✓
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Native Index-Free Adjacency */}
      {currentStep === 3 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          {/* Left: Non-native (relational) */}
          <div className="flex-1 bg-[#0a1526] border border-red-900/40 rounded-xl p-5">
            <div className="text-red-400 font-mono text-xs font-bold mb-3 uppercase">Non-Native (SQL storing graph)</div>
            <div className="font-mono text-xs text-gray-400 mb-3 leading-relaxed">
              SELECT to_id FROM edges<br />
              WHERE from_id = 1<br />
              AND type = 'KNOWS'
            </div>
            <div className="border border-gray-700 rounded-lg overflow-hidden mb-3">
              <table className="w-full font-mono text-xs">
                <thead className="bg-[#050d1a] border-b border-gray-800">
                  <tr>
                    <th className="px-3 py-1 text-left text-gray-600">from_id</th>
                    <th className="px-3 py-1 text-left text-gray-600">to_id</th>
                    <th className="px-3 py-1 text-left text-gray-600">type</th>
                  </tr>
                </thead>
                <tbody>
                  {[['1','2','KNOWS'],['1','3','KNOWS'],['2','4','KNOWS'],['3','4','KNOWS'],['4','5','KNOWS']].map((r,i) => (
                    <tr key={i} className={`border-t border-gray-800 ${internalStep >= 1 && r[0] === '1' ? 'bg-red-500/10' : ''}`}>
                      {r.map((c,ci) => <td key={ci} className={`px-3 py-1 ${internalStep >= 1 && r[0] === '1' ? 'text-red-300' : 'text-gray-400'}`}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-red-400 text-[10px] font-mono">Index scan: O(log N) where N = total edges. At 1B edges: multiple disk reads.</div>
          </div>

          {/* Right: Native graph */}
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex-1 bg-[#0a1526] border border-violet-500/40 rounded-xl p-5">
              <div className="text-violet-400 font-mono text-xs font-bold mb-4 uppercase">Native Graph (Neo4j — Index-Free)</div>
              <div className="flex flex-col gap-3 font-mono text-xs">
                {/* Node record */}
                <div className="bg-[#050d1a] border border-violet-500/30 rounded-lg p-3">
                  <div className="text-violet-300 font-bold mb-2">Node[Ram] in memory:</div>
                  <div className="text-gray-400">id: 1 | label: Person</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-gray-400">first_rel_ptr: </div>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-violet-400">→ Rel[1]</motion.div>
                  </div>
                </div>
                {/* Rel records chained */}
                {[
                  { id: 'Rel[1]', label: ':KNOWS → Varsha', next: 'Rel[2]' },
                  { id: 'Rel[2]', label: ':KNOWS → Praneel', next: 'null' },
                ].map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0 }} animate={internalStep >= 3 + i ? { opacity: 1 } : { opacity: 0 }} className="bg-[#050d1a] border border-cyan-500/30 rounded-lg p-3">
                    <div className="text-cyan-300 font-bold mb-1">{r.id}</div>
                    <div className="text-gray-400">{r.label}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-gray-400">next: </div>
                      <div className="text-cyan-400">{r.next}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {internalStep >= 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-green-400 text-[10px] font-mono">
                  O(degree of Ram) — independent of total graph size ✓<br />
                  1M or 1B users: same local traversal cost
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Step 4: Matrix Powers */}
      {currentStep === 4 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="text-white font-space font-bold text-xl text-center">Matrix Powers → Graph Analytics</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { power: 'A¹', desc: 'Direct connections', example: 'Ram knows Varsha, Praneel', color },
              { power: 'A²', desc: '2-hop paths', example: 'Ram → Varsha → Alice (2 hops)', color: '#06b6d4' },
              { power: 'A³', desc: '3-hop paths', example: 'Ram → Varsha → Alice → Bob', color: '#10b981' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={internalStep >= i ? { opacity: 1, y: 0 } : {}} className="bg-[#0a1526] border rounded-xl p-5 text-center" style={{ borderColor: m.color + '40' }}>
                <div className="text-3xl font-space font-bold mb-2" style={{ color: m.color }}>{m.power}</div>
                <div className="font-mono text-xs text-gray-400 mb-3">{m.desc}</div>
                <div className="font-mono text-[10px] text-gray-500 bg-[#050d1a] rounded p-2">{m.example}</div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a1526] border border-gray-800 rounded-xl p-5 font-mono text-xs">
              <div className="text-violet-400 font-bold mb-2">PageRank = eigenvector of A</div>
              <div className="text-gray-400 mb-3">Iterative matrix multiplication until scores converge → node importance</div>
              <div className="flex gap-4">
                {[
                  { name: 'Ram', size: 32, score: '0.85' },
                  { name: 'Varsha', size: 22, score: '0.42' },
                  { name: 'Alice', size: 18, score: '0.31' },
                  { name: 'Praneel', size: 14, score: '0.20' },
                  { name: 'Bob', size: 10, score: '0.11' },
                ].map(n => (
                  <motion.div key={n.name} initial={{ scale: 0 }} animate={internalStep >= 4 ? { scale: 1 } : {}} className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center font-space font-bold text-white" style={{ width: n.size * 2, height: n.size * 2, fontSize: n.size / 3 }}>{n.name[0]}</div>
                    <div className="text-[10px] text-violet-400">{n.score}</div>
                    <div className="text-[9px] text-gray-600">{n.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraphRepAnim;
