import React from 'react';
import { Smartphone, Server, Database, Activity, Globe, Shuffle, Key } from 'lucide-react';
import { AnimatedConnection, NodeBox, SvgDefs } from '../../components/SystemDiagram';
import ScaleNumbers from '../../components/ScaleNumbers';

const TinyURLAnim = ({ currentStep, isPlaying, speed }) => {
  const clientX = window.innerWidth * 0.15;
  const clientY = window.innerHeight * 0.35;
  
  const lbX = window.innerWidth * 0.35;
  const lbY = window.innerHeight * 0.35;
  
  const appX = window.innerWidth * 0.55;
  const appY = window.innerHeight * 0.35;
  
  const cacheX = window.innerWidth * 0.75;
  const cacheY = window.innerHeight * 0.2;
  
  const dbX = window.innerWidth * 0.75;
  const dbY = window.innerHeight * 0.5;

  return (
    <div className="w-full h-full relative font-source">
      <svg className="absolute inset-0 w-full h-full z-0">
        <SvgDefs />

        {/* Step 1: Client Request */}
        {currentStep >= 1 && (
          <AnimatedConnection x1={clientX} y1={clientY} x2={lbX} y2={lbY} color="#06b6d4" isPlaying={isPlaying} speed={speed} />
        )}

        {/* Step 2: Load Balancer to App Servers */}
        {currentStep >= 2 && currentStep !== 10 && (
          <>
            <AnimatedConnection x1={lbX} y1={lbY} x2={appX} y2={appY - 60} color="#374151" isPlaying={false} />
            <AnimatedConnection x1={lbX} y1={lbY} x2={appX} y2={appY} color="#06b6d4" isPlaying={isPlaying} speed={speed} />
            <AnimatedConnection x1={lbX} y1={lbY} x2={appX} y2={appY + 60} color="#374151" isPlaying={false} />
          </>
        )}

        {/* Step 4: Cache Check (Miss) */}
        {currentStep === 4 && (
          <AnimatedConnection x1={appX} y1={appY} x2={cacheX} y2={cacheY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2} status="healthy" />
        )}

        {/* Step 6: Collision Check (DB Read) */}
        {currentStep === 6 && (
          <AnimatedConnection x1={appX} y1={appY} x2={dbX} y2={dbY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2} />
        )}

        {/* Step 7: Database Write */}
        {currentStep === 7 && (
          <>
            <AnimatedConnection x1={appX} y1={appY} x2={dbX} y2={dbY} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={dbX} y1={dbY} x2={dbX + 100} y2={dbY - 40} color="#10b981" isPlaying={isPlaying} speed={speed * 3} dashed={false} />
            <AnimatedConnection x1={dbX} y1={dbY} x2={dbX + 100} y2={dbY + 40} color="#10b981" isPlaying={isPlaying} speed={speed * 3} dashed={false} />
          </>
        )}

        {/* Step 8: Cache Write */}
        {currentStep === 8 && (
          <AnimatedConnection x1={appX} y1={appY} x2={cacheX} y2={cacheY} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
        )}

        {/* Step 9: Response */}
        {currentStep === 9 && (
          <>
            <AnimatedConnection x1={appX} y1={appY} x2={lbX} y2={lbY} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={lbX} y1={lbY} x2={clientX} y2={clientY} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
          </>
        )}

        {/* Step 10: Redirect Hot Path */}
        {currentStep === 10 && (
          <>
            <AnimatedConnection x1={clientX} y1={clientY} x2={lbX} y2={lbY} color="#f43f5e" isPlaying={isPlaying} speed={speed * 4} />
            <AnimatedConnection x1={lbX} y1={lbY} x2={appX} y2={appY} color="#f43f5e" isPlaying={isPlaying} speed={speed * 4} />
            <AnimatedConnection x1={appX} y1={appY} x2={cacheX} y2={cacheY} color="#10b981" isPlaying={isPlaying} speed={speed * 4} />
            <AnimatedConnection x1={cacheX} y1={cacheY} x2={appX} y2={appY} color="#10b981" isPlaying={isPlaying} speed={speed * 4} />
            <AnimatedConnection x1={appX} y1={appY} x2={clientX} y2={clientY} color="#10b981" isPlaying={isPlaying} speed={speed * 4} />
          </>
        )}

      </svg>

      {/* Overlays / Story Elements */}

      {/* Step 0: The Problem */}
      {currentStep === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-50">
          <div className="text-center w-full px-12">
            <div className="text-3xl font-space font-bold text-[#ef4444] mb-4 overflow-hidden whitespace-nowrap overflow-ellipsis">
              https://example.com/products/category/shoes/item/19238129381293812938?utm_source=twitter&utm_medium=social&utm_campaign=summer_sale_2024&affiliate_id=81273912837198273
            </div>
            <div className="text-xl text-white font-space">
              Characters: <span className="text-[#ef4444] font-bold">172</span> / 280
            </div>
          </div>
        </div>
      )}

      {/* Nodes */}
      {currentStep >= 1 && (
        <NodeBox id="client" x={clientX} y={clientY} icon={Smartphone} label={currentStep === 10 ? "User 2" : "User 1"} sublabel="Browser" color="#06b6d4" />
      )}

      {currentStep >= 2 && (
        <NodeBox id="lb" x={lbX} y={lbY} icon={Shuffle} label="Load Balancer" sublabel="Round Robin" color="#3b82f6" />
      )}

      {currentStep >= 2 && (
        <>
          <NodeBox id="app1" x={appX} y={appY - 60} icon={Server} label="App Server 1" color="#f43f5e" status="inactive" />
          <NodeBox id="app2" x={appX} y={appY} icon={Server} label="App Server 2" sublabel="Active" color="#f43f5e" />
          <NodeBox id="app3" x={appX} y={appY + 60} icon={Server} label="App Server 3" color="#f43f5e" status="inactive" />
        </>
      )}

      {/* Step 3: Hashing / Inside App Server */}
      {currentStep === 3 && (
        <div className="absolute left-[50%] top-[45%] bg-[#0a1526] border border-[#f43f5e] p-4 rounded-xl shadow-2xl z-20">
          <div className="text-sm text-gray-300 font-mono space-y-2">
            <div>✓ Valid URL</div>
            <div>↻ Checking Cache</div>
            <div className="text-[#f43f5e]">⏳ Generating short code...</div>
          </div>
        </div>
      )}

      {/* Step 5: The Hashing Process */}
      {currentStep === 5 && (
        <div className="absolute left-[40%] top-[45%] bg-[#0a1526] border border-[#f43f5e] p-6 rounded-xl shadow-2xl z-20 flex items-center gap-4">
          <div className="text-xs text-gray-500 max-w-[100px] truncate">https://very-long...</div>
          <div className="text-[#06b6d4]">→</div>
          <div className="px-3 py-2 bg-[#050d1a] border border-gray-700 rounded text-xs text-[#06b6d4] font-mono">MD5 Hash</div>
          <div className="text-[#06b6d4]">→</div>
          <div className="px-3 py-2 bg-[#050d1a] border border-gray-700 rounded text-xs text-[#10b981] font-mono">Base62 Encode</div>
          <div className="text-[#10b981]">→</div>
          <div className="text-2xl font-bold font-space text-white bg-[#10b981]/20 px-3 py-1 rounded">xK9mPqR</div>
        </div>
      )}

      {currentStep >= 4 && (
        <NodeBox id="redis" x={cacheX} y={cacheY} icon={Activity} label="Redis Cache" sublabel="O(1) Memory" color="#f59e0b" />
      )}
      
      {currentStep === 4 && (
        <div className="absolute left-[70%] top-[10%] text-[#ef4444] font-space font-bold">CACHE MISS</div>
      )}

      {currentStep >= 6 && (
        <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="Primary DB" sublabel="Writes" color="#10b981" />
      )}

      {currentStep >= 7 && (
        <>
          <NodeBox id="dbR1" x={dbX + 100} y={dbY - 40} icon={Database} label="Read Replica" color="#34d399" />
          <NodeBox id="dbR2" x={dbX + 100} y={dbY + 40} icon={Database} label="Read Replica" color="#34d399" />
        </>
      )}

      {currentStep === 7 && (
        <div className="absolute left-[72%] top-[60%] bg-[#0a1526] border border-[#10b981] p-2 rounded-lg text-xs font-mono text-white shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="pr-4">id</th><th>url</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="text-[#f59e0b] pr-4">xK9mPqR</td><td className="truncate max-w-[100px]">https://long...</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {currentStep === 9 && (
        <div className="absolute left-[15%] top-[25%] flex gap-4">
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4">
            <div className="text-sm text-[#10b981] font-space mb-1">Result</div>
            <div className="text-xl text-white font-bold">bitly.com/xK9mPqR</div>
          </div>
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4">
            <ScaleNumbers value={50} label="Latency (ms)" />
          </div>
        </div>
      )}

      {currentStep === 10 && (
        <div className="absolute left-[40%] top-[10%] flex gap-4 bg-[#f43f5e]/10 border border-[#f43f5e]/30 rounded-xl p-4">
          <ScaleNumbers value={5} label="Cache Hit Latency (ms)" />
          <div className="text-sm font-space text-[#10b981] self-center ml-4">99% Faster</div>
        </div>
      )}

      {currentStep === 11 && (
        <div className="absolute inset-0 bg-[#020611]/80 backdrop-blur-sm z-40 flex items-center justify-center gap-12">
          <ScaleNumbers value={6000000000} label="Clicks / Month" />
          <ScaleNumbers value={99} label="Cache Hit %" suffix="%" />
          <ScaleNumbers value={500000000} label="DB Rows" />
        </div>
      )}

    </div>
  );
};

export default TinyURLAnim;
