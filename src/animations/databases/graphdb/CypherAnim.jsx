import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const color = '#8b5cf6';

// Small live graph for visualizing query results
const nodes = [
  { id: 'Ram', x: 180, y: 120 },
  { id: 'Varsha', x: 60, y: 200 },
  { id: 'Praneel', x: 300, y: 200 },
  { id: 'Alice', x: 60, y: 300 },
  { id: 'Python', x: 180, y: 260 },
  { id: 'Java', x: 300, y: 300 },
];
const edges = [
  { from: 'Ram', to: 'Varsha', label: 'KNOWS' },
  { from: 'Ram', to: 'Praneel', label: 'KNOWS' },
  { from: 'Varsha', to: 'Alice', label: 'KNOWS' },
  { from: 'Ram', to: 'Python', label: 'SKILLED_IN' },
  { from: 'Varsha', to: 'Python', label: 'SKILLED_IN' },
  { from: 'Praneel', to: 'Java', label: 'SKILLED_IN' },
];

const QueryGraph = ({ hl = [], hlEdges = [] }) => (
  <svg width="360" height="360" className="rounded-xl bg-[#050d1a] border border-gray-800 shrink-0">
    <defs>
      <marker id="carrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#374151" />
      </marker>
      <marker id="carrowhl" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={color} />
      </marker>
    </defs>
    {edges.map((e, i) => {
      const f = nodes.find(n => n.id === e.from);
      const t = nodes.find(n => n.id === e.to);
      if (!f || !t) return null;
      const dx = t.x - f.x, dy = t.y - f.y, len = Math.sqrt(dx * dx + dy * dy);
      const r = 18;
      const isHl = hlEdges.includes(i);
      return (
        <g key={i}>
          <line
            x1={f.x + (dx / len) * r} y1={f.y + (dy / len) * r}
            x2={t.x - (dx / len) * r} y2={t.y - (dy / len) * r}
            stroke={isHl ? color : '#1f2937'} strokeWidth={isHl ? 2.5 : 1.5}
            markerEnd={isHl ? 'url(#carrowhl)' : 'url(#carrow)'}
          />
          <text x={(f.x + t.x) / 2} y={(f.y + t.y) / 2 - 6} fill={isHl ? color : '#374151'} fontSize="7" fontFamily="monospace" textAnchor="middle">{e.label}</text>
        </g>
      );
    })}
    {nodes.map(n => {
      const isHl = hl.includes(n.id);
      const isSkill = n.id === 'Python' || n.id === 'Java';
      const nc = isSkill ? '#39ff14' : color;
      return (
        <g key={n.id}>
          {isHl && <motion.circle animate={{ r: [21, 27, 21] }} transition={{ repeat: Infinity, duration: 1.5 }} cx={n.x} cy={n.y} fill="none" stroke={nc} strokeWidth="1.5" opacity={0.4} />}
          <circle cx={n.x} cy={n.y} r={18} fill="#0a1526" stroke={isHl ? nc : '#374151'} strokeWidth={isHl ? 2.5 : 1.5} />
          <text x={n.x} y={n.y + 1} fill={isHl ? 'white' : '#6b7280'} fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">{n.id}</text>
        </g>
      );
    })}
  </svg>
);

const CypherAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);
  useEffect(() => { setInternalStep(0); }, [currentStep]);
  useEffect(() => {
    const maxes = [3, 3, 3, 3, 3];
    const interval = setInterval(() => setInternalStep(p => p < maxes[currentStep] ? p + 1 : p), 1200);
    return () => clearInterval(interval);
  }, [currentStep]);

  const CypherBox = ({ lines, result }) => (
    <div className="bg-[#050d1a] border border-violet-500/30 rounded-xl p-4 font-mono text-xs">
      <div className="text-violet-400 text-[10px] uppercase tracking-widest mb-2">Cypher</div>
      {lines.map((l, i) => (
        <div key={i} className={`leading-relaxed ${l.startsWith('MATCH') ? 'text-violet-300' : l.startsWith('WHERE') ? 'text-amber-300' : l.startsWith('RETURN') ? 'text-green-300' : l.startsWith('//') ? 'text-gray-600 italic' : 'text-gray-300'}`}>{l}</div>
      ))}
      {result && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 border-t border-gray-800 pt-2 text-green-400 flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3" /> {result}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-6 font-source">

      {/* Step 0: Pattern Matching */}
      {currentStep === 0 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Cypher — ASCII Art Query Language</div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { pattern: '(node)', desc: 'Circle = a node in the graph', color },
              { pattern: '-[edge]->', desc: 'Arrow = directed relationship', color: '#06b6d4' },
              { pattern: '(:Label)', desc: 'Colon prefix = node label', color: '#39ff14' },
              { pattern: '{prop: val}', desc: 'Curly braces = property filter', color: '#f59e0b' },
            ].slice(0, internalStep + 1).map(p => (
              <motion.div key={p.pattern} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a1526] border rounded-xl p-4 text-center w-44" style={{ borderColor: p.color + '40' }}>
                <div className="font-mono text-lg font-bold mb-2" style={{ color: p.color }}>{p.pattern}</div>
                <div className="font-mono text-[10px] text-gray-400">{p.desc}</div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a1526] border border-violet-500/30 rounded-xl p-4 font-mono text-sm text-center">
              <span style={{ color }}>(<span className="text-white">p:Person</span>)</span>
              <span className="text-cyan-400">-[</span><span className="text-amber-400">:KNOWS</span><span className="text-cyan-400">]-{'>'}</span>
              <span style={{ color }}>(<span className="text-white">friend:Person</span>)</span>
              <div className="text-gray-500 text-xs mt-2">The pattern you write = the shape you're finding in the graph</div>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 1: MATCH single node */}
      {currentStep === 1 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <QueryGraph hl={internalStep >= 2 ? ['Ram'] : []} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="font-space font-bold text-white text-lg">MATCH — Find Nodes</div>
            {internalStep >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CypherBox
                  lines={[
                    'MATCH (p:Person {name: "Ram"})',
                    'RETURN p',
                  ]}
                  result={internalStep >= 2 ? 'Ram\'s node highlighted ✓' : null}
                />
              </motion.div>
            )}
            <div className="font-mono text-xs text-gray-500 bg-[#0a1526] border border-gray-800 rounded-xl p-3">
              No FROM clause. No JOIN. No WHERE needed for property filter — it's part of the pattern.
              RETURN controls what's sent back — a node, a property, or a computed value.
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Traverse relationships */}
      {currentStep === 2 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <QueryGraph hl={internalStep >= 2 ? ['Ram', 'Varsha', 'Praneel'] : internalStep >= 1 ? ['Ram'] : []} hlEdges={internalStep >= 2 ? [0, 1] : []} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="font-space font-bold text-white text-lg">Traverse Relationships</div>
            <CypherBox
              lines={[
                'MATCH (p:Person {name: "Ram"})',
                '  -[:KNOWS]->(friend)',
                'RETURN friend.name',
              ]}
              result={internalStep >= 2 ? '→ Varsha, Praneel' : null}
            />
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-gray-400 bg-[#0a1526] border border-gray-800 rounded-xl p-3">
                Arrow direction matters: -[:KNOWS]-{'>'} follows outgoing.<br />
                {'<'}-[:KNOWS]- follows incoming. -[:KNOWS]- follows both.
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Variable-length */}
      {currentStep === 3 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <QueryGraph hl={internalStep >= 2 ? ['Ram', 'Varsha', 'Praneel', 'Alice'] : internalStep >= 1 ? ['Ram', 'Varsha', 'Praneel'] : ['Ram']} hlEdges={internalStep >= 2 ? [0, 1, 2] : internalStep >= 1 ? [0, 1] : []} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="font-space font-bold text-white text-lg">Variable-Length Paths — *2</div>
            <CypherBox
              lines={[
                'MATCH (p:Person {name: "Ram"})',
                '  -[:KNOWS*2]->(fof)  // exactly 2 hops',
                'RETURN fof.name',
              ]}
              result={internalStep >= 2 ? '→ Alice (via Varsha), more...' : null}
            />
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2 font-mono text-xs">
                {[
                  { pattern: '[:KNOWS*2]', desc: 'Exactly 2 hops' },
                  { pattern: '[:KNOWS*1..3]', desc: '1 to 3 hops' },
                  { pattern: '[:KNOWS*]', desc: 'Any depth (use LIMIT!)' },
                ].map(r => (
                  <div key={r.pattern} className="flex gap-3 bg-[#0a1526] border border-gray-800 rounded-lg px-3 py-2">
                    <span className="text-violet-400">{r.pattern}</span>
                    <span className="text-gray-400">{r.desc}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Recommendation query */}
      {currentStep === 4 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <QueryGraph hl={internalStep >= 2 ? ['Ram', 'Varsha', 'Python'] : ['Ram']} hlEdges={internalStep >= 2 ? [3, 4] : []} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="font-space font-bold text-white text-lg">Recommendation Query</div>
            <CypherBox
              lines={[
                'MATCH (ram)-[:SKILLED_IN]->(skill)',
                '  <-[:SKILLED_IN]-(other)',
                'WHERE NOT (ram)-[:KNOWS]-(other)',
                'RETURN other.name,',
                '  collect(skill.name) AS shared_skills',
                'ORDER BY size(shared_skills) DESC',
                'LIMIT 5',
              ]}
              result={internalStep >= 2 ? 'Varsha (Python shared)' : null}
            />
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-[#0a1526] border border-violet-500/30 rounded-xl p-3 text-center">
                  <div className="text-violet-400 font-bold text-2xl">6</div>
                  <div className="text-gray-500">Cypher lines</div>
                </div>
                <div className="bg-[#0a1526] border border-red-900/30 rounded-xl p-3 text-center">
                  <div className="text-red-400 font-bold text-2xl">15+</div>
                  <div className="text-gray-500">SQL lines + 3 subqueries</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CypherAnim;
