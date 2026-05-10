import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, AlertTriangle, Zap, ArrowRight } from 'lucide-react';

const ShardingAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => { setInternalStep(0); }, [currentStep]);

  useEffect(() => {
    const maxSteps = [4, 3, 2, 5, 4, 4, 3];
    let interval;
    if (currentStep <= 6) {
      interval = setInterval(() => setInternalStep(p => p < maxSteps[currentStep] ? p + 1 : p), 1200);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const color = '#06b6d4';

  // Consistent hash ring helpers
  const RING_CX = 200, RING_CY = 200, RING_R = 140;
  const toXY = (pos, r = RING_R) => ({
    x: RING_CX + r * Math.cos((pos / 1000) * 2 * Math.PI - Math.PI / 2),
    y: RING_CY + r * Math.sin((pos / 1000) * 2 * Math.PI - Math.PI / 2),
  });

  const physicalServers = [
    { id: 'A', pos: 100, color: color, label: 'Node A' },
    { id: 'B', pos: 300, color: '#10b981', label: 'Node B' },
    { id: 'C', pos: 500, color: '#8b5cf6', label: 'Node C' },
    { id: 'D', pos: 700, color: '#f59e0b', label: 'Node D' },
  ];

  const serverE = { id: 'E', pos: 250, color: '#ef4444', label: 'Node E (new)' };

  const virtualNodes = [
    { server: 'A', positions: [50, 200, 600], color: color },
    { server: 'B', positions: [120, 350, 750], color: '#10b981' },
    { server: 'C', positions: [280, 500, 900], color: '#8b5cf6' },
  ];

  const dataPoints = [
    { hash: 150, label: 'User A', assignedTo: 'B', pos: 150 },
    { hash: 450, label: 'User B', assignedTo: 'C', pos: 450 },
    { hash: 650, label: 'User C', assignedTo: 'D', pos: 650 },
    { hash: 800, label: 'User D', assignedTo: 'A', pos: 800 },
  ];

  const RingViz = ({ servers, extras = [], highlightedDataIdx = -1, showData = false, deadServer = null }) => (
    <svg width="400" height="400" className="mx-auto">
      {/* Ring */}
      <circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="#1f2937" strokeWidth="2" />

      {/* Data arcs */}
      {showData && dataPoints.slice(0, Math.min(internalStep + 1, 4)).map((dp, i) => {
        const { x, y } = toXY(dp.pos);
        return (
          <g key={dp.label}>
            <circle cx={x} cy={y} r={5} fill="#f59e0b" stroke="#fff" strokeWidth="1.5" opacity={0.8} />
            <text x={x + 8} y={y + 4} fill="#f59e0b" fontSize="8" fontFamily="monospace">{dp.label}</text>
          </g>
        );
      })}

      {/* Server nodes */}
      {[...servers, ...extras].map(s => {
        if (deadServer && s.id === deadServer) return null;
        const { x, y } = toXY(s.pos);
        return (
          <g key={s.id}>
            <circle cx={x} cy={y} r={18} fill="#0a1526" stroke={s.color} strokeWidth="2" />
            <text x={x} y={y + 1} fill={s.color} fontSize="9" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">{s.label || s.id}</text>
          </g>
        );
      })}

      {/* Dead server X */}
      {deadServer && (() => {
        const dead = servers.find(s => s.id === deadServer);
        if (!dead) return null;
        const { x, y } = toXY(dead.pos);
        return (
          <g>
            <circle cx={x} cy={y} r={18} fill="#0a1526" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" opacity={0.4} />
            <text x={x} y={y + 1} fill="#ef4444" fontSize="14" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">✕</text>
          </g>
        );
      })()}

      {/* Center label */}
      <text x={RING_CX} y={RING_CY - 10} fill="#6b7280" fontSize="10" fontFamily="monospace" textAnchor="middle">0 ──── 2³²</text>
      <text x={RING_CX} y={RING_CY + 10} fill="#6b7280" fontSize="8" fontFamily="monospace" textAnchor="middle">Consistent Hash Ring</text>
    </svg>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] font-source gap-6">

      {/* Step 0: Vertical Ceiling */}
      {currentStep === 0 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">The Vertical Ceiling</div>
          <div className="flex gap-8 items-end justify-center">
            <motion.div
              animate={{ width: 80 + internalStep * 40, height: 80 + internalStep * 40 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`flex flex-col items-center justify-center border-2 rounded-xl ${internalStep >= 4 ? 'border-red-500 bg-red-500/10' : 'border-cyan-500 bg-cyan-500/10'} relative`}
            >
              <Server className={`w-8 h-8 ${internalStep >= 4 ? 'text-red-400' : 'text-cyan-400'}`} />
              <div className="font-mono text-[10px] text-white mt-1">{['4 vCPU', '8 vCPU', '32 vCPU', '64 vCPU', '448 vCPU'][internalStep]}</div>
            </motion.div>
            <div className="flex flex-col gap-2 w-48">
              {[
                { label: 'CPU', val: [40, 60, 75, 90, 100][internalStep], danger: internalStep >= 3 },
                { label: 'RAM', val: [30, 55, 70, 88, 98][internalStep], danger: internalStep >= 3 },
                { label: 'Cost/mo', val: ['$200', '$800', '$4.5K', '$25K', '$109K/hr'][internalStep], text: true },
              ].map(m => (
                <div key={m.label} className="bg-[#0a1526] border border-gray-800 rounded-lg p-2">
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-gray-500">{m.label}</span>
                    <span className={m.danger ? 'text-red-400' : 'text-white'}>{m.text ? m.val : `${m.val}%`}</span>
                  </div>
                  {!m.text && (
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${m.val}%` }} className={`h-full rounded-full ${m.danger ? 'bg-red-500' : 'bg-cyan-500'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {internalStep >= 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-center font-space font-bold text-red-400 text-lg">
              Physics Ceiling Reached — Vertical Scaling Ends Here
            </motion.div>
          )}
        </div>
      )}

      {/* Step 1: Range-based sharding */}
      {currentStep === 1 && (
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">Range-Based Sharding</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Shard 1', range: '1 – 25M', server: 'Server 1', color: color },
              { label: 'Shard 2', range: '25M – 50M', server: 'Server 2', color: '#10b981' },
              { label: 'Shard 3', range: '50M – 75M', server: 'Server 3', color: '#8b5cf6' },
              { label: 'Shard 4', range: '75M – 100M', server: 'Server 4', color: '#f59e0b' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={internalStep >= i ? { opacity: 1, y: 0 } : {}}
                className="bg-[#0a1526] border rounded-xl p-4 text-center"
                style={{ borderColor: s.color + '50' }}
              >
                <div className="font-space font-bold text-white mb-1">{s.label}</div>
                <div className="font-mono text-[10px] mb-3" style={{ color: s.color }}>{s.range}</div>
                <Server className="w-8 h-8 mx-auto" style={{ color: s.color }} />
                <div className="font-mono text-[10px] text-gray-500 mt-1">{s.server}</div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3 font-mono text-sm">
              <div className="bg-[#050d1a] border border-gray-700 rounded-lg px-4 py-2 text-amber-400">user_id = 42,000,000</div>
              <ArrowRight className="text-gray-500" />
              <div className="bg-[#050d1a] border border-green-500 rounded-lg px-4 py-2 text-green-400">→ Shard 2 directly</div>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: Hot shard problem */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">The Hot Shard Problem</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Shard 1', pct: 80, status: 'OVERLOADED', color: '#ef4444' },
              { label: 'Shard 2', pct: 15, status: 'Normal', color: '#10b981' },
              { label: 'Shard 3', pct: 4, status: 'Idle', color: '#6b7280' },
              { label: 'Shard 4', pct: 1, status: 'Sleeping', color: '#374151' },
            ].map((s, i) => (
              <motion.div
                key={i}
                animate={internalStep >= 1 ? {} : { opacity: 0.4 }}
                className="bg-[#0a1526] border rounded-xl p-4 text-center"
                style={{ borderColor: s.color + '60' }}
              >
                <div className="font-space font-bold text-white mb-2">{s.label}</div>
                <div className="h-32 bg-gray-800 rounded-lg overflow-hidden flex items-end relative mb-2">
                  <motion.div
                    animate={{ height: `${s.pct}%` }}
                    transition={{ duration: 1, type: 'spring' }}
                    className="w-full rounded-t-sm"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
                <div className="font-mono text-xs mb-1" style={{ color: s.color }}>{s.pct}% traffic</div>
                <div className="font-mono text-[10px] text-gray-500">{s.status}</div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-4 text-center font-mono text-sm text-amber-400 flex items-center gap-3 justify-center">
              <AlertTriangle className="w-5 h-5" />
              Old users (low IDs) are more active. Range-based sharding = inherently uneven distribution.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 3: Consistent Hashing Ring */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl flex gap-8 items-center">
          <div className="flex-shrink-0">
            <RingViz servers={physicalServers} showData={internalStep >= 2} />
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="font-space font-bold text-white text-lg">Consistent Hashing</div>
            <div className="flex flex-col gap-2">
              {[
                { step: 0, text: 'Ring spans 0 to 2³²' },
                { step: 1, text: '4 server nodes placed at hash positions' },
                { step: 2, text: 'Data: hash(user_id) → position on ring' },
                { step: 3, text: 'Assign to nearest server clockwise' },
                { step: 4, text: 'Distribution: roughly equal across nodes' },
                { step: 5, text: 'Node A: serves hash 700–100 (wraps around)' },
              ].map(item => (
                <motion.div
                  key={item.step}
                  animate={internalStep >= item.step ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  className="flex items-start gap-2 font-mono text-xs text-gray-300"
                >
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/50 shrink-0 mt-0.5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Add/Remove Servers */}
      {currentStep === 4 && (
        <div className="w-full max-w-4xl flex gap-8 items-center">
          <div className="flex-shrink-0">
            <RingViz
              servers={physicalServers}
              extras={internalStep >= 2 ? [serverE] : []}
              deadServer={internalStep >= 4 ? 'C' : null}
            />
          </div>
          <div className="flex flex-col gap-5 flex-1">
            <div className="font-space font-bold text-white text-lg">Server Add / Remove</div>
            {internalStep >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 font-mono text-xs">
                <div className="text-green-400 font-bold mb-2">ADD Node E (pos 250):</div>
                <div className="text-gray-300">Only data between 100–250 migrates from B → E</div>
                <div className="text-green-400 mt-1">Other shards untouched ✓</div>
              </motion.div>
            )}
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 font-mono text-xs">
                <div className="text-red-400 font-bold mb-2">REMOVE Node C (fails):</div>
                <div className="text-gray-300">Only Node D absorbs C's data range</div>
                <div className="text-red-400 mt-1">Traditional: all shards re-balance</div>
                <div className="text-green-400">Consistent hashing: only 1/N impacted ✓</div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 5: Virtual Nodes */}
      {currentStep === 5 && (
        <div className="w-full max-w-4xl flex gap-8 items-center">
          <div className="flex-shrink-0">
            <svg width="400" height="400" className="mx-auto">
              <circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="#1f2937" strokeWidth="2" />
              {virtualNodes.map(vn =>
                vn.positions.slice(0, internalStep >= 1 ? vn.positions.length : 1).map((pos, pi) => {
                  const { x, y } = toXY(pos);
                  return (
                    <g key={`${vn.server}-${pi}`}>
                      <motion.circle initial={{ r: 0 }} animate={{ r: 10 }} cx={x} cy={y} fill="#0a1526" stroke={vn.color} strokeWidth="2" />
                      <text x={x} y={y + 1} fill={vn.color} fontSize="7" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">{vn.server}</text>
                    </g>
                  );
                })
              )}
              <text x={RING_CX} y={RING_CY} fill="#6b7280" fontSize="9" fontFamily="monospace" textAnchor="middle">Virtual Nodes</text>
            </svg>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="font-space font-bold text-white text-lg">Virtual Nodes</div>
            {virtualNodes.map((vn, i) => (
              <motion.div
                key={vn.server}
                animate={internalStep >= i ? { opacity: 1 } : { opacity: 0 }}
                className="bg-[#0a1526] border rounded-xl p-3 font-mono text-xs"
                style={{ borderColor: vn.color + '40' }}
              >
                <span style={{ color: vn.color }}>Node {vn.server}</span>
                <span className="text-gray-500 ml-2">positions: {vn.positions.join(', ')}</span>
              </motion.div>
            ))}
            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 font-mono text-xs text-gray-300">
                Powerful servers → more virtual nodes → more data → more load.<br />
                <span className="text-cyan-400">Cassandra default: 256 vnodes per server.</span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 6: Cross-shard queries */}
      {currentStep === 6 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">Cross-Shard Queries — The Cost</div>
          <div className="bg-[#050d1a] border border-gray-700 rounded-xl p-4 font-mono text-sm text-amber-400 text-center">
            SELECT * FROM users WHERE city = 'Toronto';
          </div>
          <div className="grid grid-cols-4 gap-3">
            {physicalServers.map((s, i) => (
              <motion.div
                key={s.id}
                animate={internalStep >= 1 ? { borderColor: s.color, opacity: 1 } : { opacity: 0.3 }}
                className="bg-[#0a1526] border border-gray-700 rounded-xl p-4 text-center"
              >
                <Server className="w-8 h-8 mx-auto mb-2" style={{ color: s.color }} />
                <div className="font-mono text-xs text-white mb-1">Node {s.id}</div>
                {internalStep >= 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] text-amber-400">Queried ↑</motion.div>
                )}
              </motion.div>
            ))}
          </div>
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-6 font-mono text-sm">
              <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-center">
                <div className="text-red-400 font-bold text-2xl">4×</div>
                <div className="text-gray-400 text-xs mt-1">queries executed</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-4 text-center">
                <div className="text-amber-400 font-bold text-2xl">4×</div>
                <div className="text-gray-400 text-xs mt-1">latency multiplied</div>
              </div>
              <div className="bg-[#0a1526] border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-cyan-400 font-bold text-sm">Shard key matters</div>
                <div className="text-gray-400 text-[10px] mt-1">If shard key = city,<br />this would be O(1)</div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShardingAnim;
