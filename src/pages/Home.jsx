import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, algorithms } from '../data/algorithms';
import CategoryFilter from '../components/CategoryFilter';
import AlgorithmCard from '../components/AlgorithmCard';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAlgorithms = algorithms.filter(
    (algo) => activeCategory === 'all' || algo.category === activeCategory
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-16 relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-space font-bold mb-6 tracking-tight"
        >
          ML <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-electric-cyan)] to-[var(--color-phosphor-green)]">Mechanics</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 font-source max-w-2xl mx-auto"
        >
          An interactive encyclopedia of Machine Learning algorithms.
          Select a category to explore how they work under the hood.
        </motion.p>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredAlgorithms.map((algo) => (
            <AlgorithmCard key={algo.id} algorithm={algo} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Home;
