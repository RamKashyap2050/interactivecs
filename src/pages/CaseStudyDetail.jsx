import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, Building2 } from 'lucide-react';
import { caseStudies } from '../data/caseStudies';
import CinematicPlayer from '../components/CinematicPlayer';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const caseStudy = caseStudies.find(c => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-space font-bold text-white mb-4">Case Study Not Found</h2>
          <button onClick={() => navigate('/case-studies')} className="text-[var(--color-electric-cyan)] hover:underline">
            Return to Case Studies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#050d1a] selection:bg-[var(--color-electric-cyan)] selection:text-[#050d1a]">
      {/* Top Navigation */}
      <div className="border-b border-gray-800 bg-[#020611]/80 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/case-studies" className="flex items-center text-sm font-space text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </Link>
          <div className="flex items-center gap-3">
            <span 
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm"
              style={{ backgroundColor: `${caseStudy.color}20`, color: caseStudy.color, border: `1px solid ${caseStudy.color}40` }}
            >
              {caseStudy.category.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Cinematic Player Section (70vh) */}
      <div className="w-full h-[70vh] min-h-[600px] border-b border-gray-800 bg-[#020611] relative overflow-hidden">
        <CinematicPlayer caseStudy={caseStudy} />
      </div>

      {/* Detail Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* The Interview Angle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981] to-[#06b6d4] opacity-5 rounded-2xl pointer-events-none"></div>
          <div className="border border-gray-800 bg-[#0a1526]/50 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#10b981] to-[#06b6d4]"></div>
            
            <h2 className="text-2xl font-space font-bold text-white mb-6 flex items-center gap-3">
              <span className="p-2 bg-[#10b981]/10 rounded-lg">
                <Lightbulb className="w-6 h-6 text-[#10b981]" />
              </span>
              The Interview Angle
            </h2>
            
            <p className="text-gray-300 font-source text-lg mb-8">
              This case study is famous in system design interviews. Here is what interviewers actually test:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-sm font-space font-bold text-gray-400 uppercase tracking-wider">Key Questions</h3>
                <ul className="space-y-3">
                  {caseStudy.interviewAngle.questions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                      <span className="text-gray-300 font-source">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl p-5">
                  <h3 className="text-sm font-space font-bold text-[#ef4444] flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Common Mistake
                  </h3>
                  <p className="text-gray-300 font-source text-sm">{caseStudy.interviewAngle.mistake}</p>
                </div>

                <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-xl p-5">
                  <h3 className="text-sm font-space font-bold text-[#f59e0b] flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    The True Bottleneck
                  </h3>
                  <p className="text-gray-300 font-source text-sm">{caseStudy.interviewAngle.bottleneck}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prerequisites */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-space font-bold text-white mb-4 border-b border-gray-800 pb-2">Prerequisite Patterns</h3>
            <div className="flex flex-col gap-3">
              {caseStudy.prerequisites.map(pre => (
                <Link 
                  key={pre.slug} 
                  to={`/topic/${pre.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-[#0a1526] hover:border-[var(--color-electric-cyan)] transition-colors group"
                >
                  <span className="font-source text-gray-300 group-hover:text-white transition-colors">{pre.name}</span>
                  <span className="text-[var(--color-electric-cyan)] transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Companies */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-space font-bold text-white mb-4 border-b border-gray-800 pb-2">Companies Using This</h3>
            <div className="flex flex-wrap gap-3">
              {caseStudy.companies.map(company => (
                <div key={company} className="flex items-center gap-2 p-3 px-4 rounded-xl border border-gray-800 bg-[#0a1526]">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-space text-sm text-gray-300">{company}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default CaseStudyDetail;
