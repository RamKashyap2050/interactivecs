import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Clock, BarChart, Building2 } from 'lucide-react';
import { cn } from '../utils/cn';

const CaseStudyCard = ({ caseStudy }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between rounded-xl border border-gray-800 bg-[#0a1526]/80 backdrop-blur-md overflow-hidden hover:border-transparent transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ 
          boxShadow: `inset 0 0 30px ${caseStudy.color}20, 0 0 20px ${caseStudy.color}40`,
          border: `1px solid ${caseStudy.color}`,
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
            style={{ backgroundColor: `${caseStudy.color}20`, color: caseStudy.color, border: `1px solid ${caseStudy.color}40` }}
          >
            {caseStudy.category.replace('-', ' ')}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-space font-medium">
            <Clock className="w-3 h-3" />
            {caseStudy.readTime}
          </div>
        </div>

        <h3 className="text-2xl font-space font-bold mb-2 text-white">
          {caseStudy.name}
        </h3>
        
        <p className="text-sm md:text-base text-gray-300 font-source line-clamp-2 mb-4">
          {caseStudy.tagline}
        </p>

        <div className="bg-[#050d1a] border border-gray-800/50 rounded-lg p-3 mb-6">
          <div className="text-xs font-space text-gray-500 uppercase tracking-wider mb-1">Famous For</div>
          <p className="text-sm text-gray-300 font-source italic">
            "{caseStudy.famousFor}"
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.map(tag => (
              <span key={tag} className="text-xs font-space px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-space text-gray-400 pt-2 border-t border-gray-800">
            <div className="flex items-center gap-1">
              <BarChart className="w-3 h-3" />
              {caseStudy.difficulty}
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {caseStudy.companies.join(', ')}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 border-t border-gray-800/50 bg-[#050d1a]/50 backdrop-blur-md">
        <Link 
          to={`/case-study/${caseStudy.slug}`}
          className="flex items-center justify-center w-full py-2 rounded-lg text-sm font-space font-bold text-white transition-colors group/link relative overflow-hidden"
          style={{ backgroundColor: `${caseStudy.color}20`, border: `1px solid ${caseStudy.color}40` }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/link:opacity-100 transition-opacity"></div>
          <Play className="w-4 h-4 mr-2" style={{ color: caseStudy.color }} />
          Start Interactive Case Study
        </Link>
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;
