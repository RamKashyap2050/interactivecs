import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const AnimationPlayer = ({ children, isPlaying, onTogglePlay, onRestart, speed, onSpeedChange, color }) => {
  return (
    <div className="relative w-full min-h-[1000px] bg-[#020611] rounded-xl border border-gray-800 flex flex-col shadow-2xl shadow-black/50">
      {/* Animation Canvas Area */}
      <div className="flex-grow relative overflow-hidden">
        {/* Faint grid background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          {children}
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-14 bg-[#050d1a] border-t border-gray-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onTogglePlay}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-white outline-none"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={onRestart}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white outline-none"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-space uppercase">Speed</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-24 accent-[var(--color-electric-cyan)]"
            style={{ accentColor: color }}
          />
          <span className="text-xs text-gray-400 font-space w-8 text-right">{speed.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
};

export default AnimationPlayer;
