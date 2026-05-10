import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataStructures, dsaCategories } from '../data/dataStructures';
import CategoryFilter from '../components/CategoryFilter';
import AlgorithmCard from '../components/AlgorithmCard';
import BigOVisualizer from '../components/BigOVisualizer';

const DSASection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredData = dataStructures.filter(
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
          Data Structures <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#06b6d4]">& Algorithms</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 font-source max-w-2xl mx-auto"
        >
          The fundamental building blocks of computer science. Explore how data is organized, sorted, and searched under the hood.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <BigOVisualizer />
      </motion.div>

      <CategoryFilter
        categories={dsaCategories}
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

export default DSASection;
