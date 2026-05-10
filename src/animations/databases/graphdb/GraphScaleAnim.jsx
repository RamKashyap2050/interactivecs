import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Server, Zap } from 'lucide-react';

const color = '#8b5cf6';

const GraphScaleAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);
  useEffect(() => { setInternalStep(0); }, [currentStep]);
  useEffect(() => {
    const maxes = [4, 3, 4, 3, 4, 4];
    const interval = setInterval(() => setInternalStep(p => p < maxes[currentStep] ? p + 1 : p), 1200);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Ring helpers for consistent hashing visual
  const RING = { cx: 200, cy: 180, r: 130 };
  const toXY = (pos) => ({
    x: RING.cx + RING.r * Math.cos((pos / 1000) * 2 * Math.PI - Math.PI / 2),
    y: RING.cy + RING.r * Math.sin((pos / 1000) * 2 * Math.PI - Math.PI / 2),
  });

  const shards = [
    { id: 'S1', pos: 100, color: '#06b6d4', label: 'Shard 1' },
    { id: 'S2', pos: 350, color: '#10b981', label: 'Shard 2' },
    { id: 'S3', pos: 600, color: '#f59e0b', label: 'Shard 3' },
    { id: 'S4', pos: 850, color: color, label: 'Shard 4' },
  ];

  const crossEdge = { from: { x: 150, y: 120 }, to: { x: 280, y: 250 }, label: 'Cross-shard edge!' };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] gap-6 font-source">

      {/* Step 0: The sharding problem */}
      {currentStep === 0 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">The Graph Sharding Problem</div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#0a1526] border border-green-900/40 rounded-xl p-5 font-mono text-xs">
              <div className="text-green-400 font-bold mb-3">SQL Sharding — Clean</div>
              <div className="flex flex-col gap-2">
                {['Shard by user_id', 'Each row is independent', 'Shard 1 ≠ need Shard 2', 'Cross-shard queries rare'].map((r, i) => (
                  <motion.div key={r} initial={{ opacity: 0 }} animate={internalStep >= i ? { opacity: 1 } : {}} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />{r}
                  </motion.div>
                ))}
              </div>
            </div>
            {internalStep >= 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-red-900/40 rounded-xl p-5 font-mono text-xs">
                <div className="text-red-400 font-bold mb-3">Graph Sharding — Hard</div>
                <div className="flex flex-col gap-2">
                  {['Edges connect any two nodes', 'Edge may cross shard boundary', 'Following it = network hop', 'Deep traversal = many hops', 'Graphs are connected by nature'].map((r, i) => (
                    <motion.div key={r} initial={{ opacity: 0 }} animate={internalStep >= 2 + i * 0.1 ? { opacity: 1 } : {}} className="flex items-center gap-2 text-gray-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />{r}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          {internalStep >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a1526] border border-violet-500/30 rounded-xl p-4 text-center font-mono text-xs text-violet-300">
              Fundamental tension: graphs are connected. Distributed systems require disconnection.<br />There is no perfect solution — only trade-offs.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 1: Cut Edges cost */}
      {currentStep === 1 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Cut Edges — The Cost</div>
          <svg width="420" height="280" className="mx-auto rounded-xl bg-[#050d1a] border border-gray-800">
            {/* Two shard boxes */}
            <rect x="20" y="40" width="170" height="200" rx="12" fill="#0a1526" stroke="#06b6d450" strokeWidth="2" />
            <text x="105" y="65" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle">Shard 1</text>
            <rect x="230" y="40" width="170" height="200" rx="12" fill="#0a1526" stroke="#10b98150" strokeWidth="2" />
            <text x="315" y="65" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">Shard 2</text>

            {/* Local edges */}
            {[[80, 120, 120, 160], [80, 180, 140, 200]].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5" />
            ))}
            {[[280, 120, 340, 160], [300, 190, 360, 200]].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5" />
            ))}

            {/* Local nodes */}
            {[[80,120],[120,160],[140,200]].map(([x,y],i) => (
              <g key={i}><circle cx={x} cy={y} r={14} fill="#0a1526" stroke="#06b6d4" strokeWidth="1.5" /><text x={x} y={y+1} fill="#06b6d4" fontSize="7" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">N{i+1}</text></g>
            ))}
            {[[280,120],[340,160],[360,200]].map(([x,y],i) => (
              <g key={i}><circle cx={x} cy={y} r={14} fill="#0a1526" stroke="#10b981" strokeWidth="1.5" /><text x={x} y={y+1} fill="#10b981" fontSize="7" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">N{i+4}</text></g>
            ))}

            {/* Cross-shard edge */}
            {internalStep >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={140} y1={200} x2={280} y2={120} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 3" />
                <text x={212} y={155} fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle">✕ cut edge</text>
              </motion.g>
            )}
          </svg>

          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-[#0a1526] border border-gray-800 rounded-xl p-4 text-center">
                <div className="text-gray-400 mb-1">Local edge traversal</div>
                <div className="text-green-400 text-2xl font-bold">1 ns</div>
                <div className="text-gray-600 text-[10px]">pointer dereference</div>
              </div>
              <div className="bg-[#0a1526] border border-red-900/30 rounded-xl p-4 text-center">
                <div className="text-gray-400 mb-1">Cross-shard edge</div>
                <div className="text-red-400 text-2xl font-bold">~1 ms</div>
                <div className="text-gray-600 text-[10px]">network roundtrip</div>
              </div>
            </motion.div>
          )}
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center font-mono text-xs text-red-400">
              1 million times slower. Depth-6 traversal with 50% cross-shard = ~3ms overhead vs nanoseconds local.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: Community Detection */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Community Detection Partitioning</div>
          <div className="flex gap-6 justify-center">
            {[
              { label: 'Random Partitioning', cut: 50, color: '#ef4444' },
              { label: 'Community-Based', cut: 12, color: '#10b981' },
            ].slice(0, internalStep >= 2 ? 2 : 1).map(s => (
              <motion.div key={s.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border rounded-xl p-5 text-center w-52" style={{ borderColor: s.color + '40' }}>
                <div className="font-mono text-xs mb-3" style={{ color: s.color }}>{s.label}</div>
                <div className="text-4xl font-space font-bold mb-1" style={{ color: s.color }}>{s.cut}%</div>
                <div className="font-mono text-xs text-gray-500">cross-shard edges</div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-3 font-mono text-xs">
            {[
              { step: 0, text: 'Run Louvain algorithm on the full graph', color: '#06b6d4' },
              { step: 1, text: 'Natural clusters emerge: friend groups, topic communities', color },
              { step: 2, text: 'Assign each cluster to a shard', color: '#10b981' },
              { step: 3, text: 'Cross-shard edges = only between communities (rare)', color: '#39ff14' },
              { step: 4, text: '70–90% of traversals stay local ↑ vs 50% random', color: '#f59e0b' },
            ].filter(r => internalStep >= r.step).map(r => (
              <motion.div key={r.step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 bg-[#0a1526] border border-gray-800 rounded-lg px-4 py-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                <span className="text-gray-300">{r.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Vertex Cut vs Edge Cut */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl grid grid-cols-2 gap-6">
          <div className="bg-[#0a1526] border border-amber-900/40 rounded-xl p-5 font-mono text-xs">
            <div className="text-amber-400 font-bold mb-3">Edge Cut</div>
            <div className="text-gray-400 leading-relaxed space-y-2">
              <div>Assign nodes to shards.</div>
              <div>Cut edges crossing shards.</div>
              <div>High-degree nodes (celebrities) → frequent cross-shard lookups.</div>
              <div>Simple. Predictable. But hot spots are painful.</div>
            </div>
          </div>
          {internalStep >= 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-violet-500/40 rounded-xl p-5 font-mono text-xs">
              <div className="text-violet-400 font-bold mb-3">Vertex Cut</div>
              <div className="text-gray-400 leading-relaxed space-y-2">
                <div>Duplicate high-degree nodes across shards.</div>
                <div>"Ram" (10K connections) → copied on all shards.</div>
                <div>Queries about Ram → resolved locally anywhere.</div>
                <div>More storage. Much faster for hubs.</div>
              </div>
              {internalStep >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-green-400 text-[10px]">
                  TigerGraph and PowerGraph use vertex-cut by default.
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Step 4: Native Scale Solutions */}
      {currentStep === 4 && (
        <div className="w-full max-w-4xl flex flex-col gap-5">
          <div className="font-space font-bold text-white text-xl text-center">Native Scale Solutions</div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Neo4j', desc: 'Vertical: one large server to ~100B edges. Handles 99% of real-world use cases.', color, step: 0 },
              { name: 'Neo4j Fabric', desc: 'Federated queries across multiple Neo4j databases. Cypher query: automatically routed to correct shard.', color: '#06b6d4', step: 1 },
              { name: 'Amazon Neptune', desc: 'Managed, auto-scales read replicas. Gremlin + SPARQL + openCypher. Serverless option.', color: '#10b981', step: 2 },
              { name: 'TigerGraph', desc: 'Purpose-built distributed graph. Parallel graph processing. 10B+ nodes with low-latency traversal.', color: '#f59e0b', step: 3 },
            ].map(s => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 15 }} animate={internalStep >= s.step ? { opacity: 1, y: 0 } : {}} className="bg-[#0a1526] border rounded-xl p-4 font-mono text-xs" style={{ borderColor: s.color + '40' }}>
                <div className="font-bold mb-2" style={{ color: s.color }}>{s.name}</div>
                <div className="text-gray-400">{s.desc}</div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 text-center font-mono text-xs text-violet-300">
              For 99% of applications: one well-tuned Neo4j server handles everything you'll ever need.<br />
              Distributed graph is a very specific, very hard problem — don't reach for it prematurely.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 5: Pregel / Graph Analytics at Scale */}
      {currentStep === 5 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Graph Analytics at Scale — Pregel Model</div>
          <div className="bg-[#0a1526] border border-gray-800 rounded-xl p-5 font-mono text-xs">
            <div className="text-violet-400 font-bold mb-3">Pregel Vertex Program (per vertex, per iteration):</div>
            <div className="text-gray-300 leading-relaxed">
              <div className="text-amber-400">function compute(vertex, messages):</div>
              <div className="ml-4">// 1. Receive messages from neighbors</div>
              <div className="ml-4 text-cyan-400">new_rank = 0.15 + 0.85 * sum(messages)</div>
              <div className="ml-4">// 2. Compute new value</div>
              <div className="ml-4 text-green-400">vertex.pagerank = new_rank</div>
              <div className="ml-4">// 3. Send messages to neighbors</div>
              <div className="ml-4 text-violet-400">send(new_rank / degree(vertex)) to each neighbor</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            {['Iteration 1', 'Iteration 2', 'Iteration 3', '...Converge'].slice(0, internalStep + 1).map((iter, i) => (
              <motion.div key={iter} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="bg-[#0a1526] border border-gray-800 rounded-xl p-3 text-center w-28">
                <div className="font-mono text-[10px] text-gray-500 mb-2">{iter}</div>
                <div className="flex flex-col gap-1">
                  {[{ n: 'Ram', r: [0.25, 0.52, 0.78, 0.85][i] }, { n: 'Varsha', r: [0.25, 0.38, 0.43, 0.42][i] }].map(n => (
                    <div key={n.n} className="flex justify-between font-mono text-[9px]">
                      <span className="text-gray-600">{n.n}</span>
                      <span style={{ color: i >= 3 ? '#39ff14' : color }}>{n.r.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a1526] border border-gray-800 rounded-xl p-4 text-center font-mono text-xs text-gray-400">
              Apache Spark GraphX runs Pregel across a cluster. 1B-node PageRank: ~10 iterations, each a distributed message-passing wave.<br />
              <span className="text-violet-400">The adjacency matrix math from Chapter 2 — this is how it runs at planetary scale.</span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraphScaleAnim;
