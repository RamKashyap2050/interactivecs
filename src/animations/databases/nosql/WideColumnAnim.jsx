import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Cpu, Database, ArrowDown, Zap, CheckCircle2 } from 'lucide-react';

const WideColumnAnim = ({ currentStep }) => {
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => { setInternalStep(0); }, [currentStep]);

  useEffect(() => {
    let interval;
    if (currentStep === 0) {
      interval = setInterval(() => setInternalStep(p => p < 3 ? p + 1 : p), 1200);
    } else if (currentStep === 1 || currentStep === 2) {
      interval = setInterval(() => setInternalStep(p => p < 4 ? p + 1 : p), 1000);
    } else if (currentStep === 3) {
      interval = setInterval(() => setInternalStep(p => p < 5 ? p + 1 : p), 1000);
    } else if (currentStep === 4) {
      interval = setInterval(() => setInternalStep(p => p < 4 ? p + 1 : p), 1200);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const color = '#06b6d4';

  const cassandraRows = [
    { key: 'user:1', cols: ['col_A', 'col_B', 'col_C'] },
    { key: 'user:2', cols: ['col_A', 'col_D', 'col_E', 'col_F'] },
    { key: 'user:3', cols: ['col_B', 'col_C'] },
  ];

  const sqlCols = ['id', 'name', 'email', 'phone', 'address', 'bio', 'avatar'];

  const nodes = [
    { id: 'A', pos: { x: 50, y: 15 }, color: '#06b6d4', data: 'user_id 1-33M' },
    { id: 'B', pos: { x: 85, y: 50 }, color: '#10b981', data: 'user_id 34-66M' },
    { id: 'C', pos: { x: 50, y: 85 }, color: '#8b5cf6', data: 'user_id 67-100M' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#020611] font-source gap-6">

      {/* Step 0: Wide-column vs SQL */}
      {currentStep === 0 && (
        <div className="w-full max-w-5xl flex flex-col gap-8">
          <div className="text-center font-space font-bold text-white text-xl">Fixed Columns (SQL) vs Sparse Rows (Cassandra)</div>

          {/* SQL table */}
          <div>
            <div className="text-xs font-mono text-red-400 mb-2 uppercase tracking-widest">SQL — fixed schema, NULL waste</div>
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0a1526]">
              <table className="w-full text-xs font-mono">
                <thead className="bg-[#050d1a] border-b border-gray-800">
                  <tr>{sqlCols.map(c => <th key={c} className="px-3 py-2 text-left text-gray-500 border-r border-gray-800 last:border-0">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    ['1', 'Ram', 'r@m.com', '647-...', '23 Main St', 'Engineer', '/r.png'],
                    ['2', 'Varsha', 'v@m.com', 'NULL', 'NULL', 'NULL', 'NULL'],
                    ['3', 'Bob', 'b@m.com', '416-...', 'NULL', 'NULL', 'NULL'],
                  ].map((row, ri) => (
                    <tr key={ri} className="border-b border-gray-800/50 last:border-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className={`px-3 py-2 border-r border-gray-800 last:border-0 ${cell === 'NULL' ? 'text-gray-700 italic' : 'text-white'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs font-mono text-gray-600 mt-2">↑ 6 NULL values wasting storage — every row must have all columns</div>
          </div>

          {/* Cassandra table */}
          {internalStep >= 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-xs font-mono text-cyan-400 mb-2 uppercase tracking-widest">Cassandra — wide column, sparse rows</div>
              <div className="flex flex-col gap-2">
                {cassandraRows.slice(0, internalStep >= 2 ? 3 : 1).map((row, ri) => (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ri * 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <div className="bg-[#050d1a] border border-cyan-500/50 rounded-lg px-3 py-2 font-mono text-xs text-cyan-400 w-20 shrink-0">{row.key}</div>
                    <div className="flex gap-1 flex-wrap">
                      {row.cols.map(col => (
                        <div key={col} className="bg-[#0a1526] border border-gray-700 rounded px-2 py-1 font-mono text-[10px] text-white">{col}</div>
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-gray-600 ml-2">only {row.cols.length} cols — no NULL waste</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 1: Partition Key */}
      {currentStep === 1 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">Partition Key — Data Placement</div>
          <div className="bg-[#0a1526] border border-gray-800 rounded-xl p-4 font-mono text-xs text-center text-cyan-400">
            hash(partition_key) → determines which node stores this row
          </div>
          <div className="flex gap-4 justify-center">
            {nodes.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={internalStep >= i ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.2, type: 'spring' }}
                className="flex flex-col items-center bg-[#0a1526] rounded-xl p-5 border"
                style={{ borderColor: node.color + '60' }}
              >
                <Database className="w-10 h-10 mb-3" style={{ color: node.color }} />
                <div className="font-space font-bold text-white mb-1">Node {node.id}</div>
                <div className="font-mono text-[10px] text-gray-400 text-center">{node.data}</div>
              </motion.div>
            ))}
          </div>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-4 font-mono text-sm">
              <div className="bg-[#050d1a] border border-gray-700 rounded-lg px-4 py-2 text-cyan-400">Query: user_id = 5</div>
              <div className="text-gray-500">→</div>
              <div className="bg-[#050d1a] border border-cyan-500 rounded-lg px-4 py-2 text-white">hash(5) → Node A</div>
              <div className="text-gray-500">→</div>
              <div className="bg-[#050d1a] border border-green-500 rounded-lg px-4 py-2 text-green-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Direct. No scatter.</div>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: Query-first design */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">Design Table Around Queries</div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#0a1526] border border-red-900/40 rounded-xl p-5">
              <div className="text-red-400 font-mono text-xs uppercase mb-3">SQL approach (normalize first)</div>
              <div className="font-mono text-xs text-gray-400 space-y-1">
                <div>1. Design normalized tables</div>
                <div>2. Add indexes later</div>
                <div>3. Query adapts to schema</div>
                <div className="text-red-400 mt-2">Result: JOINs everywhere, slow for complex queries</div>
              </div>
            </div>
            {internalStep >= 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a1526] border border-cyan-500/40 rounded-xl p-5">
                <div className="text-cyan-400 font-mono text-xs uppercase mb-3">Cassandra approach (query first)</div>
                <div className="font-mono text-xs text-gray-400 space-y-1">
                  <div>1. Define query: "Get user messages by date"</div>
                  <div>2. partition_key = user_id</div>
                  <div>3. clustering_key = timestamp DESC</div>
                  <div className="text-cyan-400 mt-2">Result: query is the table — O(1) partition lookup</div>
                </div>
              </motion.div>
            )}
          </div>
          {internalStep >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#050d1a] border border-gray-700 rounded-xl p-4 font-mono text-xs text-gray-300">
              <div className="text-amber-400 mb-2">CREATE TABLE messages (</div>
              <div className="ml-4 text-cyan-400">user_id UUID, <span className="text-gray-500">← PARTITION KEY (determines node)</span></div>
              <div className="ml-4 text-green-400">created_at TIMESTAMP, <span className="text-gray-500">← CLUSTERING KEY (ordering)</span></div>
              <div className="ml-4 text-white">message_id UUID, content TEXT,</div>
              <div className="ml-4 text-amber-400">PRIMARY KEY ((user_id), created_at DESC)</div>
              <div className="text-amber-400">{')' };</div>
              {internalStep >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-[#39ff14]">
                  → SELECT * WHERE user_id=? ORDER BY created_at DESC LIMIT 20;<br />
                  → Single partition. O(1). Lightning fast.
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Step 3: Write Path — Commit Log + Memtable */}
      {currentStep === 3 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">Write Path: Commit Log → Memtable → SSTable</div>
          <div className="flex flex-col items-center gap-2">
            {/* Client */}
            <motion.div className="bg-[#0a1526] border border-gray-700 rounded-xl px-6 py-3 font-mono text-sm text-white">
              Client: INSERT message...
            </motion.div>
            <ArrowDown className="w-4 h-4 text-gray-600" />
            {/* Commit Log */}
            <motion.div
              animate={internalStep >= 1 ? { borderColor: '#f59e0b', backgroundColor: '#f59e0b10' } : {}}
              className="bg-[#0a1526] border border-gray-700 rounded-xl px-6 py-3 font-mono text-sm text-white flex items-center gap-3 w-80 justify-between"
            >
              <div className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-amber-400" /> Commit Log (Disk)</div>
              {internalStep >= 1 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 text-xs">✓ Written</motion.div>}
            </motion.div>
            <ArrowDown className="w-4 h-4 text-gray-600" />
            {/* Memtable */}
            <motion.div
              animate={internalStep >= 2 ? { borderColor: color, backgroundColor: '#06b6d410' } : {}}
              className="bg-[#0a1526] border border-gray-700 rounded-xl px-6 py-3 font-mono text-sm text-white flex items-center gap-3 w-80 justify-between"
            >
              <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> Memtable (RAM)</div>
              {internalStep >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400 text-xs">✓ Written</motion.div>}
            </motion.div>

            {internalStep >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 border border-green-500/40 rounded-xl px-6 py-3 font-mono text-sm text-green-400 w-80 text-center flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4" /> ACK sent to client — done!
              </motion.div>
            )}

            {internalStep >= 4 && (
              <>
                <ArrowDown className="w-4 h-4 text-gray-600" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a1526] border border-purple-700 rounded-xl px-6 py-3 font-mono text-xs text-gray-400 w-80">
                  <span className="text-purple-400">Background:</span> memtable flushes → SSTable (disk, sorted, immutable)
                </motion.div>
              </>
            )}

            {internalStep >= 5 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a1526] border border-gray-700 rounded-xl px-6 py-3 font-mono text-xs text-gray-400 w-80">
                <span className="text-gray-500">Compaction:</span> SSTables periodically merged → removes tombstones, deduplicates
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: SSTable / Compaction */}
      {currentStep === 4 && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-xl">SSTables & Compaction</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'SSTable 1', entries: ['a:1', 'b:2', 'd:3'], age: '2h ago', color: '#8b5cf6' },
              { label: 'SSTable 2', entries: ['b:99', 'c:5', 'e:7'], age: '1h ago', color: '#f59e0b' },
              { label: 'SSTable 3', entries: ['a:DEL', 'f:8'], age: '30m ago', color: '#ef4444' },
            ].map((sst, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={internalStep >= i ? { opacity: 1, y: 0 } : {}}
                className="bg-[#0a1526] border rounded-xl p-4 font-mono text-xs"
                style={{ borderColor: sst.color + '50' }}
              >
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: sst.color }}>{sst.label}</div>
                <div className="text-gray-500 text-[10px] mb-3">{sst.age} · sorted, immutable</div>
                {sst.entries.map(e => (
                  <div key={e} className={`py-1 border-b border-gray-800 last:border-0 ${e.includes('DEL') ? 'text-red-400 line-through' : 'text-white'}`}>{e}</div>
                ))}
              </motion.div>
            ))}
          </div>
          {internalStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#050d1a] border border-cyan-500/40 rounded-xl p-4">
              <div className="text-cyan-400 font-mono text-xs font-bold mb-3">After Compaction → One merged SSTable:</div>
              <div className="flex gap-3 flex-wrap font-mono text-xs">
                {['b:99 (newest wins)', 'c:5', 'd:3', 'e:7', 'f:8'].map(e => (
                  <div key={e} className="bg-[#0a1526] border border-cyan-500/30 rounded px-3 py-1.5 text-white">{e}</div>
                ))}
                <div className="bg-[#0a1526] border border-red-500/30 rounded px-3 py-1.5 text-gray-600 line-through">a (deleted)</div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 5: WhatsApp rationale */}
      {currentStep === 5 && (
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="text-center font-space font-bold text-white text-2xl">Why WhatsApp Chose Cassandra</div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#0a1526] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">The Requirement</div>
              <div className="text-4xl font-space font-bold" style={{ color }}>75M</div>
              <div className="font-mono text-sm text-gray-300">writes per minute</div>
              <div className="font-mono text-xs text-gray-500">message queue storage for offline delivery</div>
            </div>
            <div className="bg-[#0a1526] border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Why Cassandra Won</div>
              {['Commit log + memtable = instant write ACK', 'No single primary write bottleneck', 'Linear horizontal scaling', 'Built-in replication (RF=3)', '50 engineers. 2B users.'].map(r => (
                <div key={r} className="flex items-start gap-2 font-mono text-xs text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  {r}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 font-mono text-xs text-center text-cyan-300">
            Cassandra optimizes for writes above all. This is the design choice — reads are slightly more complex (no JOINs, denormalized), but writes are limitless.
          </div>
        </div>
      )}
    </div>
  );
};

export default WideColumnAnim;
