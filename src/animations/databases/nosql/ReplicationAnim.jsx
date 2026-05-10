import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, ServerCrash, Zap, ShieldCheck, AlertTriangle, GitMerge, CheckCircle2 } from 'lucide-react';

const ReplicationAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => { setInternalStep(0); }, [currentStep]);

  useEffect(() => {
    const maxSteps = [3, 4, 3, 3, 4, 3, 4];
    let interval;
    if (currentStep <= 6) {
      interval = setInterval(() => setInternalStep(p => p < maxSteps[currentStep] ? p + 1 : p), 1400);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const color = '#06b6d4';

  const NodeBox = ({ label, isPrimary, isDead, isNew, children, style }) => (
    <motion.div
      animate={isDead ? { opacity: 0.3, scale: 0.95 } : { opacity: 1, scale: 1 }}
      className={`bg-[#0a1526] border rounded-xl p-4 flex flex-col items-center gap-2 ${isPrimary ? 'ring-2' : ''}`}
      style={{ borderColor: isDead ? '#ef4444' : isNew ? '#39ff14' : isPrimary ? color : '#374151', ringColor: isPrimary ? color : 'transparent', ...style }}
    >
      {isDead ? <ServerCrash className="w-10 h-10 text-red-400" /> : <Server className="w-10 h-10" style={{ color: isPrimary ? color : '#6b7280' }} />}
      <div className="font-space font-bold text-sm text-white">{label}</div>
      {isPrimary && !isDead && <div className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRIMARY</div>}
      {isNew && <div className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">NEW PRIMARY</div>}
      {children}
    </motion.div>
  );

  const StreamArrow = ({ from, label, color: c = '#374151' }) => (
    <div className="flex flex-col items-center gap-1">
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-8 h-0.5 rounded" style={{ backgroundColor: c }} />
      {label && <div className="text-[9px] font-mono text-gray-600">{label}</div>}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] font-source gap-6">

      {/* Step 0: Single point of failure */}
      {currentStep === 0 && (
        <div className="w-full max-w-2xl flex flex-col items-center gap-8">
          <div className="font-space font-bold text-white text-xl text-center">Single Node — Single Point of Failure</div>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-16 justify-center">
              {['App', 'App', 'App'].map((a, i) => (
                <div key={i} className="bg-[#0a1526] border border-gray-700 rounded-lg px-4 py-2 font-mono text-xs text-gray-300">{a}</div>
              ))}
            </div>
            <div className="flex gap-16 justify-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-px h-8 bg-gray-700" />
              ))}
            </div>

            <motion.div
              animate={internalStep >= 2 ? { boxShadow: '0 0 40px rgba(239,68,68,0.5)', borderColor: '#ef4444' } : { borderColor: color }}
              className="bg-[#0a1526] border-2 rounded-xl p-6 flex flex-col items-center gap-3 w-40"
            >
              {internalStep >= 2 ? <ServerCrash className="w-12 h-12 text-red-400 animate-pulse" /> : <Server className="w-12 h-12 text-cyan-400" />}
              <div className="font-space font-bold text-white text-sm">Database</div>
              {internalStep >= 2 && <div className="font-mono text-xs text-red-400">DEAD ✕</div>}
            </motion.div>

            {internalStep >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-center w-full">
                <div className="text-red-400 font-space font-bold text-lg">500 Internal Server Error</div>
                <div className="text-gray-400 font-mono text-xs mt-2">All data inaccessible. Recovery from backup: <span className="text-red-400">4 hours.</span></div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Primary-Replica */}
      {currentStep === 1 && (
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <div className="font-space font-bold text-white text-xl text-center">Primary-Replica Replication</div>
          <div className="flex items-center justify-center gap-6">
            <NodeBox label="Replica 1" isPrimary={false}>
              <div className="font-mono text-[10px] text-gray-500">Read only</div>
              {internalStep >= 2 && <div className="text-[10px] text-green-400 font-mono">33% reads</div>}
            </NodeBox>

            <div className="flex flex-col items-center gap-4">
              {internalStep >= 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 font-mono text-xs text-amber-400">
                  <div className="flex items-center gap-1">Write →</div>
                </motion.div>
              )}
              <NodeBox label="Primary" isPrimary={true}>
                <div className="font-mono text-[10px] text-gray-500">Writes + reads</div>
                {internalStep >= 2 && <div className="text-[10px] text-cyan-400 font-mono">33% reads</div>}
              </NodeBox>
              {internalStep >= 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1">
                  {['Replica 1', 'Replica 2'].map(r => (
                    <div key={r} className="flex items-center gap-2 font-mono text-[10px] text-gray-500">
                      <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-0.5 bg-cyan-500 rounded" />
                      → {r}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <NodeBox label="Replica 2" isPrimary={false}>
              <div className="font-mono text-[10px] text-gray-500">Read only</div>
              {internalStep >= 2 && <div className="text-[10px] text-green-400 font-mono">33% reads</div>}
            </NodeBox>
          </div>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 text-center font-mono text-xs text-cyan-300">
              3× read capacity. Write bottleneck remains at Primary. Read scalability = add more replicas.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: Automatic Failover */}
      {currentStep === 2 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Automatic Failover (~30 seconds)</div>
          <div className="flex items-center justify-center gap-8">
            <NodeBox label="Primary" isPrimary={false} isDead={internalStep >= 1}>
              {internalStep >= 1 && <div className="text-xs text-red-400 font-mono">No heartbeat</div>}
            </NodeBox>

            <div className="flex flex-col gap-4">
              <NodeBox label="Replica 1" isPrimary={internalStep >= 2} isNew={internalStep >= 2}>
                {internalStep >= 2 && <div className="text-[10px] text-green-400 font-mono">Promoted ✓</div>}
              </NodeBox>
              <NodeBox label="Replica 2" isPrimary={false}>
                {internalStep >= 3 && <div className="text-[10px] text-cyan-400 font-mono">Replicates from new primary</div>}
              </NodeBox>
            </div>
          </div>
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center font-mono text-xs text-green-400">
              Failover complete. Downtime: ~30 seconds. Without replication: ~4 hours recovery.
            </motion.div>
          )}
        </div>
      )}

      {/* Step 3: Replication Lag */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Replication Lag — Stale Reads</div>
          <div className="flex items-start justify-center gap-6 relative">
            <div className="flex flex-col items-center gap-3">
              <NodeBox label="Primary" isPrimary={true}>
                <div className="font-mono text-[10px] text-green-400">name = "Ram K."</div>
                {internalStep >= 1 && <div className="font-mono text-[10px] text-amber-400 animate-pulse">Write: name = "Ram"</div>}
              </NodeBox>
            </div>

            <div className="flex flex-col items-center justify-center mt-12">
              {internalStep >= 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1">
                  <motion.div animate={{ x: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="font-mono text-[10px] text-cyan-500">streaming →</motion.div>
                  <div className="font-mono text-[10px] text-gray-600">~200ms lag</div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <NodeBox label="Replica" isPrimary={false}>
                <div className={`font-mono text-[10px] ${internalStep >= 2 ? 'text-red-400' : 'text-gray-500'}`}>
                  {internalStep >= 2 ? '⚠ reads "Ram K." (stale!)' : 'waiting for replication'}
                </div>
                {internalStep >= 3 && <div className="font-mono text-[10px] text-green-400">Eventually: "Ram" ✓</div>}
              </NodeBox>
            </div>
          </div>
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 font-mono text-xs text-center">
              <span className="text-amber-400 font-bold">Eventual Consistency</span>
              <span className="text-gray-400"> — eventually all replicas converge. Not immediately. Your app must handle stale reads.</span>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 4: Cassandra Replication Factor */}
      {currentStep === 4 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Cassandra Replication Factor (RF=3)</div>
          <div className="flex gap-4 justify-center flex-wrap">
            {[
              { id: 'Node A (pos 300)', primary: true, color: color, alive: internalStep < 3 },
              { id: 'Node B (pos 500)', primary: false, color: '#10b981', alive: internalStep < 4 },
              { id: 'Node C (pos 700)', primary: false, color: '#8b5cf6', alive: true },
              { id: 'Node D (pos 900)', primary: false, color: '#f59e0b', alive: true },
            ].map((n, i) => (
              <motion.div
                key={n.id}
                animate={!n.alive ? { opacity: 0.3 } : { opacity: 1 }}
                className="bg-[#0a1526] border rounded-xl p-4 text-center w-40"
                style={{ borderColor: n.alive ? (n.color + '60') : '#ef444440' }}
              >
                {n.alive ? <Server className="w-8 h-8 mx-auto mb-2" style={{ color: n.color }} /> : <ServerCrash className="w-8 h-8 mx-auto mb-2 text-red-400" />}
                <div className="font-mono text-[9px] text-gray-400">{n.id}</div>
                {internalStep >= 1 && n.alive && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-mono text-green-400 mt-1">has copy ✓</motion.div>
                )}
                {!n.alive && <div className="text-[10px] font-mono text-red-400 mt-1">DEAD ✕</div>}
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { rf: 'RF=3, QUORUM', result: '1 failure → still available', color: '#10b981' },
              { rf: 'RF=3, QUORUM', result: '2 failures → unavailable', color: '#ef4444' },
              { rf: 'RF=5, QUORUM', result: '2 failures → still available', color: '#10b981' },
            ].map(r => (
              <div key={r.rf + r.result} className="bg-[#0a1526] border border-gray-800 rounded-xl p-3 text-center font-mono text-xs">
                <div className="text-gray-400 mb-1">{r.rf}</div>
                <div style={{ color: r.color }}>{r.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: CAP Theorem */}
      {currentStep === 5 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">CAP Theorem</div>
          <div className="flex gap-8 justify-center items-start">
            {/* Triangle SVG */}
            <svg width="260" height="240" className="shrink-0">
              <polygon points="130,20 20,220 240,220" fill="none" stroke="#374151" strokeWidth="2" />
              {/* Labels */}
              <text x="130" y="14" fill="#06b6d4" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">C</text>
              <text x="130" y="26" fill="#6b7280" fontSize="8" fontFamily="monospace" textAnchor="middle">Consistency</text>
              <text x="10" y="232" fill="#10b981" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A</text>
              <text x="10" y="244" fill="#6b7280" fontSize="8" fontFamily="monospace" textAnchor="middle">Availability</text>
              <text x="252" y="232" fill="#8b5cf6" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">P</text>
              <text x="252" y="244" fill="#6b7280" fontSize="8" fontFamily="monospace" textAnchor="middle">Partition</text>

              {/* CP highlight */}
              {internalStep >= 1 && (
                <g>
                  <line x1="130" y1="20" x2="240" y2="220" stroke="#06b6d4" strokeWidth="3" opacity="0.6" />
                  <text x="205" y="120" fill="#06b6d4" fontSize="8" fontFamily="monospace">CP</text>
                </g>
              )}
              {/* AP highlight */}
              {internalStep >= 2 && (
                <g>
                  <line x1="20" y1="220" x2="240" y2="220" stroke="#10b981" strokeWidth="3" opacity="0.6" />
                  <text x="125" y="240" fill="#10b981" fontSize="8" fontFamily="monospace">AP</text>
                </g>
              )}
              {/* CA X */}
              {internalStep >= 3 && (
                <g>
                  <line x1="130" y1="20" x2="20" y2="220" stroke="#ef4444" strokeWidth="3" opacity="0.4" strokeDasharray="6 3" />
                  <text x="55" y="115" fill="#ef4444" fontSize="8" fontFamily="monospace">CA ✕</text>
                </g>
              )}
            </svg>

            <div className="flex flex-col gap-4">
              {internalStep >= 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-cyan-500/40 rounded-xl p-4 font-mono text-xs">
                  <div className="text-cyan-400 font-bold mb-1">CP — Consistency + Partition</div>
                  <div className="text-gray-300">During partition: reject writes to disconnected nodes. Consistent but less available.</div>
                  <div className="text-gray-500 mt-1">HBase, ZooKeeper, CockroachDB</div>
                </motion.div>
              )}
              {internalStep >= 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-green-500/40 rounded-xl p-4 font-mono text-xs">
                  <div className="text-green-400 font-bold mb-1">AP — Availability + Partition</div>
                  <div className="text-gray-300">During partition: accept writes to both sides. Available but divergent.</div>
                  <div className="text-gray-500 mt-1">Cassandra, DynamoDB, CouchDB</div>
                </motion.div>
              )}
              {internalStep >= 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-red-500/40 rounded-xl p-4 font-mono text-xs">
                  <div className="text-red-400 font-bold mb-1">CA — Impossible in distributed systems</div>
                  <div className="text-gray-300">Networks always can partition. CA is theoretical only.</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Conflict Resolution */}
      {currentStep === 6 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="font-space font-bold text-white text-xl text-center">Conflict Resolution</div>
          <div className="flex gap-4 justify-center font-mono text-xs">
            <div className="bg-[#0a1526] border border-gray-700 rounded-xl p-4 w-44 text-center">
              <div className="text-blue-400 mb-2 font-bold">Region A</div>
              <div className="text-gray-300">name = "Ram K"</div>
              <div className="text-gray-600 text-[9px] mt-1">t=1000ms</div>
            </div>
            {internalStep >= 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
                <div className="font-bold text-amber-400 text-xs">partition<br />healed</div>
              </motion.div>
            )}
            <div className="bg-[#0a1526] border border-gray-700 rounded-xl p-4 w-44 text-center">
              <div className="text-purple-400 mb-2 font-bold">Region B</div>
              <div className="text-gray-300">name = "Ram Kashyap"</div>
              <div className="text-gray-600 text-[9px] mt-1">t=1050ms</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: 'Last Write Wins',
                desc: 'Compare timestamps. Region B (t=1050ms) wins. "Ram Kashyap" kept. "Ram K" discarded.',
                warn: 'Risk: clock skew causes wrong winner',
                color: '#f59e0b',
                show: internalStep >= 1,
              },
              {
                title: 'Vector Clocks',
                desc: 'Each write tagged with version vector. Conflict detected. Application decides which wins.',
                warn: 'More correct, more complex',
                color: color,
                show: internalStep >= 2,
              },
              {
                title: 'CRDTs',
                desc: 'Math-based merge. Commutative + associative. Both values merged deterministically. No conflict possible.',
                warn: 'Amazon cart: items added, never lost during partition',
                color: '#10b981',
                show: internalStep >= 3,
              },
            ].map(s => s.show ? (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a1526] border rounded-xl p-4 font-mono text-xs" style={{ borderColor: s.color + '40' }}>
                <div className="font-bold mb-2" style={{ color: s.color }}>{s.title}</div>
                <div className="text-gray-300 mb-2 leading-relaxed">{s.desc}</div>
                <div className="text-gray-500 text-[10px] italic">{s.warn}</div>
              </motion.div>
            ) : <div key={s.title} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplicationAnim;
