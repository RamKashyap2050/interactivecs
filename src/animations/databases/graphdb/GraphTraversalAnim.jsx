import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const color = '#8b5cf6';

// Graph nodes
const NODES = [
  { id: 'Ram', x: 200, y: 80, type: ':Person' },
  { id: 'Varsha', x: 80, y: 160, type: ':Person' },
  { id: 'Praneel', x: 320, y: 160, type: ':Person' },
  { id: 'Alice', x: 80, y: 260, type: ':Person' },
  { id: 'Bob', x: 200, y: 340, type: ':Person' },
  { id: 'TechCorp', x: 340, y: 280, type: ':Company' },
  { id: 'Python', x: 200, y: 200, type: ':Skill' },
];

const EDGES = [
  { from: 'Ram', to: 'Varsha', label: 'KNOWS' },
  { from: 'Ram', to: 'Praneel', label: 'KNOWS' },
  { from: 'Varsha', to: 'Alice', label: 'KNOWS' },
  { from: 'Alice', to: 'Bob', label: 'KNOWS' },
  { from: 'Praneel', to: 'TechCorp', label: 'WORKS_AT' },
  { from: 'Ram', to: 'Python', label: 'SKILLED_IN' },
  { from: 'Varsha', to: 'Python', label: 'SKILLED_IN' },
];

const SX = 0.85; // scale factor

const TraversalGraph = ({ highlightNodes = [], highlightEdges = [], pathNodes = [] }) => (
  <svg width="380" height="380" className="rounded-xl bg-[#050d1a] border border-gray-800 shrink-0">
    <defs>
      <marker id="tarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#374151" />
      </marker>
      <marker id="tarrhl" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={color} />
      </marker>
      <marker id="tarrpath" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
      </marker>
    </defs>
    {EDGES.map((e, i) => {
      const f = NODES.find(n => n.id === e.from);
      const t = NODES.find(n => n.id === e.to);
      if (!f || !t) return null;
      const dx = t.x - f.x, dy = t.y - f.y, len = Math.sqrt(dx * dx + dy * dy);
      const r = 20;
      const x1 = (f.x * SX + 20) + (dx / len) * r;
      const y1 = (f.y * SX + 20) + (dy / len) * r;
      const x2 = (t.x * SX + 20) - (dx / len) * r;
      const y2 = (t.y * SX + 20) - (dy / len) * r;
      const hl = highlightEdges.includes(i);
      const isPath = pathNodes.includes(e.from) && pathNodes.includes(e.to);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={isPath ? '#f59e0b' : hl ? color : '#1f2937'}
          strokeWidth={isPath ? 3 : hl ? 2 : 1.5}
          markerEnd={isPath ? 'url(#tarrpath)' : hl ? 'url(#tarrhl)' : 'url(#tarr)'}
        />
      );
    })}
    {NODES.map(n => {
      const hl = highlightNodes.includes(n.id);
      const isPath = pathNodes.includes(n.id);
      const cx = n.x * SX + 20, cy = n.y * SX + 20;
      const nc = n.type === ':Company' ? '#06b6d4' : n.type === ':Skill' ? '#39ff14' : color;
      return (
        <g key={n.id}>
          {(hl || isPath) && <motion.circle animate={{ r: [22, 27, 22] }} transition={{ repeat: Infinity, duration: 1.5 }} cx={cx} cy={cy} fill="none" stroke={isPath ? '#f59e0b' : nc} strokeWidth="1.5" opacity={0.4} />}
          <circle cx={cx} cy={cy} r={20} fill="#0a1526" stroke={hl || isPath ? (isPath ? '#f59e0b' : nc) : '#374151'} strokeWidth={hl || isPath ? 2.5 : 1.5} />
          <text x={cx} y={cy + 1} fill={hl || isPath ? 'white' : '#6b7280'} fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">{n.id}</text>
        </g>
      );
    })}
  </svg>
);

const GraphTraversalAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);
  useEffect(() => { setInternalStep(0); }, [currentStep]);
  useEffect(() => {
    const maxes = [3, 3, 3, 3];
    const interval = setInterval(() => setInternalStep(p => p < maxes[currentStep] ? p + 1 : p), 1400);
    return () => clearInterval(interval);
  }, [currentStep]);

  const bfsLevels = [
    ['Ram'],
    ['Varsha', 'Praneel'],
    ['Alice', 'TechCorp'],
    ['Bob'],
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-6 font-source">

      {/* BFS */}
      {currentStep === 0 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <TraversalGraph
            highlightNodes={bfsLevels.slice(0, internalStep + 1).flat()}
            highlightEdges={internalStep >= 1 ? [0, 1] : internalStep >= 2 ? [0, 1, 2, 4] : []}
          />
          <div className="flex-1 flex flex-col gap-4">
            <div className="font-space font-bold text-white text-lg">BFS — Breadth-First Search</div>
            <div className="font-mono text-xs text-gray-400 bg-[#050d1a] border border-gray-700 rounded-xl p-3">
              "Find all people within {internalStep + 1} hop{internalStep > 0 ? 's' : ''} of Ram"
            </div>
            <div className="flex flex-col gap-2">
              {bfsLevels.slice(0, internalStep + 1).map((level, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                  <div className="w-20 font-mono text-xs" style={{ color }}>Depth {i}:</div>
                  <div className="flex gap-2">
                    {level.map(n => (
                      <div key={n} className="bg-violet-500/10 border border-violet-500/30 rounded-lg px-3 py-1 font-mono text-xs text-violet-300">{n}</div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="font-mono text-xs text-gray-500 bg-[#0a1526] border border-gray-800 rounded-xl p-3">
              BFS guarantees shortest hop-count path.<br />
              Used in: degrees of separation, recommendation engines, network analysis.
            </div>
          </div>
        </div>
      )}

      {/* DFS */}
      {currentStep === 1 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <TraversalGraph
            pathNodes={internalStep >= 2 ? ['Ram', 'Varsha', 'Alice', 'Bob'] : internalStep >= 1 ? ['Ram', 'Varsha', 'Alice'] : ['Ram']}
          />
          <div className="flex-1 flex flex-col gap-4">
            <div className="font-space font-bold text-white text-lg">DFS — Depth-First Search</div>
            <div className="font-mono text-xs text-amber-400 bg-[#050d1a] border border-amber-900/40 rounded-xl p-3">
              "Find a path from Ram to Bob"
            </div>
            <div className="flex flex-col gap-2">
              {[
                { step: 0, text: 'Start at Ram. Follow first edge: Ram → Varsha', node: 'Varsha' },
                { step: 1, text: 'Continue deep: Varsha → Alice', node: 'Alice' },
                { step: 2, text: 'Continue: Alice → Bob — FOUND!', node: 'Bob', found: true },
                { step: 3, text: 'Path: Ram → Varsha → Alice → Bob (3 hops)', isResult: true },
              ].filter(s => internalStep >= s.step).map(s => (
                <motion.div key={s.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`font-mono text-xs px-4 py-2 rounded-lg border ${s.found ? 'border-green-500/40 bg-green-500/10 text-green-400' : s.isResult ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-gray-700 bg-[#0a1526] text-gray-300'}`}>
                  {s.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shortest Path */}
      {currentStep === 2 && (
        <div className="w-full max-w-5xl flex gap-8 items-start">
          <TraversalGraph pathNodes={internalStep >= 2 ? ['Ram', 'Varsha', 'Alice', 'Bob'] : []} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="font-space font-bold text-white text-lg">Shortest Path — Neo4j Built-in</div>
            {internalStep >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#050d1a] border border-violet-500/30 rounded-xl p-4 font-mono text-xs">
                <div className="text-violet-400 mb-2">Cypher shortestPath()</div>
                <div className="text-gray-300 leading-relaxed">
                  MATCH path = shortestPath(<br />
                  &nbsp;&nbsp;(ram:Person {'{'} name:"Ram" {'}'})<br />
                  &nbsp;&nbsp;-[*]-<br />
                  &nbsp;&nbsp;(bob:Person {'{'} name:"Bob" {'}'})<br />
                  )<br />
                  RETURN path
                </div>
              </motion.div>
            )}
            {internalStep >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-4 font-mono text-xs text-amber-400">
                Result: Ram → Varsha → Alice → Bob<br />
                Length: 3 hops
              </motion.div>
            )}
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a1526] border border-gray-800 rounded-xl p-3 font-mono text-xs text-gray-400">
                Not application code. Not recursive CTE.<br />
                Native graph operation: O(V + E) Dijkstra via pointer traversal.
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Friends of Friends */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl grid grid-cols-2 gap-6">
          <div className="bg-[#0a1526] border border-red-900/40 rounded-xl p-5 font-mono text-xs">
            <div className="text-red-400 font-bold mb-3">SQL — Friends of Friends</div>
            <div className="text-gray-400 leading-relaxed text-[10px]">
              SELECT DISTINCT u3.name<br />
              FROM users u1<br />
              JOIN friendships f1 ON u1.id = f1.from_id<br />
              JOIN users u2 ON f1.to_id = u2.id<br />
              JOIN friendships f2 ON u2.id = f2.from_id<br />
              JOIN users u3 ON f2.to_id = u3.id<br />
              WHERE u1.name = 'Ram'<br />
              AND u3.name NOT IN (<br />
              &nbsp;&nbsp;SELECT u.name FROM users u<br />
              &nbsp;&nbsp;JOIN friendships f ON f.to_id = u.id<br />
              &nbsp;&nbsp;WHERE f.from_id = u1.id<br />
              )
            </div>
            <div className="mt-2 text-red-400 text-[10px]">~50ms at 1M users, 10M friendships</div>
          </div>
          {internalStep >= 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-violet-500/40 rounded-xl p-5 font-mono text-xs">
              <div className="text-violet-400 font-bold mb-3">Cypher — Same Query</div>
              <div className="text-gray-300 leading-relaxed">
                MATCH (ram:Person {'{'} name:"Ram" {'}'})<br />
                &nbsp;&nbsp;-[:KNOWS*2]-(fof)<br />
                WHERE NOT (ram)-[:KNOWS]-(fof)<br />
                RETURN fof.name
              </div>
              <div className="mt-3 text-green-400 text-[10px]">~5ms at 1M users, 10M friendships</div>
              {internalStep >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-violet-500/10 border border-violet-500/30 rounded-lg p-2 text-[10px] text-violet-300">
                  10× faster. O(degree) per hop — not O(log N) per JOIN.<br />
                  The right model makes the query trivial.
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraphTraversalAnim;
