import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const complexities = [
  { id: 'O(1)', color: '#39ff14', func: (n) => 10, label: 'O(1) - Constant' },
  { id: 'O(log n)', color: '#10b981', func: (n) => Math.log2(n) * 15, label: 'O(log n) - Logarithmic' },
  { id: 'O(n)', color: '#f59e0b', func: (n) => n * 2, label: 'O(n) - Linear' },
  { id: 'O(n log n)', color: '#f97316', func: (n) => n * Math.log2(n) * 0.8, label: 'O(n log n) - Linearithmic' },
  { id: 'O(n^2)', color: '#ef4444', func: (n) => Math.pow(n, 2) * 0.1, label: 'O(n²) - Quadratic' },
  { id: 'O(n!)', color: '#dc2626', func: (n) => {
    let f = 1; for(let i=1; i<=n; i++) f*=i; return f * 0.001; 
  }, label: 'O(n!) - Factorial' }
];

const BigOVisualizer = () => {
  const [nValue, setNValue] = useState(10);
  const canvasRef = useRef(null);
  
  // Draw the chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, 0);
    ctx.stroke();

    // Max display ranges
    const maxN = 50;
    const maxY = 250;

    // Draw lines
    complexities.forEach(comp => {
      ctx.beginPath();
      ctx.strokeStyle = comp.color;
      ctx.lineWidth = 3;
      // glow
      ctx.shadowColor = comp.color;
      ctx.shadowBlur = 10;
      
      for (let x = 1; x <= maxN; x++) {
        const yVal = comp.func(x);
        // Map to canvas
        const px = (x / maxN) * width;
        const py = height - (yVal / maxY) * height;
        
        if (x === 1) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        
        // Stop drawing if it shoots off the top
        if (py < -50) break;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Draw current N indicator
    const currentPx = (nValue / maxN) * width;
    ctx.strokeStyle = 'white';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(currentPx, height);
    ctx.lineTo(currentPx, 0);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw intersection dots
    complexities.forEach(comp => {
      const yVal = comp.func(nValue);
      const py = height - (yVal / maxY) * height;
      if (py > -10 && py <= height) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(currentPx, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = comp.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    
  }, [nValue]);

  return (
    <div className="w-full bg-[#050d1a] border border-gray-800 rounded-xl p-8 mb-16 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Interactive Chart */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-3xl font-space font-bold text-white mb-2">Big-O Time Complexity</h2>
            <p className="text-gray-400 font-source text-sm">
              Drag the slider to increase data size (N) and observe how operations (time) scale for different complexities.
            </p>
          </div>
          
          <div className="relative w-full h-[300px] mb-8 bg-[#020611] rounded-lg border border-gray-800 overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={300} 
              className="w-full h-full"
            />
            {/* Axis labels */}
            <div className="absolute left-2 top-2 text-xs font-space text-gray-500 rotate-0">Operations (Time) ↑</div>
            <div className="absolute right-2 bottom-2 text-xs font-space text-gray-500">Elements (N) →</div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-white font-space font-bold w-16">N = {nValue}</span>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={nValue} 
              onChange={(e) => setNValue(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[var(--color-electric-cyan)]"
            />
          </div>
        </div>

        {/* Right: Legend & Live Values */}
        <div className="w-full md:w-72 flex flex-col justify-center space-y-4">
          <h3 className="text-gray-400 font-space text-sm uppercase tracking-wider mb-2 border-b border-gray-800 pb-2">
            Operations at N={nValue}
          </h3>
          {complexities.map(comp => {
            const val = Math.round(comp.func(nValue));
            const displayVal = val > 9999 ? '∞ (Off chart)' : val;
            
            return (
              <motion.div 
                key={comp.id}
                layout
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: comp.color, color: comp.color }}></div>
                  <span className="font-space text-sm text-gray-300">{comp.label}</span>
                </div>
                <span className="font-mono text-sm" style={{ color: comp.color }}>
                  {displayVal}
                </span>
              </motion.div>
            )
          })}
          <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-500 font-source italic">
            *Values are scaled for visualization purposes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigOVisualizer;
