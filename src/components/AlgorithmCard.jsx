import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { cn } from '../utils/cn';
import AnimationFactory from '../animations/index';

const AlgorithmCard = ({ algorithm }) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between h-[420px] rounded-xl border border-gray-800 bg-[#0a1526]/80 backdrop-blur-md overflow-hidden hover:border-transparent transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ 
          boxShadow: `inset 0 0 30px ${algorithm.color}20, 0 0 20px ${algorithm.color}40`,
          border: `1px solid ${algorithm.color}`,
          borderRadius: '0.75rem'
        }}
      />
      
      {/* Circuit board faint texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span 
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm"
            style={{ backgroundColor: `${algorithm.color}20`, color: algorithm.color, border: `1px solid ${algorithm.color}40` }}
          >
            {algorithm.category}
          </span>
        </div>

        <h3 className="text-xl font-space font-bold mb-2 text-white">
          {algorithm.name}
        </h3>
        
        <p className="text-sm md:text-base text-gray-400 font-source line-clamp-3 mb-6">
          {algorithm.tagline}
        </p>

        {/* Thumbnail Placeholder / Preview */}
        <div className="mt-auto h-40 w-full rounded-lg bg-[#050d1a] border border-gray-800/50 flex items-center justify-center group-hover:border-gray-700 transition-colors relative overflow-hidden">
           {isPreviewing ? (
             <AnimationFactory algorithmSlug={algorithm.slug} preview={true} />
           ) : (
             <>
               <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] to-transparent opacity-50 z-10"></div>
               <button 
                 onClick={(e) => { e.preventDefault(); setIsPreviewing(true); }}
                 className="z-20 p-2 outline-none"
               >
                 <Play className="w-8 h-8 opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300" style={{ color: algorithm.color }} />
               </button>
               {/* Subtle decorative grid */}
               <div className="absolute inset-0 z-0" style={{ backgroundImage: `linear-gradient(${algorithm.color}10 1px, transparent 1px), linear-gradient(90deg, ${algorithm.color}10 1px, transparent 1px)`, backgroundSize: '10px 10px' }}></div>
             </>
           )}
        </div>
      </div>

      <div className="relative z-10 p-4 border-t border-gray-800/50 bg-[#050d1a]/50 backdrop-blur-md">
        <Link 
          to={`/topic/${algorithm.slug}`}
          className="flex items-center justify-between w-full text-sm font-space text-gray-300 hover:text-white transition-colors group/link"
        >
          <span>Read More</span>
          <span className="transform group-hover/link:translate-x-1 transition-transform" style={{ color: algorithm.color }}>→</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default AlgorithmCard;
