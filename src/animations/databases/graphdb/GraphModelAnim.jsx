import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const color = '#8b5cf6';
const cyan = '#06b6d4';
const green = '#39ff14';
const amber = '#f59e0b';

// Shared mini graph renderer
const GraphCanvas = ({ nodes, edges, highlightNodes = [], highlightEdges = [], dimAll = false }) => {
  const W = 420, H = 300;
  return (
    <svg width={W} height={H} className="rounded-xl bg-[#050d1a] border border-gray-800">
      {/* Edges */}
      {edges.map((e, i) => {
        const from = nodes.find(n => n.id === e.from);
        const to = nodes.find(n => n.id === e.to);
        if (!from || !to) return null;
        const hl = highlightEdges.includes(i);
        const dx = to.x - from.x, dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len, uy = dy / len;
        const r = 22;
        const x1 = from.x + ux * r, y1 = from.y + uy * r;
        const x2 = to.x - ux * r, y2 = to.y - uy * r;
        return (
          <g key={i}>
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: dimAll && !hl ? 0.1 : 1 }}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={hl ? color : '#374151'}
              strokeWidth={hl ? 2.5 : 1.5}
              markerEnd={`url(#arrow${hl ? 'hl' : ''})`}
            />
            {e.label && (
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} fill={hl ? color : '#6b7280'} fontSize="8" fontFamily="monospace" textAnchor="middle">{e.label}</text>
            )}
          </g>
        );
      })}
      {/* Nodes */}
      {nodes.map(n => {
        const hl = highlightNodes.includes(n.id);
        return (
          <g key={n.id}>
            <motion.circle
              initial={{ r: 0 }}
              animate={{ r: 22, opacity: dimAll && !hl ? 0.15 : 1 }}
              cx={n.x} cy={n.y}
              fill="#0a1526"
              stroke={hl ? (n.color || color) : '#374151'}
              strokeWidth={hl ? 2.5 : 1.5}
            />
            {hl && <motion.circle animate={{ r: [24, 28, 24] }} transition={{ repeat: Infinity, duration: 1.5 }} cx={n.x} cy={n.y} fill="none" stroke={n.color || color} strokeWidth="1" opacity={0.4} />}
            <text x={n.x} y={n.y + 1} fill={hl ? 'white' : '#9ca3af'} fontSize="9" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" fontWeight={hl ? 'bold' : 'normal'}>{n.label}</text>
            {n.type && <text x={n.x} y={n.y + 30} fill={n.color || '#6b7280'} fontSize="7" fontFamily="monospace" textAnchor="middle">{n.type}</text>}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#374151" />
        </marker>
        <marker id="arrowhl" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
    </svg>
  );
};

const GraphModelAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);
  useEffect(() => { setInternalStep(0); }, [currentStep]);
  useEffect(() => {
    const maxes = [4, 5, 4, 3];
    const interval = setInterval(() => setInternalStep(p => p < maxes[currentStep] ? p + 1 : p), 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  const socialNodes = [
    { id: 'ram', label: 'Ram', x: 210, y: 150, type: ':Person', color },
    { id: 'varsha', label: 'Varsha', x: 80, y: 100, type: ':Person', color },
    { id: 'praneel', label: 'Praneel', x: 340, y: 100, type: ':Person', color },
    { id: 'techcorp', label: 'TechCorp', x: 80, y: 230, type: ':Company', color: cyan },
    { id: 'python', label: 'Python', x: 340, y: 230, type: ':Skill', color: green },
    { id: 'project', label: 'ICS', x: 210, y: 260, type: ':Project', color: amber },
  ];
  const socialEdges = [
    { from: 'ram', to: 'varsha', label: 'KNOWS' },
    { from: 'ram', to: 'praneel', label: 'KNOWS' },
    { from: 'ram', to: 'techcorp', label: 'WORKS_AT' },
    { from: 'ram', to: 'python', label: 'SKILLED_IN' },
    { from: 'ram', to: 'project', label: 'CREATED' },
    { from: 'varsha', to: 'techcorp', label: 'WORKS_AT' },
  ];

  const propCards = [
    { key: 'id', value: '1', color: '#6b7280' },
    { key: 'name', value: '"Ram"', color },
    { key: 'age', value: '26', color: cyan },
    { key: 'city', value: '"Toronto"', color: green },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-6">

      {/* Step 0: Node + Properties */}
      {currentStep === 0 && (
        <div className="flex gap-12 items-center">
          <div className="relative flex items-center justify-center w-40 h-40">
            <motion.div animate={{ boxShadow: ['0 0 20px #8b5cf640', '0 0 40px #8b5cf680', '0 0 20px #8b5cf640'] }} transition={{ repeat: Infinity, duration: 2 }} className="w-32 h-32 rounded-full border-2 border-violet-500 bg-[#0a1526] flex flex-col items-center justify-center">
              <div className="font-space font-bold text-white text-sm">Ram</div>
              {internalStep >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-mono text-violet-400 mt-1">:Person</motion.div>}
            </motion.div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-gray-500 font-mono text-xs uppercase mb-2">Properties</div>
            {propCards.slice(0, internalStep + 1).map(p => (
              <motion.div key={p.key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-gray-800 rounded-lg px-4 py-2 font-mono text-sm flex gap-3">
                <span className="text-gray-500">{p.key}:</span>
                <span style={{ color: p.color }}>{p.value}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-gray-500 font-mono text-xs uppercase mb-2">Labels</div>
            {[':Person', ':Company', ':Project', ':Skill'].slice(0, Math.max(1, internalStep - 1)).map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}
                className="px-3 py-1 rounded-full border font-mono text-xs"
                style={{ borderColor: [color, cyan, amber, green][i] + '60', color: [color, cyan, amber, green][i] }}
              >{l}</motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Edges */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6 items-center w-full max-w-4xl">
          <GraphCanvas
            nodes={socialNodes.slice(0, 5)}
            edges={socialEdges.slice(0, internalStep)}
            highlightEdges={[internalStep - 1]}
            highlightNodes={internalStep > 0 ? [socialEdges[internalStep - 1]?.from, socialEdges[internalStep - 1]?.to] : []}
          />
          {internalStep > 0 && (
            <motion.div key={internalStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a1526] border border-violet-800/50 rounded-xl px-6 py-3 font-mono text-sm text-violet-300">
              {['', '(ram)-[:KNOWS]->(varsha) {since: 2020, context: "work"}', '(ram)-[:KNOWS]->(praneel) {since: 2021}', '(ram)-[:WORKS_AT]->(techcorp) {role: "Engineer", since: 2022}', '(ram)-[:SKILLED_IN]->(python)'][internalStep]}
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: Full property graph */}
      {currentStep === 2 && (
        <div className="flex gap-8 items-start w-full max-w-5xl">
          <GraphCanvas
            nodes={socialNodes}
            edges={socialEdges.slice(0, internalStep + 2)}
            highlightNodes={internalStep >= 3 ? ['ram', 'varsha', 'techcorp', 'python'] : []}
          />
          <div className="flex flex-col gap-3 w-64">
            <div className="text-gray-500 font-mono text-xs uppercase">Property Graph = Nodes + Edges + Properties</div>
            {[
              { label: 'Nodes', desc: '6 entities with labels & properties', color },
              { label: 'Edges', desc: 'Named, directed, with properties', color: cyan },
              { label: 'Pointer storage', desc: 'Edge = O(1) pointer, not a JOIN', color: green },
            ].slice(0, internalStep + 1).map(r => (
              <motion.div key={r.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-gray-800 rounded-xl p-3 font-mono text-xs">
                <div className="font-bold mb-1" style={{ color: r.color }}>{r.label}</div>
                <div className="text-gray-400">{r.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: SQL vs Graph */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl grid grid-cols-2 gap-6">
          <div className="bg-[#0a1526] border border-red-900/40 rounded-xl p-5 font-mono text-xs">
            <div className="text-red-400 font-bold mb-3">SQL — Friends of Friends</div>
            <div className="text-gray-400 leading-relaxed">
              SELECT u3.name<br />
              FROM users u1<br />
              JOIN friends f1 ON u1.id = f1.user_id<br />
              JOIN users u2 ON f1.friend_id = u2.id<br />
              JOIN friends f2 ON u2.id = f2.user_id<br />
              JOIN users u3 ON f2.friend_id = u3.id<br />
              WHERE u1.name = 'Ram'<br />
              AND u3.id NOT IN (<br />
              &nbsp;&nbsp;SELECT friend_id FROM friends<br />
              &nbsp;&nbsp;WHERE user_id = u1.id<br />
              )
            </div>
            <div className="mt-3 text-red-400">↑ 3 JOINs + subquery. Slow at scale.</div>
          </div>
          {internalStep >= 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-violet-500/40 rounded-xl p-5 font-mono text-xs">
              <div className="text-violet-400 font-bold mb-3">Cypher (Neo4j) — Same Query</div>
              <div className="text-gray-300 leading-relaxed">
                MATCH (ram:Person {'{'} name: "Ram" {'}'})<br />
                &nbsp;&nbsp;-[:KNOWS*2]-&gt;(fof)<br />
                WHERE NOT (ram)-[:KNOWS]-(fof)<br />
                RETURN fof.name
              </div>
              <div className="mt-3 text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> 4 lines. O(1) per hop. Milliseconds at 1M users.
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraphModelAnim;
