import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Smartphone, Server, Database, Zap, Activity } from 'lucide-react';

const UberBackendAnim = ({ currentStep, isPlaying, speed }) => {
  const [drivers, setDrivers] = useState([
    { id: 1, x: 20, y: 30, angle: 45, status: 'idle' },
    { id: 2, x: 70, y: 20, angle: 120, status: 'idle' },
    { id: 3, x: 40, y: 80, angle: 200, status: 'idle' },
    { id: 4, x: 80, y: 70, angle: 30, status: 'idle' },
    { id: 5, x: 10, y: 60, angle: 300, status: 'idle' },
  ]);

  const [rider, setRider] = useState({ x: 50, y: 50, active: false });
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    setInternalStep(0);
    if (currentStep >= 3) setRider(prev => ({ ...prev, active: true }));
    else setRider(prev => ({ ...prev, active: false }));
  }, [currentStep]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setDrivers(prev => prev.map(d => ({
          ...d,
          x: d.x + (Math.random() - 0.5) * 2,
          y: d.y + (Math.random() - 0.5) * 2,
          angle: d.angle + (Math.random() - 0.5) * 20
        })));
        setInternalStep(s => s + 1);
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const color = "#06b6d4";

  return (
    <div className="w-full h-full min-h-[500px] bg-[#020611] rounded-xl border border-gray-800 relative overflow-hidden flex flex-col md:flex-row">
      {/* MAP VIEW */}
      <div className="flex-1 relative bg-[#050d1a] overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Geohash Grid */}
        {currentStep >= 2 && (
          <div className="absolute inset-0 opacity-20 border-2 border-cyan-500/30 grid grid-cols-4 grid-rows-4 pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="border border-cyan-500/20 flex items-center justify-center">
                <span className="text-[8px] text-cyan-400 font-mono">dr5r{i.toString(16)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Drivers */}
        {drivers.map(d => (
          <motion.div
            key={d.id}
            className="absolute z-10"
            animate={{ left: `${d.x}%`, top: `${d.y}%`, rotate: d.angle }}
            transition={{ duration: 1, ease: "linear" }}
          >
            <Navigation className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
          </motion.div>
        ))}

        {/* Rider */}
        <AnimatePresence>
          {rider.active && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute z-20"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative">
                <MapPin className="w-6 h-6 text-white" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-white rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ETA Path */}
        {currentStep >= 5 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.path
              d="M 50 50 L 20 30"
              stroke={color}
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
          </svg>
        )}
      </div>

      {/* METRICS PANEL */}
      <div className="w-full md:w-64 bg-[#0a1526] border-l border-gray-800 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="p-3 bg-[#050d1a] rounded-lg border border-gray-800">
          <div className="text-[10px] text-gray-500 font-space uppercase mb-1 flex items-center gap-2">
            <Activity className="w-3 h-3 text-cyan-400" />
            System Load
          </div>
          <div className="text-xl font-mono text-white">75M <span className="text-xs text-gray-500">pings/min</span></div>
          <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500"
              animate={{ width: ['70%', '85%', '75%'] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </div>

        <div className="p-3 bg-[#050d1a] rounded-lg border border-gray-800">
          <div className="text-[10px] text-gray-500 font-space uppercase mb-1">Location Service</div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <Database className="w-3 h-3 text-cyan-500" />
            Redis (In-Memory)
          </div>
          <div className="mt-2 p-1 bg-black/30 rounded text-[9px] font-mono text-cyan-400 break-all">
            HSET drivers:dr5r7 id:1 {drivers[0].x.toFixed(2)},{drivers[0].y.toFixed(2)}
          </div>
        </div>

        <div className="p-3 bg-[#050d1a] rounded-lg border border-gray-800">
          <div className="text-[10px] text-gray-500 font-space uppercase mb-1">State: {currentStep < 3 ? 'Idle' : 'Matching'}</div>
          <div className="space-y-2">
            <div className={`w-full h-2 rounded ${currentStep >= 3 ? 'bg-cyan-500' : 'bg-gray-800 opacity-20'}`} />
            <div className={`w-full h-2 rounded ${currentStep >= 5 ? 'bg-cyan-500' : 'bg-gray-800 opacity-20'}`} />
            <div className={`w-full h-2 rounded ${currentStep >= 10 ? 'bg-cyan-500' : 'bg-gray-800 opacity-20'}`} />
          </div>
        </div>

        {/* LOG PANEL */}
        <div className="flex-1 bg-black/40 rounded p-2 border border-gray-800 overflow-hidden">
          <div className="text-[8px] font-mono text-gray-500 mb-2 uppercase">Server Log</div>
          <div className="text-[9px] font-mono space-y-1">
            <div className="text-cyan-500">Drivers: 5.2M active</div>
            <div className="text-gray-400">[0.02ms] Geohash prefix match</div>
            <div className="text-gray-400">[1.4ms] Dijkstra ETA calc</div>
            {currentStep >= 3 && <div className="text-white animate-pulse">Request: Rider@50,50</div>}
            {currentStep >= 4 && <div className="text-cyan-400">MatchFound: Driver#1</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UberBackendAnim;
