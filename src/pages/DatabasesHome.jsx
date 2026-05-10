import React from 'react';
import { motion } from 'framer-motion';
import { Database, LayoutGrid, Network } from 'lucide-react';
import DatabasePortal from '../components/DatabasePortal';

const DatabasesHome = () => {
  const portals = [
    {
      id: 'sql',
      type: 'sql',
      title: 'SQL',
      icon: LayoutGrid,
      color: '#00f5ff',
      features: ['Relational', 'Structured', 'ACID'],
      tagline: 'Structure is power.',
      link: '/databases/sql'
    },
    {
      id: 'nosql',
      type: 'nosql',
      title: 'NoSQL',
      icon: Database,
      color: '#f59e0b',
      features: ['Distributed', 'Flexible', 'Scalable'],
      tagline: 'Scale is freedom.',
      link: '/databases/nosql'
    },
    {
      id: 'graph',
      type: 'graph',
      title: 'Graph DB',
      icon: Network,
      color: '#39ff14',
      features: ['Connected', 'Traversable', 'Relational'],
      tagline: 'Connection is everything.',
      link: '/databases/graph'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-source">
      <div className="text-center mb-16 relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-space font-bold mb-6 tracking-tight text-white"
        >
          Databases <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-electric-cyan)] to-[var(--color-phosphor-green)]">Deep Dive</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Explore the fundamental architecture of modern storage. Three portals. Three paradigms.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
        {portals.map((portal, index) => (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5, type: 'spring' }}
          >
            <DatabasePortal {...portal} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DatabasesHome;
