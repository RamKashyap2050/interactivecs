import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Network, Server, Shield, Cpu, Share2, Layers, Terminal } from 'lucide-react';
import { caseStudies } from '../data/caseStudies';

const topics = [
  { id: 'system-design', name: 'System Design', icon: Layers, color: '#f59e0b' },
  { id: 'ml', name: 'Machine Learning', icon: Cpu, color: '#8b5cf6' },
  { id: 'dsa', name: 'Data Structures', icon: Share2, color: '#06b6d4' },
  { id: 'distributed', name: 'Distributed Systems', icon: Network, color: '#10b981' },
  { id: 'databases', name: 'Databases', icon: Database, color: '#ec4899' },
  { id: 'networking', name: 'Networking', icon: Server, color: '#3b82f6' },
  { id: 'security', name: 'Security', icon: Shield, color: '#ef4444' },
  { id: 'devops', name: 'DevOps', icon: Terminal, color: '#f97316' }
];

const LandingPage = () => {
  // Grab the 3 featured case studies
  const featuredCaseStudies = caseStudies.filter(cs => 
    ['google-maps', 'dropbox-sync', 'redis-cache'].includes(cs.slug)
  );

  return (
    <div className="min-h-screen font-source pb-20">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-space font-bold mb-6 tracking-tight text-white"
        >
          Intuition <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-electric-cyan)] to-[var(--color-phosphor-green)]">Engineering</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Master complex computer science concepts through interactive, cinematic visualizations. Stop reading text blocks. Start watching data flow.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/case-studies" className="inline-block bg-transparent border-2 border-[var(--color-electric-cyan)] text-[var(--color-electric-cyan)] px-8 py-4 font-space font-bold uppercase tracking-wider hover:bg-[var(--color-electric-cyan)] hover:text-[#050d1a] transition-all shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:shadow-[0_0_25px_rgba(0,245,255,0.6)]">
            Explore Case Studies
          </Link>
        </motion.div>
      </div>

      {/* Topics Grid */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
        <h2 className="text-3xl font-space font-bold text-white mb-8 border-l-4 border-[var(--color-electric-cyan)] pl-4">Explore Topics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            // Map link based on topic id
            const linkPath = topic.id === 'ml' ? '/ml' : topic.id === 'dsa' ? '/dsa' : topic.id === 'system-design' ? '/system-design' : '/case-studies';
            return (
              <Link to={linkPath} key={topic.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#0a1526] border border-gray-800 p-6 rounded-xl hover:border-[var(--color-electric-cyan)] transition-colors group cursor-pointer h-full"
                >
                  <Icon className="w-8 h-8 mb-4 transition-transform group-hover:scale-110 group-hover:text-[var(--color-electric-cyan)]" style={{ color: topic.color }} />
                  <h3 className="text-white font-space font-bold">{topic.name}</h3>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-[#0a1526]/50 border-y border-gray-800 py-20 mt-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-space font-bold text-center text-white mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-electric-cyan)]/20 border border-[var(--color-electric-cyan)] flex items-center justify-center mx-auto mb-6">
                <span className="text-[var(--color-electric-cyan)] font-space font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-space font-bold text-white mb-4">Choose a System</h3>
              <p className="text-gray-400">Select from real-world architectures like Google Maps, Redis, or Netflix. Every system is broken down into its core primitives.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-phosphor-green)]/20 border border-[var(--color-phosphor-green)] flex items-center justify-center mx-auto mb-6">
                <span className="text-[var(--color-phosphor-green)] font-space font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-space font-bold text-white mb-4">Watch the Data</h3>
              <p className="text-gray-400">Step through the architecture block by block. Watch how data flows, where bottlenecks occur, and how caches interact with databases.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b] flex items-center justify-center mx-auto mb-6">
                <span className="text-[#f59e0b] font-space font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-space font-bold text-white mb-4">Master the Tradeoffs</h3>
              <p className="text-gray-400">Understand not just what components are used, but why. Every animation explains the latency, scale, and complexity tradeoffs made.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Case Studies */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-space font-bold text-white border-l-4 border-[var(--color-phosphor-green)] pl-4">Featured Case Studies</h2>
          <Link to="/case-studies" className="text-[var(--color-electric-cyan)] hover:text-white font-space transition-colors">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCaseStudies.map((cs) => (
            <Link to={`/case-study/${cs.slug}`} key={cs.id} className="block">
              <div className="bg-[#0a1526] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all hover:-translate-y-1 h-full flex flex-col group relative shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: cs.color }}></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono px-2 py-1 bg-gray-800 text-gray-300 rounded uppercase tracking-wider">{cs.category}</span>
                    <span className="text-xs font-mono text-gray-500">{cs.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-space font-bold text-white mb-3 group-hover:text-[var(--color-electric-cyan)] transition-colors">{cs.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1">{cs.tagline}</p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cs.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-mono text-gray-400 bg-[#050d1a] border border-gray-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Case Studies Teaser */}
      <div className="border-t border-gray-800 pt-16 pb-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-space font-bold text-white mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] mr-3 animate-pulse"></span>
            Latest Drops
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar">
            {caseStudies.map((cs) => (
              <Link to={`/case-study/${cs.slug}`} key={`latest-${cs.id}`} className="min-w-[300px] snap-start">
                <div className="bg-[#0a1526] border border-gray-800 p-5 rounded-lg hover:border-gray-600 transition-colors h-full flex flex-col shadow-md">
                  <div className="text-xs font-mono text-gray-500 mb-2">{cs.category}</div>
                  <h4 className="text-white font-space font-bold mb-2 group-hover:text-[var(--color-electric-cyan)]">{cs.name}</h4>
                  <div className="mt-auto flex items-center justify-between">
                     <span className="text-xs font-mono px-2 py-1 bg-gray-800 text-gray-300 rounded">{cs.difficulty}</span>
                     <span className="text-[var(--color-electric-cyan)] text-xs font-space">Watch &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-space font-bold text-white mb-4">Intuition Engineering</h2>
          <p className="text-gray-500 font-source mb-8 max-w-md mx-auto">Visualizing the invisible patterns of computer science. Built for the curious engineer.</p>
          <div className="text-sm font-mono text-gray-600">
            &copy; {new Date().getFullYear()} Intuition Engineering. All systems operational.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
