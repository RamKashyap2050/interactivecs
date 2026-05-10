import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm font-space transition-all duration-300 outline-none",
              isActive ? "text-deep-navy font-bold" : "text-gray-400 hover:text-white"
            )}
            style={{
              textShadow: isActive ? 'none' : `0 0 10px ${cat.color}40`
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryIndicator"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: cat.color, boxShadow: `0 0 15px ${cat.color}` }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
