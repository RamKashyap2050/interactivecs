import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { caseStudies, caseStudyCategories } from '../data/caseStudies';
import CategoryFilter from '../components/CategoryFilter';
import CaseStudyCard from '../components/CaseStudyCard';

const CaseStudiesSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredData = caseStudies.filter(
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
          System Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#06b6d4]">Case Studies</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 font-source max-w-2xl mx-auto"
        >
          Watch how petabyte-scale systems handle failure, scale, and latency.
          Every case study is a step-by-step interactive lecture.
        </motion.p>
      </div>

      <CategoryFilter
        categories={caseStudyCategories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredData.map((item) => (
            <CaseStudyCard key={item.id} caseStudy={item} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CaseStudiesSection;
