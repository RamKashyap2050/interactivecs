import React, { useState, useEffect } from 'react';
import { Smartphone, Server, Database, Lock, Users, Image as ImageIcon, Check, CheckCheck, Activity, Box, Cpu } from 'lucide-react';
import { AnimatedConnection, NodeBox, SvgDefs } from '../../components/SystemDiagram';
import ScaleNumbers from '../../components/ScaleNumbers';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppRealtimeAnim = ({ currentStep, isPlaying, speed }) => {
  const aliceX = window.innerWidth * 0.2;
  const aliceY = window.innerHeight * 0.35;
  
  const serverX = window.innerWidth * 0.5;
  const serverY = window.innerHeight * 0.35;
  
  const bobX = window.innerWidth * 0.8;
  const bobY = window.innerHeight * 0.35;

  const dbX = window.innerWidth * 0.5;
  const dbY = window.innerHeight * 0.7;

  const cdnX = window.innerWidth * 0.5;
  const cdnY = window.innerHeight * 0.1;

  const [threads, setThreads] = useState([]);
  
  useEffect(() => {
    if (currentStep === 0) {
      setThreads(Array.from({ length: 50 }).map((_, i) => ({ id: i })));
    }
  }, [currentStep]);

  return (
    <div className="w-full h-full relative font-source">
      <svg className="absolute inset-0 w-full h-full z-0">
        <SvgDefs />
        
        {/* Step 1: Persistent Connection & Heartbeats */}
        {currentStep === 1 && (
          <>
            <AnimatedConnection x1={aliceX} y1={aliceY} x2={serverX} y2={serverY} color="#10b981" isPlaying={isPlaying} speed={speed * 0.5} dashed={true} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={aliceX} y2={aliceY} color="#10b981" isPlaying={isPlaying} speed={speed * 0.5} dashed={true} />
          </>
        )}

        {/* Step 2: Message Send (1 tick) */}
        {(currentStep === 2 || currentStep === 3) && (
          <AnimatedConnection x1={aliceX} y1={aliceY} x2={serverX} y2={serverY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
        )}
        
        {/* Step 3: Offline Storage */}
        {currentStep === 3 && (
          <AnimatedConnection x1={serverX} y1={serverY} x2={dbX} y2={dbY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2} dashed={false} />
        )}

        {/* Step 4: Offline Delivery */}
        {currentStep === 4 && (
          <>
            <AnimatedConnection x1={bobX} y1={bobY} x2={serverX} y2={serverY} color="#10b981" isPlaying={isPlaying} speed={speed} dashed={true} />
            <AnimatedConnection x1={dbX} y1={dbY} x2={serverX} y2={serverY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 3} dashed={false} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={bobX} y2={bobY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 3} />
          </>
        )}

        {/* Step 5: E2E Encryption (Locks moving) */}
        {currentStep === 5 && (
          <AnimatedConnection x1={aliceX} y1={aliceY} x2={bobX} y2={bobY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 1.5} dashed={true} />
        )}

        {/* Step 6: Delivery Receipt (2 grey ticks) */}
        {currentStep === 6 && (
          <>
            <AnimatedConnection x1={bobX} y1={bobY} x2={serverX} y2={serverY} color="#9ca3af" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={aliceX} y2={aliceY} color="#9ca3af" isPlaying={isPlaying} speed={speed * 2} />
          </>
        )}

        {/* Step 7: Read Receipt (2 blue ticks) */}
        {currentStep === 7 && (
          <>
            <AnimatedConnection x1={bobX} y1={bobY} x2={serverX} y2={serverY} color="#3b82f6" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={aliceX} y2={aliceY} color="#3b82f6" isPlaying={isPlaying} speed={speed * 2} />
          </>
        )}

        {/* Step 8: Group Fanout */}
        {currentStep === 8 && (
          <>
            <AnimatedConnection x1={aliceX} y1={aliceY} x2={serverX} y2={serverY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={bobX} y2={bobY - 100} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={bobX} y2={bobY - 33} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={bobX} y2={bobY + 33} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={bobX} y2={bobY + 100} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
          </>
        )}

        {/* Step 9: Media Handling */}
        {currentStep === 9 && (
          <>
            <AnimatedConnection x1={aliceX} y1={aliceY} x2={cdnX} y2={cdnY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 1.5} dashed={false} />
            <AnimatedConnection x1={aliceX} y1={aliceY} x2={serverX} y2={serverY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={serverX} y1={serverY} x2={bobX} y2={bobY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={cdnX} y1={cdnY} x2={bobX} y2={bobY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 1.5} dashed={false} />
          </>
        )}
      </svg>

      {/* OVERLAYS AND NODES */}
      
      {/* Step 0: Concurrency Problem */}
      {currentStep === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="flex gap-16 items-center">
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-4 font-space">Traditional Server</div>
              <div className="w-48 h-64 border border-[#ef4444] bg-[#ef4444]/10 rounded-lg p-2 flex flex-wrap gap-1 overflow-hidden relative">
                {threads.map(t => <div key={t.id} className="w-2 h-2 bg-[#ef4444] rounded-sm" />)}
                <div className="absolute inset-0 bg-gradient-to-t from-[#ef4444]/50 to-transparent flex items-end justify-center pb-4">
                  <span className="text-white font-bold animate-pulse">OOM KILLED</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">Thread per connection (MBs)</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-4 font-space">Erlang Server</div>
              <div className="w-48 h-64 border border-[#10b981] bg-[#10b981]/10 rounded-lg p-2 flex flex-wrap gap-[2px] overflow-hidden">
                {Array.from({length: 400}).map((_, i) => <div key={`e${i}`} className="w-1 h-1 bg-[#10b981] rounded-full opacity-50" />)}
              </div>
              <div className="text-xs text-gray-400 mt-2">Lightweight Process (~300 bytes)</div>
            </div>
          </div>
        </div>
      )}

      {currentStep >= 1 && currentStep < 11 && (
        <NodeBox id="alice" x={aliceX} y={aliceY} icon={Smartphone} label="Alice" color="#06b6d4" />
      )}

      {currentStep >= 1 && currentStep < 8 && (
        <NodeBox id="server" x={serverX} y={serverY} icon={Cpu} label="Erlang Chat Svc" sublabel="2M Conns/Server" color="#10b981" />
      )}

      {currentStep >= 1 && currentStep < 8 && currentStep !== 3 && (
        <NodeBox id="bob" x={bobX} y={bobY} icon={Smartphone} label="Bob" color={currentStep === 4 ? "#10b981" : "#06b6d4"} />
      )}
      
      {currentStep === 3 && (
        <NodeBox id="bob_offline" x={bobX} y={bobY} icon={Smartphone} label="Bob" sublabel="Offline" color="#4b5563" status="failed" />
      )}

      {currentStep >= 3 && currentStep <= 4 && (
        <NodeBox id="cass" x={dbX} y={dbY} icon={Database} label="Cassandra" sublabel="Offline Queue" color="#f59e0b" />
      )}

      {/* Tick Animations */}
      {currentStep === 2 && (
        <div className="absolute left-[30%] top-[40%] bg-[#0a1526] p-2 rounded-full border border-gray-700 flex items-center justify-center shadow-xl">
          <Check className="w-5 h-5 text-gray-400" />
        </div>
      )}
      
      {currentStep === 6 && (
        <div className="absolute left-[30%] top-[40%] bg-[#0a1526] p-2 rounded-full border border-gray-700 flex items-center justify-center shadow-xl">
          <CheckCheck className="w-5 h-5 text-gray-400" />
        </div>
      )}

      {currentStep === 7 && (
        <div className="absolute left-[30%] top-[40%] bg-[#0a1526] p-2 rounded-full border border-gray-700 flex items-center justify-center shadow-xl">
          <CheckCheck className="w-5 h-5 text-[#3b82f6]" />
        </div>
      )}

      {/* E2E Encryption */}
      {currentStep === 5 && (
        <div className="absolute left-[50%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
          <Lock className="w-8 h-8 text-[#f59e0b]" />
          <div className="text-[#f59e0b] font-mono text-sm">Ciphertext Only</div>
        </div>
      )}

      {/* Group Messages */}
      {currentStep === 8 && (
        <>
          <NodeBox id="server8" x={serverX} y={serverY} icon={Cpu} label="Fanout Svc" color="#10b981" />
          <NodeBox id="g1" x={bobX} y={bobY - 100} icon={Smartphone} label="Bob" color="#06b6d4" />
          <NodeBox id="g2" x={bobX} y={bobY - 33} icon={Smartphone} label="Charlie" color="#06b6d4" />
          <NodeBox id="g3" x={bobX} y={bobY + 33} icon={Smartphone} label="Dave" color="#06b6d4" />
          <NodeBox id="g4" x={bobX} y={bobY + 100} icon={Smartphone} label="Eve" color="#06b6d4" />
          <div className="absolute left-[40%] top-[30%] text-[#06b6d4] font-space text-sm">O(N) Delivery Cost</div>
        </>
      )}

      {/* Media */}
      {currentStep === 9 && (
        <>
          <NodeBox id="server9" x={serverX} y={serverY} icon={Cpu} label="Chat Server" color="#10b981" />
          <NodeBox id="bob9" x={bobX} y={bobY} icon={Smartphone} label="Bob" color="#06b6d4" />
          <NodeBox id="cdn" x={cdnX} y={cdnY} icon={ImageIcon} label="Media CDN" sublabel="Encrypted Blobs" color="#8b5cf6" />
          <div className="absolute left-[30%] top-[20%] text-[#8b5cf6] font-mono text-xs rotate-[-20deg]">1. Upload Ciphertext</div>
          <div className="absolute left-[30%] top-[45%] text-[#06b6d4] font-mono text-xs rotate-[0deg]">2. Send URL + Key</div>
          <div className="absolute left-[65%] top-[20%] text-[#8b5cf6] font-mono text-xs rotate-[20deg]">3. Download & Decrypt</div>
        </>
      )}

      {/* Presence */}
      {currentStep === 10 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="text-center max-w-2xl">
            <div className="flex justify-center gap-16 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#10b981] flex items-center justify-center mb-2">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="text-white font-bold font-space">Online</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center mb-2">
                  <span className="text-white font-mono text-xs">10:42 PM</span>
                </div>
                <div className="text-white font-bold font-space">Last Seen</div>
              </div>
            </div>
            <div className="bg-[#0a1526] p-6 border border-[#f59e0b] rounded-xl text-[#f59e0b] font-mono text-sm text-left">
              <div>{`// N^2 Problem`}</div>
              <div>{`if (user_online) {`}</div>
              <div className="pl-4 text-white">{`notify_contacts(user.mutual_contacts);`}</div>
              <div className="pl-4 text-gray-500">{`// 2B users * 200 contacts = 400B events`}</div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>
      )}

      {/* Scale Numbers */}
      {currentStep === 11 && (
        <div className="absolute inset-0 bg-[#020611]/80 backdrop-blur-sm z-40 flex flex-wrap items-center justify-center gap-8 p-12">
          <ScaleNumbers value={2000000000} label="Active Users" />
          <ScaleNumbers value={100000000000} label="Messages / Day" />
          <ScaleNumbers value={2000000} label="Connections / Server" />
          <ScaleNumbers value={50} label="Engineers (at launch)" />
          <ScaleNumbers value={300} label="Erlang Proc Size (Bytes)" suffix="B" />
        </div>
      )}

    </div>
  );
};

export default WhatsAppRealtimeAnim;
