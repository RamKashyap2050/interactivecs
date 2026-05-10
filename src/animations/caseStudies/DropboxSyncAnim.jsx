import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Cloud, Database, Hash, GitBranch, GitMerge, Clock, Key, Globe, Eye, Server, Layers, ArrowRight } from 'lucide-react';
import { AnimatedConnection, NodeBox, SvgDefs } from '../../components/SystemDiagram';
import ScaleNumbers from '../../components/ScaleNumbers';
import { motion, AnimatePresence } from 'framer-motion';

const DropboxSyncAnim = ({ currentStep, isPlaying, speed }) => {
  const [chunkState, setChunkState] = useState(0);

  useEffect(() => {
    let interval;
    if (currentStep === 1 && isPlaying) {
      interval = setInterval(() => {
        setChunkState(prev => (prev + 1) % 4);
      }, 1000 / speed);
    } else {
      setChunkState(0);
    }
    return () => clearInterval(interval);
  }, [currentStep, isPlaying, speed]);

  const laptopX = window.innerWidth * 0.2;
  const laptopY = window.innerHeight * 0.4;
  
  const cloudX = window.innerWidth * 0.5;
  const cloudY = window.innerHeight * 0.4;
  
  const phoneX = window.innerWidth * 0.8;
  const phoneY = window.innerHeight * 0.4;

  const dbX = window.innerWidth * 0.5;
  const dbY = window.innerHeight * 0.2;

  const cdnX = window.innerWidth * 0.65;
  const cdnY = window.innerHeight * 0.6;

  return (
    <div className="w-full h-full relative font-source">
      <svg className="absolute inset-0 w-full h-full z-0">
        <SvgDefs />

        {/* Step 0: Naive Sync */}
        {currentStep === 0 && (
          <>
            <AnimatedConnection x1={laptopX} y1={laptopY} x2={cloudX} y2={cloudY} color="#ef4444" isPlaying={isPlaying} speed={speed * 0.5} />
            <AnimatedConnection x1={cloudX} y1={cloudY} x2={phoneX} y2={phoneY} color="#ef4444" isPlaying={isPlaying} speed={speed * 0.5} />
          </>
        )}

        {/* Step 1: File Chunking (No full lines, just one chunk flying) */}
        {currentStep === 1 && chunkState === 2 && (
          <AnimatedConnection x1={laptopX} y1={laptopY} x2={cloudX} y2={cloudY} color="#10b981" isPlaying={isPlaying} speed={speed * 3} dashed={true} />
        )}

        {/* Step 2: Deduplication */}
        {currentStep === 2 && (
          <>
            <AnimatedConnection x1={laptopX} y1={laptopY} x2={cloudX} y2={cloudY} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={phoneX} y1={phoneY} x2={cloudX} y2={cloudY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2} dashed={true} />
          </>
        )}

        {/* Step 3: Metadata Service */}
        {currentStep === 3 && (
          <>
            <AnimatedConnection x1={laptopX} y1={laptopY} x2={dbX} y2={dbY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 3} />
            <path d={`M ${laptopX} ${laptopY} L ${cloudX} ${cloudY}`} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5" />
            {/* Red X over the data line to show no data transfer */}
            <text x={(laptopX + cloudX)/2} y={(laptopY + cloudY)/2} fill="#ef4444" fontSize="24" textAnchor="middle" alignmentBaseline="middle">X</text>
          </>
        )}

        {/* Step 4: Upload Flow */}
        {currentStep === 4 && (
          <>
            <AnimatedConnection x1={laptopX} y1={laptopY - 10} x2={cloudX} y2={cloudY - 10} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} dashed={true} />
            <AnimatedConnection x1={cloudX} y1={cloudY + 10} x2={laptopX} y2={laptopY + 10} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2} dashed={true} />
            <AnimatedConnection x1={laptopX} y1={laptopY + 30} x2={cloudX} y2={cloudY + 30} color="#10b981" isPlaying={isPlaying} speed={speed * 1.5} />
            <AnimatedConnection x1={cloudX} y1={cloudY} x2={dbX} y2={dbY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 4} />
          </>
        )}

        {/* Step 6: Conflict */}
        {currentStep === 6 && (
          <>
            <AnimatedConnection x1={laptopX} y1={laptopY} x2={cloudX} y2={cloudY} color="#ef4444" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={phoneX} y1={phoneY} x2={cloudX} y2={cloudY} color="#ef4444" isPlaying={isPlaying} speed={speed * 2} />
          </>
        )}

        {/* Step 7: CDN */}
        {currentStep === 7 && (
          <>
            <AnimatedConnection x1={cloudX} y1={cloudY} x2={cdnX} y2={cdnY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 1.5} />
            <AnimatedConnection x1={cdnX} y1={cdnY} x2={phoneX} y2={phoneY} color="#10b981" isPlaying={isPlaying} speed={speed * 3} />
          </>
        )}
      </svg>

      {/* OVERLAYS AND NODES */}

      {/* Shared Nodes */}
      {(currentStep !== 10) && (
        <>
          <NodeBox id="laptop" x={laptopX} y={laptopY} icon={Laptop} label="User A" color="#06b6d4" />
          <NodeBox id="cloud" x={cloudX} y={cloudY} icon={Cloud} label="Cloud Block Storage" color="#10b981" />
          {currentStep !== 5 && <NodeBox id="phone" x={phoneX} y={phoneY} icon={Smartphone} label={currentStep === 2 || currentStep === 6 ? "User B" : "Mobile"} color={currentStep === 2 || currentStep === 6 ? "#06b6d4" : "#f59e0b"} />}
        </>
      )}

      {/* Step 0: Naive */}
      {currentStep === 0 && (
        <div className="absolute left-[30%] top-[45%] w-48 bg-[#0a1526] border border-[#ef4444] rounded p-2 text-center">
          <div className="text-[#ef4444] font-space font-bold mb-1">10 GB Transfer</div>
          <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
            <motion.div className="h-full bg-[#ef4444]"
              initial={{ width: '0%' }}
              animate={isPlaying ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-gray-400 text-xs mt-1">For a 1-byte edit</div>
        </div>
      )}

      {/* Step 1: Chunking */}
      {currentStep === 1 && (
        <div className="absolute inset-0 bg-[#020611]/80 flex flex-col items-center justify-center z-20">
           <div className="text-white font-space text-xl mb-8">File Chunking (4 MB Blocks)</div>
           <div className="flex gap-2">
             {Array.from({length: 6}).map((_, i) => (
               <div key={i} className={`w-16 h-24 border-2 rounded flex flex-col items-center justify-center
                 ${i === 2 && chunkState >= 1 ? 'border-[#10b981] bg-[#10b981]/20' : 'border-gray-600 bg-gray-800'}`}>
                 <Hash className={`w-6 h-6 mb-2 ${i === 2 && chunkState >= 1 ? 'text-[#10b981]' : 'text-gray-500'}`} />
                 <span className="text-[10px] font-mono text-gray-400">
                   {i === 2 && chunkState >= 1 ? 'e3b0c44' : 'd41d8cd'}
                 </span>
               </div>
             ))}
           </div>
           <div className="mt-8 text-center text-[#10b981] font-mono text-lg h-8">
              {chunkState === 1 && "User edits block 3"}
              {chunkState === 2 && "Block 3 hash changes"}
              {chunkState === 3 && "Only block 3 uploads (4 MB)"}
           </div>
        </div>
      )}

      {/* Step 2: Dedup */}
      {currentStep === 2 && (
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 bg-[#0a1526] p-4 border border-[#f59e0b] rounded-xl text-center">
          <div className="text-[#f59e0b] font-space font-bold mb-2">Deduplication</div>
          <div className="text-white text-sm font-mono mb-2">Hash: 8a9f23c</div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
             <span>User A Uploads</span>
             <ArrowRight className="w-4 h-4" />
             <span className="text-[#10b981]">Stored</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
             <span>User B Uploads</span>
             <ArrowRight className="w-4 h-4" />
             <span className="text-[#f59e0b]">Symbolic Link Created</span>
          </div>
        </div>
      )}

      {/* Step 3: Metadata */}
      {currentStep === 3 && (
        <>
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="Metadata DB" sublabel="Paxos/Raft" color="#8b5cf6" />
          <div className="absolute top-[20%] right-[10%] bg-[#0a1526] border border-[#8b5cf6] p-4 rounded font-mono text-xs text-gray-300 shadow-xl">
             <div className="text-[#8b5cf6] font-bold mb-2 uppercase border-b border-gray-700 pb-1">file_metadata table</div>
             <div><span className="text-blue-400">id:</span> 9942</div>
             <div><span className="text-blue-400">name:</span> {isPlaying ? <span className="text-[#10b981]">"vacation_v2.mp4"</span> : '"vacation.mp4"'}</div>
             <div><span className="text-blue-400">chunks:</span> [h1, h2, h3]</div>
             <div className="mt-2 text-[#f59e0b]">Zero chunks transferred.</div>
          </div>
        </>
      )}

      {/* Step 4: Upload Flow */}
      {currentStep === 4 && (
        <>
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="Metadata DB" color="#8b5cf6" />
          <div className="absolute left-[20%] top-[60%] bg-[#0a1526] border border-[#06b6d4] p-4 rounded text-xs font-mono shadow-xl">
             <div className="text-white mb-1">1. "I have hashes: [A, B, C]"</div>
             <div className="text-[#f59e0b] mb-1">2. "I need hash: [C]"</div>
             <div className="text-[#10b981] mb-1">3. Uploads C</div>
             <div className="text-[#8b5cf6]">4. Atomic Commit</div>
          </div>
        </>
      )}

      {/* Step 5: Sync Logic */}
      {currentStep === 5 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="w-[600px] bg-[#0a1526] border border-[#06b6d4] rounded-xl p-6 relative">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0a1526] px-4 py-1 border border-[#06b6d4] rounded-full text-[#06b6d4] font-space flex items-center gap-2">
                <Eye className="w-4 h-4"/> OS File Watcher
             </div>
             
             <div className="flex gap-8 items-center mt-4">
               <div className="flex-1 border border-gray-700 rounded p-4 text-center relative">
                 <div className="text-white font-mono text-xs mb-2 border-b border-gray-700 pb-2">Event Queue</div>
                 <div className="flex flex-col gap-1">
                   <motion.div animate={isPlaying ? { opacity: [1, 0.5, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} className="bg-blue-900/50 text-blue-300 text-xs p-1 rounded">Write: doc.txt</motion.div>
                   <motion.div animate={isPlaying ? { opacity: [1, 0.5, 0] } : {}} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} className="bg-blue-900/50 text-blue-300 text-xs p-1 rounded">Write: doc.txt</motion.div>
                 </div>
               </div>
               <ArrowRight className="text-gray-500 w-8 h-8"/>
               <div className="flex-1 border border-[#10b981] rounded p-4 text-center bg-[#10b981]/10">
                 <div className="text-[#10b981] font-mono text-sm mb-2">Debounce (2s idle)</div>
                 <div className="text-white text-xs">Hash & Upload 1 chunk</div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Step 6: Conflict */}
      {currentStep === 6 && (
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 bg-[#0a1526] p-4 border border-[#ef4444] rounded-xl text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 text-[#ef4444] font-space font-bold mb-4">
            <GitBranch className="w-5 h-5"/> Concurrent Edit Conflict
          </div>
          <div className="flex gap-4">
             <div className="border border-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400 mb-1">Text File (Doc)</div>
                <div className="text-[#10b981] font-mono text-xs flex items-center gap-1 justify-center"><GitMerge className="w-3 h-3"/> Auto-Merge</div>
             </div>
             <div className="border border-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400 mb-1">Binary File (PSD)</div>
                <div className="text-[#f59e0b] font-mono text-xs flex items-center gap-1 justify-center"><Layers className="w-3 h-3"/> "Conflicted Copy"</div>
             </div>
          </div>
        </div>
      )}

      {/* Step 7: CDN */}
      {currentStep === 7 && (
        <>
          <NodeBox id="cdn" x={cdnX} y={cdnY} icon={Globe} label="CDN Edge" color="#8b5cf6" />
          <div className="absolute right-[10%] top-[40%] bg-[#0a1526] border border-[#8b5cf6] p-3 rounded text-xs text-white">
            Downloads served from nearest PoP.<br/>
            Origin only hit on cache miss.
          </div>
        </>
      )}

      {/* Step 8: Sharing */}
      {currentStep === 8 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="bg-[#0a1526] border border-[#06b6d4] p-8 rounded-xl flex flex-col items-center max-w-md text-center">
             <Key className="w-12 h-12 text-[#f59e0b] mb-4" />
             <div className="text-white font-space text-xl mb-4">Sharing is Metadata Only</div>
             <div className="text-gray-400 text-sm mb-4">
               No files are copied. A capability token (JWT) is generated and stored in the Metadata DB ACL.
             </div>
             <div className="w-full bg-gray-800 p-2 rounded font-mono text-xs text-[#06b6d4] break-all">
               eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlX2lkIjoiOTk0MiIsInBlcm0iOiJ2aWV3In0
             </div>
             <div className="mt-4 text-[#ef4444] text-xs">Revocation instantly drops the ACL entry.</div>
          </div>
        </div>
      )}

      {/* Step 9: Versioning */}
      {currentStep === 9 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020611] z-20 p-12">
          <div className="text-white font-space text-2xl mb-8">Versioning (Immutable Chunks)</div>
          
          <div className="w-full max-w-3xl flex justify-between items-end relative mb-12">
            <div className="absolute bottom-4 left-0 w-full h-1 bg-gray-700 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-[#f59e0b] font-mono text-xs mb-2">v1 (Yesterday)</div>
              <div className="w-4 h-4 rounded-full bg-[#f59e0b] mb-2"></div>
              <div className="bg-[#0a1526] border border-gray-600 p-2 rounded text-[10px] text-gray-400 font-mono">
                [A, B, C]
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-[#06b6d4] font-mono text-xs mb-2">v2 (1 hr ago)</div>
              <div className="w-4 h-4 rounded-full bg-[#06b6d4] mb-2"></div>
              <div className="bg-[#0a1526] border border-gray-600 p-2 rounded text-[10px] text-gray-400 font-mono">
                [A, X, C]
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="text-[#10b981] font-mono text-xs mb-2">v3 (Now)</div>
              <div className="w-4 h-4 rounded-full bg-[#10b981] mb-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
              <div className="bg-[#0a1526] border border-gray-600 p-2 rounded text-[10px] text-gray-400 font-mono">
                [A, X, Y]
              </div>
            </div>
          </div>

          <div className="bg-[#0a1526] border border-gray-700 p-4 rounded text-center text-sm text-gray-300 max-w-xl">
            Chunks are never overwritten. A new version just points to different chunks. 
            Chunk <span className="text-[#ef4444] font-mono">B</span> is orphaned. 
            A background garbage collector will eventually delete it if no version references it.
          </div>
        </div>
      )}

      {/* Scale Numbers */}
      {currentStep === 10 && (
        <div className="absolute inset-0 bg-[#020611]/80 backdrop-blur-sm z-40 flex flex-wrap items-center justify-center gap-8 p-12">
          <ScaleNumbers value={500000000} label="Registered Users" />
          <ScaleNumbers value={1200000000} label="Files Uploaded Daily" />
          <ScaleNumbers value={90} label="TB New Chunk Data Daily" />
          <ScaleNumbers value={4} label="MB Chunk Size" />
          <ScaleNumbers value={200} label="Average Sync Latency" suffix="ms" />
          <ScaleNumbers value={99.999} label="Durability" suffix="%" />
        </div>
      )}

    </div>
  );
};

export default DropboxSyncAnim;
