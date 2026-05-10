import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, LayoutGrid, Share2, Network } from 'lucide-react';

const SQLPortalBackground = ({ isHovered }) => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f5ff" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <AnimatePresence>
          {isHovered && (
            <>
              {/* Tables assembling */}
              <motion.rect initial={{ y: -50, opacity: 0 }} animate={{ y: 40, opacity: 1 }} exit={{ y: 150, opacity: 0 }} transition={{ duration: 0.5, type: 'spring' }} x="40" width="80" height="120" fill="none" stroke="#00f5ff" strokeWidth="2" />
              <motion.rect initial={{ x: -50, opacity: 0 }} animate={{ x: 160, opacity: 1 }} exit={{ x: 250, opacity: 0 }} transition={{ duration: 0.6, type: 'spring' }} y="80" width="120" height="80" fill="none" stroke="#00f5ff" strokeWidth="2" />
              {/* Connection line */}
              <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.5 }} d="M 120 100 L 160 100" fill="none" stroke="#00f5ff" strokeWidth="2" strokeDasharray="4 4" />
            </>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
};

const NoSQLPortalBackground = ({ isHovered }) => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-20 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2;
              const x = Math.cos(angle) * 80;
              const y = Math.sin(angle) * 80;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x, y, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#f59e0b] bg-[#f59e0b]/20 flex items-center justify-center"
                >
                  <Database className="w-3 h-3 text-[#f59e0b]" />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute inset-0 rounded-full border border-[#f59e0b]"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GraphDBPortalBackground = ({ isHovered }) => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <AnimatePresence>
          {isHovered && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Edges */}
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.5 }} x1="100" y1="100" x2="200" y2="150" stroke="#39ff14" strokeWidth="1.5" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.5 }} x1="200" y1="150" x2="150" y2="250" stroke="#39ff14" strokeWidth="1.5" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} x1="200" y1="150" x2="280" y2="120" stroke="#39ff14" strokeWidth="1.5" />
              
              {/* Nodes */}
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} cx="100" cy="100" r="8" fill="#0a1526" stroke="#39ff14" strokeWidth="2" />
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} cx="200" cy="150" r="10" fill="#39ff14" />
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} cx="150" cy="250" r="8" fill="#0a1526" stroke="#39ff14" strokeWidth="2" />
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }} cx="280" cy="120" r="8" fill="#0a1526" stroke="#39ff14" strokeWidth="2" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
};

const DatabasePortal = ({ type, title, features, tagline, link, color, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBackground = () => {
    switch (type) {
      case 'sql': return <SQLPortalBackground isHovered={isHovered} />;
      case 'nosql': return <NoSQLPortalBackground isHovered={isHovered} />;
      case 'graph': return <GraphDBPortalBackground isHovered={isHovered} />;
      default: return null;
    }
  };

  return (
    <Link 
      to={link}
      className="block relative overflow-hidden rounded-2xl bg-[#0a1526] border border-gray-800 transition-all duration-500 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? `0 0 30px ${color}33` : 'none',
        borderColor: isHovered ? color : '#1f2937'
      }}
    >
      {getBackground()}
      
      <div className="relative z-10 p-8 h-[400px] flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800" style={{ borderColor: isHovered ? color : '#1f2937' }}>
            <Icon className="w-8 h-8 transition-colors duration-500" style={{ color: isHovered ? color : '#9ca3af' }} />
          </div>
          <h2 className="text-3xl font-space font-bold text-white tracking-tight">{title}</h2>
        </div>

        <ul className="space-y-4 mb-auto">
          {features.map((feature, idx) => (
            <motion.li 
              key={idx}
              initial={{ x: 0 }}
              animate={{ x: isHovered ? 10 : 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
              className="text-gray-400 font-source text-lg flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
              {feature}
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div 
                key="tagline"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="font-space font-bold text-lg text-center tracking-wider"
                style={{ color }}
              >
                "{tagline}"
              </motion.div>
            ) : (
              <motion.div 
                key="enter"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="font-space font-bold text-gray-500 uppercase tracking-widest text-center"
              >
                [ Enter Portal ]
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Link>
  );
};

export default DatabasePortal;
