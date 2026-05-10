import React, { useState, useEffect } from 'react';
import { Map, MapPin, Database, GitMerge, Search, Layers, Activity, Smartphone, Route, Clock, Zap } from 'lucide-react';
import { AnimatedConnection, NodeBox, SvgDefs } from '../../components/SystemDiagram';
import ScaleNumbers from '../../components/ScaleNumbers';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleMapsAnim = ({ currentStep, isPlaying, speed }) => {
  const [dijkstraNodes, setDijkstraNodes] = useState([]);
  
  useEffect(() => {
    if ((currentStep === 4 || currentStep === 5) && isPlaying) {
      const nodes = Array.from({ length: currentStep === 4 ? 200 : 80 }).map((_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        delay: Math.random() * 2
      }));
      setDijkstraNodes(nodes);
    } else {
      setDijkstraNodes([]);
    }
  }, [currentStep, isPlaying]);

  const clientX = window.innerWidth * 0.2;
  const clientY = window.innerHeight * 0.4;
  
  const routerX = window.innerWidth * 0.4;
  const routerY = window.innerHeight * 0.4;
  
  const searchX = window.innerWidth * 0.4;
  const searchY = window.innerHeight * 0.2;

  const dbX = window.innerWidth * 0.7;
  const dbY = window.innerHeight * 0.2;

  const trafficX = window.innerWidth * 0.7;
  const trafficY = window.innerHeight * 0.5;

  const cdnX = window.innerWidth * 0.7;
  const cdnY = window.innerHeight * 0.8;

  return (
    <div className="w-full h-full relative font-source">
      <svg className="absolute inset-0 w-full h-full z-0">
        <SvgDefs />

        {/* Step 3 & 7 & 8: Routing Flow */}
        {(currentStep === 3 || currentStep === 7 || currentStep === 8) && (
          <>
            <AnimatedConnection x1={clientX} y1={clientY} x2={routerX} y2={routerY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={trafficX} y1={trafficY} x2={routerX} y2={routerY} color="#ef4444" isPlaying={isPlaying} speed={speed * 3} dashed={true} />
            <AnimatedConnection x1={routerX} y1={routerY} x2={clientX} y2={clientY + 50} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
          </>
        )}

        {/* Step 9: Map Tiles */}
        {currentStep === 9 && (
          <>
            <AnimatedConnection x1={clientX} y1={clientY} x2={cdnX} y2={cdnY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 3} />
            <AnimatedConnection x1={cdnX} y1={cdnY} x2={clientX} y2={clientY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 4} dashed={false} />
          </>
        )}

        {/* Step 10: Place Search */}
        {currentStep === 10 && (
          <>
            <AnimatedConnection x1={clientX} y1={clientY} x2={searchX} y2={searchY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={searchX} y1={searchY} x2={dbX} y2={dbY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 3} />
            <AnimatedConnection x1={dbX} y1={dbY} x2={searchX} y2={searchY + 30} color="#10b981" isPlaying={isPlaying} speed={speed * 3} dashed={true} />
            <AnimatedConnection x1={searchX} y1={searchY + 30} x2={clientX} y2={clientY + 30} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
          </>
        )}
      </svg>

      {/* OVERLAYS AND VISUALIZATIONS */}

      {/* Step 0: Brute Force */}
      {currentStep === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="text-center">
            <div className="text-white font-space text-2xl mb-8">Distance to 1,000,000 businesses</div>
            <div className="relative w-[400px] h-[300px] border border-gray-700 bg-[#0a1526] overflow-hidden">
              {isPlaying && Array.from({length: 100}).map((_, i) => (
                <div key={i} className="absolute w-1 h-1 bg-[#ef4444]" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }} />
              ))}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-8 h-8 text-[#06b6d4]" />
              </div>
            </div>
            <div className="mt-4 text-[#ef4444] font-mono text-xl font-bold animate-pulse">O(N) = Too Slow</div>
          </div>
        </div>
      )}

      {/* Step 1: Geohashing */}
      {currentStep === 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="relative w-[500px] h-[500px] border border-gray-700 bg-[#0a1526] grid grid-cols-4 grid-rows-4">
            {Array.from({length: 16}).map((_, i) => (
              <div key={i} className="border border-gray-800 flex items-center justify-center text-gray-700 font-mono text-xs">
                {`dr5${i.toString(16)}`}
              </div>
            ))}
            <div className="absolute top-[25%] left-[50%] w-[25%] h-[25%] bg-[#06b6d4]/20 border-2 border-[#06b6d4] flex items-center justify-center">
              <span className="text-[#06b6d4] font-bold font-mono">dr5ru</span>
            </div>
          </div>
          <div className="absolute bottom-12 text-[#10b981] font-mono text-xl bg-[#0a1526] p-4 rounded border border-[#10b981]">
            SELECT * FROM places WHERE geohash LIKE 'dr5ru%'
          </div>
        </div>
      )}

      {/* Step 2: Quadtree */}
      {currentStep === 2 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="relative w-[500px] h-[500px] border border-[#f59e0b] bg-[#0a1526]">
            {/* Dense Area */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] border border-gray-700 grid grid-cols-2 grid-rows-2">
              <div className="border border-gray-700"></div>
              <div className="border border-gray-700 grid grid-cols-2 grid-rows-2">
                 <div className="border border-gray-600 bg-[#f59e0b]/20"></div>
                 <div className="border border-gray-600"></div>
                 <div className="border border-gray-600"></div>
                 <div className="border border-gray-600 grid grid-cols-2 grid-rows-2">
                    <div className="border border-gray-500 bg-[#f59e0b]/40 flex items-center justify-center"><MapPin className="w-3 h-3 text-white"/></div>
                    <div className="border border-gray-500 bg-[#f59e0b]/40 flex items-center justify-center"><MapPin className="w-3 h-3 text-white"/></div>
                    <div className="border border-gray-500 bg-[#f59e0b]/40 flex items-center justify-center"><MapPin className="w-3 h-3 text-white"/></div>
                    <div className="border border-gray-500 bg-[#f59e0b]/40 flex items-center justify-center"><MapPin className="w-3 h-3 text-white"/></div>
                 </div>
              </div>
              <div className="border border-gray-700"></div>
              <div className="border border-gray-700"></div>
            </div>
            {/* Sparse Areas */}
            <div className="absolute top-0 left-0 w-[50%] h-[50%] border border-gray-700 flex items-center justify-center"><span className="text-xs text-gray-500">Empty</span></div>
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] border border-gray-700"></div>
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] border border-gray-700"></div>
          </div>
          <div className="absolute bottom-12 text-[#f59e0b] font-space text-xl">Quadtree: Adapts to Density</div>
        </div>
      )}

      {/* Step 4: Dijkstra Explosion */}
      {currentStep === 4 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20 overflow-hidden">
          <div className="relative w-[800px] h-[600px]">
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-[#06b6d4] rounded-full z-10" />
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#10b981] rounded-full z-10" />
            {dijkstraNodes.map(node => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ delay: node.delay, duration: 0.5 }}
                className="absolute w-2 h-2 bg-[#ef4444] rounded-full"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              />
            ))}
            <div className="absolute inset-0 border-[40px] border-[#ef4444]/20 rounded-full animate-ping pointer-events-none" style={{ left: '10%', top: '10%', width: '80%', height: '80%' }} />
          </div>
          <div className="absolute top-12 text-[#ef4444] font-space text-2xl bg-black/80 px-4 py-2 rounded">Standard Dijkstra explores EVERYWHERE</div>
        </div>
      )}

      {/* Step 5: Bidirectional Dijkstra */}
      {currentStep === 5 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20 overflow-hidden">
          <div className="relative w-[800px] h-[600px] flex items-center justify-center">
            {/* Source */}
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-[#06b6d4] rounded-full z-10" />
            <motion.div 
              className="absolute top-1/2 left-1/4 border-2 border-[#06b6d4] bg-[#06b6d4]/10 rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={isPlaying ? { width: [0, 300], height: [0, 300] } : {}}
              transition={{ duration: 2, ease: "linear" }}
            />
            {/* Destination */}
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#f59e0b] rounded-full z-10" />
            <motion.div 
              className="absolute top-1/2 right-1/4 border-2 border-[#f59e0b] bg-[#f59e0b]/10 rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={isPlaying ? { width: [0, 300], height: [0, 300] } : {}}
              transition={{ duration: 2, ease: "linear" }}
            />
            
            {/* The Route (appears when they meet) */}
            <motion.path 
              d="M 200 300 Q 400 200 600 300" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="6" 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isPlaying ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ delay: 2, duration: 0.5 }}
              className="absolute inset-0"
            />
          </div>
          <div className="absolute bottom-12 text-[#10b981] font-space text-2xl bg-black/80 px-4 py-2 rounded">Bidirectional: Meets in the middle. 4x Faster.</div>
        </div>
      )}

      {/* Step 6: Contraction Hierarchies */}
      {currentStep === 6 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020611] z-20">
          <div className="flex justify-between w-[800px] items-end mb-8 border-b border-gray-700 pb-4">
            <div className="flex flex-col items-center">
              <div className="w-64 h-2 bg-gray-600 mb-2"></div>
              <div className="text-gray-400 text-xs">Local Roads (Millions)</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-48 h-3 bg-[#f59e0b] mb-2"></div>
              <div className="text-[#f59e0b] text-xs">Arterials</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-4 bg-[#8b5cf6] mb-2"></div>
              <div className="text-[#8b5cf6] text-xs">Highways</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-6 bg-[#06b6d4] mb-2"></div>
              <div className="text-[#06b6d4] font-bold text-xs">Freeways (Top Level)</div>
            </div>
          </div>
          <div className="w-[600px] bg-[#0a1526] p-6 rounded-xl border border-[#06b6d4]">
            <div className="text-[#06b6d4] font-mono text-sm mb-4">Query: Toronto → Montreal</div>
            <div className="flex items-center gap-4 text-white">
               <div className="flex-1 border-b-2 border-gray-600 border-dashed"></div>
               <div className="bg-[#06b6d4]/20 px-4 py-2 rounded font-bold text-[#06b6d4]">Only Highway Nodes Searched</div>
               <div className="flex-1 border-b-2 border-gray-600 border-dashed"></div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Overlay Nodes */}
      {(currentStep === 3 || currentStep === 7 || currentStep >= 8) && currentStep !== 9 && currentStep !== 10 && (
        <>
          <NodeBox id="user" x={clientX} y={clientY} icon={Smartphone} label="Driver" color="#06b6d4" />
          <NodeBox id="router" x={routerX} y={routerY} icon={Route} label="Routing Svc" color="#10b981" />
          <NodeBox id="traffic" x={trafficX} y={trafficY} icon={Activity} label="Live Traffic" sublabel="1B Androids" color="#ef4444" />
        </>
      )}

      {currentStep === 8 && (
        <div className="absolute left-[30%] top-[60%] bg-[#0a1526] border border-[#f59e0b] p-4 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
             <Clock className="text-[#f59e0b] w-5 h-5"/>
             <span className="text-white font-space font-bold">ETA Prediction</span>
          </div>
          <div className="text-xs font-mono text-gray-400">
             Base Time: 18m<br/>
             Historical Traffic: +2m<br/>
             Live Incidents: +3m
          </div>
          <div className="mt-2 text-2xl font-bold text-[#f59e0b]">23 mins</div>
        </div>
      )}

      {currentStep === 9 && (
        <>
          <NodeBox id="user9" x={clientX} y={clientY} icon={Smartphone} label="Map Client" color="#06b6d4" />
          <NodeBox id="cdn9" x={cdnX} y={cdnY} icon={Layers} label="CDN Edge" sublabel="Pre-rendered Tiles" color="#8b5cf6" />
          <div className="absolute left-[50%] top-[40%] grid grid-cols-3 grid-rows-3 gap-1 p-2 bg-[#0a1526] border border-gray-700 rounded">
             {Array.from({length: 9}).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-[#8b5cf6]/20 border border-[#8b5cf6]/50 flex items-center justify-center">
                  <span className="text-[10px] text-[#8b5cf6]/80 font-mono">z14</span>
                </div>
             ))}
          </div>
        </>
      )}

      {currentStep === 10 && (
        <>
          <NodeBox id="user10" x={clientX} y={clientY} icon={Smartphone} label="Query" sublabel="'Coffee'" color="#06b6d4" />
          <NodeBox id="search" x={searchX} y={searchY} icon={Search} label="Places API" color="#f59e0b" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="Elasticsearch" sublabel="+ Geohash Filter" color="#10b981" />
          <div className="absolute left-[35%] top-[50%] bg-[#0a1526] border border-[#f59e0b] p-4 rounded shadow-xl">
             <div className="text-[#f59e0b] text-xs font-mono mb-2 uppercase border-b border-[#f59e0b]/30 pb-1">ML Ranking Factors</div>
             <div className="text-white text-sm">1. Proximity (Geohash)</div>
             <div className="text-white text-sm">2. Ratings / Reviews</div>
             <div className="text-white text-sm">3. Open Now</div>
             <div className="text-white text-sm">4. Personalization</div>
          </div>
        </>
      )}

      {/* Scale Numbers */}
      {currentStep === 11 && (
        <div className="absolute inset-0 bg-[#020611]/80 backdrop-blur-sm z-40 flex flex-wrap items-center justify-center gap-8 p-12">
          <ScaleNumbers value={1000000000} label="Monthly Active Users" />
          <ScaleNumbers value={10000000} label="Road Segments" />
          <ScaleNumbers value={1000000000} label="Android Traffic Probes" />
          <ScaleNumbers value={200} label="Routing Latency" suffix="ms" />
          <ScaleNumbers value={50000000} label="Updates per Day" />
        </div>
      )}

    </div>
  );
};

export default GoogleMapsAnim;
