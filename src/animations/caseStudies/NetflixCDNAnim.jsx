import React from 'react';
import { Smartphone, Server, Globe, HardDrive, Zap, AlertTriangle, Monitor, Activity, ShieldAlert, Cpu, Database } from 'lucide-react';
import { AnimatedConnection, NodeBox, SvgDefs } from '../../components/SystemDiagram';
import ScaleNumbers from '../../components/ScaleNumbers';
import { motion } from 'framer-motion';

const NetflixCDNAnim = ({ currentStep, isPlaying, speed }) => {
  const clientX = window.innerWidth * 0.15;
  const clientY = window.innerHeight * 0.4;
  
  const ispX = window.innerWidth * 0.4;
  const ispY = window.innerHeight * 0.4;

  const ispRegionalX = window.innerWidth * 0.6;
  const ispRegionalY = window.innerHeight * 0.6;
  
  const awsEastX = window.innerWidth * 0.8;
  const awsEastY = window.innerHeight * 0.2;

  const awsEuX = window.innerWidth * 0.8;
  const awsEuY = window.innerHeight * 0.6;

  return (
    <div className="w-full h-full relative font-source">
      <svg className="absolute inset-0 w-full h-full z-0">
        <SvgDefs />
        
        {/* Step 0: The Scale Problem (Single server explodes) */}
        {currentStep === 0 && (
          <AnimatedConnection x1={clientX} y1={clientY} x2={awsEastX} y2={awsEastY} color="#ef4444" isPlaying={isPlaying} speed={speed * 4} />
        )}

        {/* Step 1: Auth Request */}
        {currentStep === 1 && (
          <AnimatedConnection x1={clientX} y1={clientY} x2={awsEastX} y2={awsEastY} color="#3b82f6" isPlaying={isPlaying} speed={speed} />
        )}

        {/* Step 2: Microservices routing within AWS */}
        {currentStep === 2 && (
          <>
            <AnimatedConnection x1={awsEastX-40} y1={awsEastY} x2={awsEastX-80} y2={awsEastY-60} color="#8b5cf6" isPlaying={isPlaying} speed={speed} />
            <AnimatedConnection x1={awsEastX-40} y1={awsEastY} x2={awsEastX-80} y2={awsEastY} color="#8b5cf6" isPlaying={isPlaying} speed={speed} />
            <AnimatedConnection x1={awsEastX-40} y1={awsEastY} x2={awsEastX-80} y2={awsEastY+60} color="#8b5cf6" isPlaying={isPlaying} speed={speed} />
          </>
        )}

        {/* Step 4 & 5: CDN Pre-positioning */}
        {(currentStep === 4 || currentStep === 5) && (
          <AnimatedConnection x1={awsEastX} y1={awsEastY} x2={ispX} y2={ispY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 0.5} dashed={false} />
        )}

        {/* Step 6: Chunk Request Hit */}
        {currentStep === 6 && (
          <AnimatedConnection x1={clientX} y1={clientY} x2={ispX} y2={ispY} color="#10b981" isPlaying={isPlaying} speed={speed * 3} />
        )}

        {/* Step 7: Cache Miss Path */}
        {currentStep === 7 && (
          <>
            <AnimatedConnection x1={clientX} y1={clientY} x2={ispX} y2={ispY} color="#ef4444" isPlaying={isPlaying} speed={speed} />
            <AnimatedConnection x1={ispX} y1={ispY} x2={ispRegionalX} y2={ispRegionalY} color="#f59e0b" isPlaying={isPlaying} speed={speed} />
            <AnimatedConnection x1={ispRegionalX} y1={ispRegionalY} x2={awsEastX} y2={awsEastY} color="#f59e0b" isPlaying={isPlaying} speed={speed} />
          </>
        )}

        {/* Step 8: Adaptive Bitrate */}
        {currentStep === 8 && (
          <AnimatedConnection x1={clientX} y1={clientY} x2={ispX} y2={ispY} color="#3b82f6" isPlaying={isPlaying} speed={speed} />
        )}

        {/* Step 9 & 10: Chaos / Redundancy */}
        {currentStep === 10 && (
          <AnimatedConnection x1={clientX} y1={clientY} x2={awsEuX} y2={awsEuY} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
        )}

        {/* Step 11: Encoding Pipeline */}
        {currentStep === 11 && (
          <AnimatedConnection x1={awsEastX-150} y1={awsEastY+100} x2={awsEastX} y2={awsEastY} color="#06b6d4" isPlaying={isPlaying} speed={speed} />
        )}

      </svg>

      {/* Overlays / Nodes */}
      {currentStep >= 0 && currentStep !== 10 && currentStep < 13 && (
        <NodeBox id="aws" x={awsEastX} y={awsEastY} icon={Server} label="AWS us-east-1" sublabel="Control Plane" color={currentStep === 0 ? "#ef4444" : "#8b5cf6"} status={currentStep === 0 ? "failed" : "active"} />
      )}

      {currentStep === 10 && (
        <>
          <NodeBox id="aws_fail" x={awsEastX} y={awsEastY} icon={Server} label="AWS us-east-1" color="#ef4444" status="failed" />
          <NodeBox id="aws_eu" x={awsEuX} y={awsEuY} icon={Server} label="AWS eu-west-1" sublabel="Active Backup" color="#10b981" />
        </>
      )}

      {currentStep >= 0 && currentStep < 13 && (
        <NodeBox id="client" x={clientX} y={clientY} icon={Monitor} label="Smart TV" color="#06b6d4" />
      )}

      {currentStep === 2 && (
        <>
          <NodeBox id="ms1" x={awsEastX-100} y={awsEastY-60} icon={Cpu} label="User Svc" color="#8b5cf6" />
          <NodeBox id="ms2" x={awsEastX-100} y={awsEastY} icon={Cpu} label="Content Svc" color="#8b5cf6" />
          <NodeBox id="ms3" x={awsEastX-100} y={awsEastY+60} icon={Cpu} label="Stream Svc" color="#8b5cf6" />
        </>
      )}

      {currentStep === 3 && (
        <div className="absolute left-[30%] top-[40%] flex flex-col gap-2 bg-[#0a1526] border border-gray-800 p-4 rounded-xl shadow-2xl">
          <div className="w-48 h-8 bg-[#10b981]/20 border border-[#10b981] rounded flex items-center justify-between px-3"><span>4K</span><span className="text-xs">25 Mbps</span></div>
          <div className="w-48 h-8 bg-[#06b6d4]/20 border border-[#06b6d4] rounded flex items-center justify-between px-3"><span>1080p</span><span className="text-xs">8 Mbps</span></div>
          <div className="w-48 h-8 bg-[#f59e0b]/20 border border-[#f59e0b] rounded flex items-center justify-between px-3"><span>720p</span><span className="text-xs">5 Mbps</span></div>
          <div className="w-48 h-8 bg-[#ef4444]/20 border border-[#ef4444] rounded flex items-center justify-between px-3"><span>480p</span><span className="text-xs">2 Mbps</span></div>
        </div>
      )}

      {currentStep >= 4 && currentStep < 13 && (
        <NodeBox id="oca" x={ispX} y={ispY} icon={HardDrive} label="Local OCA" sublabel="Toronto ISP" color="#f59e0b" />
      )}

      {currentStep === 7 && (
        <NodeBox id="oca_reg" x={ispRegionalX} y={ispRegionalY} icon={HardDrive} label="Regional OCA" sublabel="New York" color="#f59e0b" />
      )}

      {currentStep === 9 && (
        <div className="absolute left-[50%] top-[20%] text-center">
          <ShieldAlert className="w-16 h-16 text-[#ef4444] mx-auto animate-bounce mb-2" />
          <span className="font-space text-white bg-[#ef4444] px-2 py-1 rounded font-bold">CHAOS MONKEY</span>
        </div>
      )}

      {currentStep === 11 && (
        <NodeBox id="encoder" x={awsEastX-150} y={awsEastY+100} icon={Activity} label="Titus Workers" sublabel="Parallel Encoding" color="#06b6d4" />
      )}

      {currentStep === 12 && (
        <div className="absolute left-[40%] top-[20%] flex gap-8 bg-[#0a1526] p-6 border border-gray-800 rounded-xl">
          <div className="text-center">
            <Database className="w-8 h-8 text-[#8b5cf6] mx-auto mb-2" />
            <div className="text-xs text-white">Kafka Event Stream</div>
          </div>
          <div className="text-center">
            <Cpu className="w-8 h-8 text-[#06b6d4] mx-auto mb-2" />
            <div className="text-xs text-white">ML Recs Model</div>
          </div>
          <div className="text-center">
            <Monitor className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
            <div className="text-xs text-white">Personalized Thumbnail</div>
          </div>
        </div>
      )}

      {currentStep === 13 && (
        <div className="absolute inset-0 bg-[#020611]/80 backdrop-blur-sm z-40 flex flex-wrap items-center justify-center gap-12 p-12">
          <ScaleNumbers value={200000000} label="Concurrent Users" />
          <ScaleNumbers value={1000} label="OCA Locations" suffix="+" />
          <ScaleNumbers value={15} label="Global Downstream" suffix="%" />
          <ScaleNumbers value={700} label="Microservices" suffix="+" />
          <ScaleNumbers value={95} label="Cache Hit Rate" suffix="%" />
        </div>
      )}

      {currentStep === 14 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-50">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-6 rounded-xl">
              <div className="text-xl font-bold text-white mb-2">No CDN</div>
              <div className="text-[#ef4444] font-space text-sm">Constant Buffering</div>
            </div>
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-6 rounded-xl">
              <div className="text-xl font-bold text-white mb-2">No Adaptive Bitrate</div>
              <div className="text-[#ef4444] font-space text-sm">Slow networks excluded</div>
            </div>
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-6 rounded-xl">
              <div className="text-xl font-bold text-white mb-2">No Microservices</div>
              <div className="text-[#ef4444] font-space text-sm">One bug takes down Netflix</div>
            </div>
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-6 rounded-xl">
              <div className="text-xl font-bold text-white mb-2">No Chaos Engineering</div>
              <div className="text-[#ef4444] font-space text-sm">Vulnerable to real outages</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetflixCDNAnim;
