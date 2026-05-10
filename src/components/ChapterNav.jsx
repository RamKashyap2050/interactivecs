import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const ChapterNav = ({ chapters, activeChapter, onSelect, color = '#00f5ff' }) => {
  return (
    <div className="w-64 bg-[#0a1526] border-r border-gray-800 h-full flex flex-col p-4">
      <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-6 px-4">Chapters</h3>
      <div className="flex flex-col gap-2">
        {chapters.map((chapter, index) => {
          const isActive = activeChapter === index;
          return (
            <button
              key={chapter.id || index}
              onClick={() => onSelect(index)}
              className={`relative px-4 py-3 rounded-lg text-left transition-all duration-300 flex items-center justify-between group overflow-hidden ${
                isActive ? 'bg-[#050d1a] text-white' : 'text-gray-400 hover:bg-[#050d1a] hover:text-gray-200'
              }`}
            >
              <div className="flex flex-col relative z-10">
                <span className="text-xs font-mono mb-1" style={{ color: isActive ? color : '' }}>
                  Chapter {index + 1}
                </span>
                <span className="font-space font-bold text-sm">
                  {chapter.title}
                </span>
              </div>
              
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-50'}`} style={{ color }} />

              {isActive && (
                <motion.div
                  layoutId="activeChapterIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: color }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterNav;
