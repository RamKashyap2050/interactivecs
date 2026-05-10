import React from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Smartphone, Globe, HardDrive, Monitor } from 'lucide-react';

export const AnimatedConnection = ({ x1, y1, x2, y2, color, isPlaying, speed, dashed = true, path = null, status = 'healthy' }) => {
  let finalColor = color;
  let finalPlaying = isPlaying;
  let animDirection = [20, 0];

  if (status === 'blocked') {
    finalColor = '#ef4444';
    finalPlaying = false;
  } else if (status === 'compensating') {
    finalColor = '#ef4444';
    animDirection = [0, 20];
  } else if (status === 'inactive') {
    finalColor = '#374151'; // Dim gray for inactive
    finalPlaying = false;
  }

  const markerId = finalColor === '#10b981' ? 'url(#arrow-green)' : finalColor === '#ef4444' ? 'url(#arrow-red)' : finalColor === '#f59e0b' ? 'url(#arrow-amber)' : 'url(#arrow-gray)';
  
  if (path) {
    return (
      <motion.path 
        d={path} 
        fill="none" 
        stroke={finalColor} 
        strokeWidth="2" 
        strokeDasharray={dashed ? "5 5" : "none"}
        markerEnd={markerId}
        animate={{ strokeDashoffset: finalPlaying ? animDirection : 0 }}
        transition={{ repeat: Infinity, duration: 1 / speed, ease: "linear" }}
      />
    );
  }
  
  return (
    <motion.line 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      stroke={finalColor} 
      strokeWidth="2" 
      strokeDasharray={dashed ? "5 5" : "none"}
      markerEnd={markerId}
      animate={{ strokeDashoffset: finalPlaying ? animDirection : 0 }}
      transition={{ repeat: Infinity, duration: 1 / speed, ease: "linear" }}
    />
  );
};

export const NodeBox = ({ id, x, y, icon: Icon, label, sublabel, color, status = 'active' }) => {
  let opacity = status === 'inactive' ? 0.4 : 1;
  let borderColor = status === 'failed' ? '#ef4444' : color;
  let bgColor = status === 'failed' ? '#ef444420' : `${color}15`;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity }}
      transition={{ duration: 0.5 }}
      className="absolute flex flex-col items-center justify-center p-3 rounded-xl border backdrop-blur-md z-10"
      style={{
        left: x - 60, // center offset (width 120/2)
        top: y - 35,  // center offset (height 70/2)
        width: 120,
        height: 70,
        backgroundColor: bgColor,
        borderColor: `${borderColor}60`,
        boxShadow: status === 'active' ? `0 0 20px ${color}20` : 'none'
      }}
    >
      <Icon className="w-6 h-6 mb-1" style={{ color: status === 'failed' ? '#ef4444' : color }} />
      <span className="text-[10px] font-space font-bold text-white text-center leading-tight">
        {label}
      </span>
      {sublabel && (
        <span className="text-[8px] font-space text-gray-400 text-center">
          {sublabel}
        </span>
      )}
    </motion.div>
  );
};

export const SvgDefs = () => (
  <defs>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
    </marker>
    <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563" />
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
    </marker>
  </defs>
);
