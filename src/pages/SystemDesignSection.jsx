import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { systemPatterns, systemCategories } from '../data/systemPatterns';
import CategoryFilter from '../components/CategoryFilter';
import AlgorithmCard from '../components/AlgorithmCard';

const SystemDesignSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredData = systemPatterns.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-16 relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-space font-bold mb-6 tracking-tight"
        >
          System Architecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#f43f5e]">Patterns</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 font-source max-w-2xl mx-auto"
        >
          Explore the blueprints of scalable applications. Learn how modern distributed systems communicate, scale, and fail.
        </motion.p>
      </div>

      <CategoryFilter
        categories={systemCategories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredData.map((item) => (
            <AlgorithmCard key={item.id} algorithm={item} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SystemDesignSection;
