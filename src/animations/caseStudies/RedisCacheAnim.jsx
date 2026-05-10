import React, { useState, useEffect } from 'react';
import { Database, Server, Zap, Clock, Lock, List, Hash as HashIcon, AlignLeft, Layers, ShieldAlert, Thermometer, GitCommit } from 'lucide-react';
import { AnimatedConnection, NodeBox, SvgDefs } from '../../components/SystemDiagram';
import ScaleNumbers from '../../components/ScaleNumbers';
import { motion, AnimatePresence } from 'framer-motion';

const RedisCacheAnim = ({ currentStep, isPlaying, speed }) => {
  const [stampedeRequests, setStampedeRequests] = useState([]);

  useEffect(() => {
    if (currentStep === 6 && isPlaying) {
      const reqs = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 2
      }));
      setStampedeRequests(reqs);
    } else {
      setStampedeRequests([]);
    }
  }, [currentStep, isPlaying]);

  const appX = window.innerWidth * 0.2;
  const appY = window.innerHeight * 0.4;
  
  const cacheX = window.innerWidth * 0.5;
  const cacheY = window.innerHeight * 0.3;
  
  const dbX = window.innerWidth * 0.8;
  const dbY = window.innerHeight * 0.4;

  const cluster1X = window.innerWidth * 0.4;
  const cluster1Y = window.innerHeight * 0.3;
  
  const cluster2X = window.innerWidth * 0.6;
  const cluster2Y = window.innerHeight * 0.2;
  
  const cluster3X = window.innerWidth * 0.6;
  const cluster3Y = window.innerHeight * 0.5;

  return (
    <div className="w-full h-full relative font-source">
      <svg className="absolute inset-0 w-full h-full z-0">
        <SvgDefs />

        {/* Step 1: Cache Aside */}
        {currentStep === 1 && (
          <>
            <AnimatedConnection x1={appX} y1={appY} x2={cacheX} y2={cacheY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={cacheX} y1={cacheY} x2={dbX} y2={dbY} color="#ef4444" isPlaying={isPlaying} speed={speed * 2} dashed={true} />
            <AnimatedConnection x1={dbX} y1={dbY + 20} x2={appX} y2={appY + 20} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={appX} y1={appY + 40} x2={cacheX} y2={cacheY + 40} color="#10b981" isPlaying={isPlaying} speed={speed * 3} />
          </>
        )}

        {/* Step 2: Write Through */}
        {currentStep === 2 && (
          <>
            <AnimatedConnection x1={appX} y1={appY} x2={cacheX} y2={cacheY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 1.5} />
            <AnimatedConnection x1={cacheX} y1={cacheY} x2={dbX} y2={dbY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 1.5} />
          </>
        )}

        {/* Step 3: Write Behind */}
        {currentStep === 3 && (
          <>
            <AnimatedConnection x1={appX} y1={appY} x2={cacheX} y2={cacheY} color="#10b981" isPlaying={isPlaying} speed={speed * 4} />
            <AnimatedConnection x1={cacheX} y1={cacheY} x2={dbX} y2={dbY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 0.5} dashed={true} />
          </>
        )}

        {/* Step 6: Stampede */}
        {currentStep === 6 && (
          <>
            <AnimatedConnection x1={appX} y1={appY - 20} x2={cacheX} y2={cacheY} color="#10b981" isPlaying={isPlaying} speed={speed * 3} dashed={true} />
            <AnimatedConnection x1={cacheX} y1={cacheY} x2={dbX} y2={dbY} color="#ef4444" isPlaying={isPlaying} speed={speed * 0.5} />
          </>
        )}

        {/* Step 7: Cluster */}
        {currentStep === 7 && (
          <>
            <AnimatedConnection x1={appX} y1={appY} x2={cluster2X} y2={cluster2Y} color="#06b6d4" isPlaying={isPlaying} speed={speed * 3} />
          </>
        )}
      </svg>

      {/* OVERLAYS AND NODES */}

      {/* Step 0: The Problem */}
      {currentStep === 0 && (
        <div className="absolute inset-0 flex justify-center items-center gap-12 bg-[#020611] z-20">
          <div className="flex flex-col items-center bg-[#0a1526] p-8 border border-[#ef4444] rounded-xl w-[400px]">
             <div className="text-[#ef4444] font-space text-xl mb-4 text-center">Without Cache</div>
             <Database className="w-16 h-16 text-[#ef4444] mb-4 animate-bounce" />
             <div className="text-white font-mono text-sm mb-2">10,000 DB Queries / sec</div>
             <div className="text-[#ef4444] font-bold text-lg mb-2">100% CPU Load</div>
             <div className="text-gray-400 text-xs">Latency: 50ms</div>
          </div>
          
          <div className="flex flex-col items-center bg-[#0a1526] p-8 border border-[#10b981] rounded-xl w-[400px]">
             <div className="text-[#10b981] font-space text-xl mb-4 text-center">With Redis</div>
             <div className="flex items-center gap-4 mb-4">
                <Server className="w-12 h-12 text-[#10b981]" />
                <Database className="w-12 h-12 text-gray-500" />
             </div>
             <div className="text-white font-mono text-sm mb-2">9,500 Cache Hits / sec</div>
             <div className="text-[#10b981] font-bold text-lg mb-2">20% DB Load</div>
             <div className="text-gray-400 text-xs">Latency: 2ms</div>
          </div>
        </div>
      )}

      {/* Shared Nodes for Patterns */}
      {(currentStep >= 1 && currentStep <= 3) && (
        <>
          <NodeBox id="app" x={appX} y={appY} icon={Server} label="App Server" color="#06b6d4" />
          <NodeBox id="cache" x={cacheX} y={cacheY} icon={Zap} label="Redis Cache" color="#10b981" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="PostgreSQL" color="#3b82f6" />
        </>
      )}

      {/* Step 1: Cache Aside */}
      {currentStep === 1 && (
        <div className="absolute left-[35%] top-[60%] bg-[#0a1526] border border-[#06b6d4] p-4 rounded text-xs font-mono shadow-xl">
           <div className="text-white mb-1">1. Read from Cache</div>
           <div className="text-[#ef4444] mb-1">2. MISS</div>
           <div className="text-blue-400 mb-1">3. Fetch from DB</div>
           <div className="text-[#10b981]">4. Store in Cache</div>
        </div>
      )}

      {/* Step 2: Write Through */}
      {currentStep === 2 && (
        <div className="absolute left-[35%] top-[60%] bg-[#0a1526] border border-[#f59e0b] p-4 rounded text-xs font-mono shadow-xl">
           <div className="text-white mb-1">1. Write to Cache</div>
           <div className="text-[#f59e0b] mb-1">2. Wait for DB write</div>
           <div className="text-[#10b981]">Strong Consistency, High Latency</div>
        </div>
      )}

      {/* Step 3: Write Behind */}
      {currentStep === 3 && (
        <div className="absolute left-[35%] top-[60%] bg-[#0a1526] border border-[#8b5cf6] p-4 rounded text-xs font-mono shadow-xl">
           <div className="text-white mb-1">1. Write to Cache</div>
           <div className="text-[#10b981] mb-1">2. Return success immediately</div>
           <div className="text-[#8b5cf6]">3. Async worker writes to DB later</div>
        </div>
      )}

      {/* Step 4: Eviction Policies */}
      {currentStep === 4 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20 p-12">
           <div className="w-full max-w-4xl grid grid-cols-3 gap-8">
             <div className="bg-[#0a1526] border border-[#06b6d4] rounded-xl p-6">
                <div className="text-[#06b6d4] font-space text-lg mb-4 text-center">LRU</div>
                <div className="text-xs text-gray-400 text-center mb-4">Least Recently Used</div>
                <div className="flex flex-col gap-2">
                   <div className="bg-gray-800 p-2 rounded flex justify-between"><span className="text-white">Key A</span><span className="text-gray-500">2 min ago</span></div>
                   <div className="bg-gray-800 p-2 rounded flex justify-between"><span className="text-white">Key B</span><span className="text-gray-500">5 min ago</span></div>
                   <motion.div animate={isPlaying ? { opacity: [1, 0, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} className="bg-[#ef4444]/20 border border-[#ef4444] p-2 rounded flex justify-between"><span className="text-[#ef4444]">Key C</span><span className="text-[#ef4444]">2 hrs ago (EVICT)</span></motion.div>
                </div>
             </div>

             <div className="bg-[#0a1526] border border-[#f59e0b] rounded-xl p-6">
                <div className="text-[#f59e0b] font-space text-lg mb-4 text-center">LFU</div>
                <div className="text-xs text-gray-400 text-center mb-4">Least Frequently Used</div>
                <div className="flex flex-col gap-2">
                   <div className="bg-gray-800 p-2 rounded flex justify-between"><span className="text-white">Key X</span><span className="text-gray-500">500 hits</span></div>
                   <div className="bg-gray-800 p-2 rounded flex justify-between"><span className="text-white">Key Y</span><span className="text-gray-500">20 hits</span></div>
                   <motion.div animate={isPlaying ? { opacity: [1, 0, 1] } : {}} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="bg-[#ef4444]/20 border border-[#ef4444] p-2 rounded flex justify-between"><span className="text-[#ef4444]">Key Z</span><span className="text-[#ef4444]">1 hit (EVICT)</span></motion.div>
                </div>
             </div>

             <div className="bg-[#0a1526] border border-[#10b981] rounded-xl p-6">
                <div className="text-[#10b981] font-space text-lg mb-4 text-center">TTL</div>
                <div className="text-xs text-gray-400 text-center mb-4">Time To Live</div>
                <div className="flex flex-col gap-2">
                   <div className="bg-gray-800 p-2 rounded flex justify-between"><span className="text-white">Session 1</span><span className="text-[#10b981]">14:59</span></div>
                   <div className="bg-gray-800 p-2 rounded flex justify-between"><span className="text-white">Session 2</span><span className="text-[#f59e0b]">00:05</span></div>
                   <motion.div animate={isPlaying ? { opacity: [1, 0, 1] } : {}} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="bg-[#ef4444]/20 border border-[#ef4444] p-2 rounded flex justify-between"><span className="text-[#ef4444]">Session 3</span><span className="text-[#ef4444]">00:00 (EXPIRE)</span></motion.div>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Step 5: Data Structures */}
      {currentStep === 5 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20 p-12">
          <div className="grid grid-cols-5 gap-4 w-full max-w-5xl">
             <div className="bg-[#0a1526] border border-gray-700 p-4 rounded text-center flex flex-col items-center">
                <AlignLeft className="w-8 h-8 text-[#06b6d4] mb-2"/>
                <div className="text-white font-bold mb-1">String</div>
                <div className="text-gray-400 text-xs mb-2">Counters, JSON</div>
                <div className="bg-gray-800 text-[#06b6d4] text-[10px] font-mono px-2 py-1 rounded w-full">INCR views:1</div>
             </div>
             <div className="bg-[#0a1526] border border-gray-700 p-4 rounded text-center flex flex-col items-center">
                <List className="w-8 h-8 text-[#f59e0b] mb-2"/>
                <div className="text-white font-bold mb-1">List</div>
                <div className="text-gray-400 text-xs mb-2">Queues</div>
                <div className="bg-gray-800 text-[#f59e0b] text-[10px] font-mono px-2 py-1 rounded w-full">LPUSH / RPOP</div>
             </div>
             <div className="bg-[#0a1526] border border-gray-700 p-4 rounded text-center flex flex-col items-center">
                <Layers className="w-8 h-8 text-[#10b981] mb-2"/>
                <div className="text-white font-bold mb-1">Set</div>
                <div className="text-gray-400 text-xs mb-2">Unique Tags</div>
                <div className="bg-gray-800 text-[#10b981] text-[10px] font-mono px-2 py-1 rounded w-full">SADD / SISMEMBER</div>
             </div>
             <div className="bg-[#0a1526] border border-gray-700 p-4 rounded text-center flex flex-col items-center">
                <AlignLeft className="w-8 h-8 text-[#8b5cf6] mb-2"/>
                <div className="text-white font-bold mb-1">Sorted Set</div>
                <div className="text-gray-400 text-xs mb-2">Leaderboards</div>
                <div className="bg-gray-800 text-[#8b5cf6] text-[10px] font-mono px-2 py-1 rounded w-full">ZADD scores 100 U1</div>
             </div>
             <div className="bg-[#0a1526] border border-gray-700 p-4 rounded text-center flex flex-col items-center">
                <HashIcon className="w-8 h-8 text-[#ec4899] mb-2"/>
                <div className="text-white font-bold mb-1">Hash</div>
                <div className="text-gray-400 text-xs mb-2">Objects</div>
                <div className="bg-gray-800 text-[#ec4899] text-[10px] font-mono px-2 py-1 rounded w-full">HSET user:1 name "Bob"</div>
             </div>
          </div>
        </div>
      )}

      {/* Step 6: Stampede */}
      {currentStep === 6 && (
        <>
          <NodeBox id="app" x={appX} y={appY} icon={Server} label="10,000 Apps" color="#ef4444" />
          <NodeBox id="cache" x={cacheX} y={cacheY} icon={Zap} label="Redis" sublabel="Key Expired!" color="#ef4444" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="PostgreSQL" sublabel="Meltdown" color="#ef4444" status="failed" />
          
          <div className="absolute right-[10%] top-[20%] bg-[#0a1526] border border-[#ef4444] p-4 rounded-xl shadow-2xl max-w-xs">
            <div className="flex items-center gap-2 mb-2">
               <ShieldAlert className="text-[#ef4444] w-5 h-5"/>
               <span className="text-white font-space font-bold">Cache Stampede</span>
            </div>
            <div className="text-sm text-gray-300 mb-4">
               A popular key expires. 10,000 requests hit the cache simultaneously. Cache misses. ALL 10,000 requests query the database at the same time.
            </div>
            <div className="bg-[#10b981]/20 border border-[#10b981] p-2 rounded">
               <div className="text-[#10b981] text-xs font-bold mb-1 flex items-center gap-1"><Lock className="w-3 h-3"/> Solution: Mutex Lock</div>
               <div className="text-[10px] text-gray-400">One request computes the value. 9,999 requests wait.</div>
            </div>
          </div>
        </>
      )}

      {/* Step 7: Cluster */}
      {currentStep === 7 && (
        <>
          <NodeBox id="app" x={appX} y={appY} icon={Server} label="Client" color="#06b6d4" />
          <NodeBox id="c1" x={cluster1X} y={cluster1Y} icon={Database} label="Node 1" sublabel="Slots 0-5460" color="#10b981" />
          <NodeBox id="c2" x={cluster2X} y={cluster2Y} icon={Database} label="Node 2" sublabel="Slots 5461-10922" color="#f59e0b" />
          <NodeBox id="c3" x={cluster3X} y={cluster3Y} icon={Database} label="Node 3" sublabel="Slots 10923-16383" color="#8b5cf6" />
          
          <div className="absolute left-[30%] top-[60%] bg-[#0a1526] border border-[#06b6d4] p-4 rounded text-xs font-mono shadow-xl">
             <div className="text-white mb-2 border-b border-gray-700 pb-1">GET "user:1234"</div>
             <div className="text-gray-400 mb-1">1. CRC16("user:1234") mod 16384 = <span className="text-[#f59e0b]">7123</span></div>
             <div className="text-white">2. Client routes directly to Node 2</div>
          </div>
        </>
      )}

      {/* Step 8: Replication & Persistence */}
      {currentStep === 8 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020611] z-20 p-12">
           <div className="flex gap-12 mb-12">
              <div className="bg-[#0a1526] border border-[#06b6d4] p-6 rounded-xl w-64 text-center">
                 <div className="text-[#06b6d4] font-space text-lg mb-2">RDB (Snapshot)</div>
                 <div className="text-gray-400 text-xs mb-4">Point-in-time binary dump</div>
                 <div className="bg-gray-800 h-16 rounded flex items-center justify-center">
                    <Database className="w-8 h-8 text-[#06b6d4]"/>
                 </div>
                 <div className="mt-4 text-xs text-white">Compact, fast recovery. Can lose latest writes.</div>
              </div>

              <div className="bg-[#0a1526] border border-[#f59e0b] p-6 rounded-xl w-64 text-center">
                 <div className="text-[#f59e0b] font-space text-lg mb-2">AOF (Append Only)</div>
                 <div className="text-gray-400 text-xs mb-4">Log of every write command</div>
                 <div className="bg-gray-800 h-16 rounded flex flex-col items-center justify-center p-2">
                    <div className="text-[8px] text-[#f59e0b] font-mono">SET user 1</div>
                    <div className="text-[8px] text-[#f59e0b] font-mono">INCR views</div>
                 </div>
                 <div className="mt-4 text-xs text-white">Durable, no data loss. Slower recovery.</div>
              </div>
           </div>
        </div>
      )}

      {/* Step 9: Warming */}
      {currentStep === 9 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20 p-12">
           <div className="w-[600px] bg-[#0a1526] border border-[#10b981] p-8 rounded-xl flex flex-col items-center text-center">
              <Thermometer className="w-16 h-16 text-[#10b981] mb-4"/>
              <div className="text-white font-space text-2xl mb-4">Cache Warming</div>
              <div className="text-gray-300 text-sm mb-6">
                When deploying a new Redis instance, it starts completely empty (0% hit rate). 
                Sending live traffic immediately will cause a DB meltdown.
              </div>
              <div className="w-full text-left bg-gray-800 p-4 rounded text-xs font-mono text-gray-400 flex flex-col gap-2">
                <div><span className="text-[#10b981] font-bold">Strategy 1:</span> Eager pre-load top 100k queries.</div>
                <div><span className="text-[#f59e0b] font-bold">Strategy 2:</span> Warm up gradually with 1% of traffic.</div>
                <div><span className="text-[#06b6d4] font-bold">Strategy 3:</span> Configure as a Replica first, wait for sync, then promote.</div>
              </div>
           </div>
        </div>
      )}

      {/* Scale Numbers */}
      {currentStep === 10 && (
        <div className="absolute inset-0 bg-[#020611]/80 backdrop-blur-sm z-40 flex flex-wrap items-center justify-center gap-8 p-12">
          <ScaleNumbers value={10000000} label="Operations / sec" />
          <ScaleNumbers value={1} label="Max Latency" suffix="ms" />
          <ScaleNumbers value={1000} label="Max Nodes in Cluster" />
          <ScaleNumbers value={1} label="Max RAM" suffix="TB" />
          <ScaleNumbers value={16384} label="Hash Slots" />
        </div>
      )}

    </div>
  );
};

export default RedisCacheAnim;
