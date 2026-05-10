import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { getTopicBySlug } from '../data/index';
import MathBlock from '../components/MathBlock';
import AnimationFactory from '../animations/index';

const AlgorithmDetail = () => {
  const { slug } = useParams();
  const algorithm = getTopicBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!algorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-space mb-4">Algorithm Not Found</h1>
          <Link to="/" className="text-[var(--color-electric-cyan)] hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Progress Indicator placeholder */}
      <div className="fixed top-0 left-0 h-1 bg-[var(--color-electric-cyan)] z-50 w-full opacity-50" style={{ transformOrigin: '0%', scaleX: 0 }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 font-space text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>

        {/* 1. HERO */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span 
              className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-sm"
              style={{ backgroundColor: `${algorithm.color}20`, color: algorithm.color, border: `1px solid ${algorithm.color}40` }}
            >
              {algorithm.category}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-space font-bold mb-6" style={{ color: algorithm.color }}>
            {algorithm.name}
          </h1>
          <p className="text-xl text-gray-300 font-source leading-relaxed border-l-4 pl-6 py-2" style={{ borderColor: algorithm.color }}>
            {algorithm.bigIdea}
          </p>
        </div>

        {/* 2. INTUITION & ANIMATION */}
        <section className="mb-20">
          <h2 className="text-2xl font-space font-bold mb-6 text-white border-b border-gray-800 pb-2">Intuition</h2>
          <p className="text-lg text-gray-400 font-source mb-8 leading-relaxed">
            {algorithm.intuition}
          </p>
          
          <AnimationFactory algorithmSlug={algorithm.slug} />
        </section>

        {/* 3. MATH & THEORY (Only if math exists) */}
        {algorithm.math && algorithm.math.equation !== "" && (
          <section className="mb-20">
            <h2 className="text-2xl font-space font-bold mb-6 text-white border-b border-gray-800 pb-2">Math & Theory</h2>
            <div className="bg-[#050d1a]/50 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-sm text-gray-400 font-space uppercase mb-4 tracking-wider">Core Equation</h3>
              <MathBlock math={algorithm.math.equation} />
            </div>
            {algorithm.math.costFunction && (
              <div className="bg-[#050d1a]/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm text-gray-400 font-space uppercase mb-4 tracking-wider">Cost Function</h3>
                <MathBlock math={algorithm.math.costFunction} />
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-[#050d1a]/50 border border-gray-800 rounded-xl p-4 flex-1 min-w-[200px]">
                <h3 className="text-xs text-gray-500 font-space uppercase mb-1">Time Complexity</h3>
                <p className="font-mono text-[var(--color-electric-cyan)]">{algorithm.math.complexity.time}</p>
              </div>
              <div className="bg-[#050d1a]/50 border border-gray-800 rounded-xl p-4 flex-1 min-w-[200px]">
                <h3 className="text-xs text-gray-500 font-space uppercase mb-1">Space Complexity</h3>
                <p className="font-mono text-[var(--color-phosphor-green)]">{algorithm.math.complexity.space}</p>
              </div>
            </div>
          </section>
        )}

        {/* 4. ALGORITHM STEPS OR DESIGN PRINCIPLES */}
        {algorithm.steps && (
          <section className="mb-20">
            <h2 className="text-2xl font-space font-bold mb-6 text-white border-b border-gray-800 pb-2">Algorithm Steps</h2>
            <div className="space-y-4 font-source text-lg text-gray-300">
              {algorithm.steps.map((step, index) => (
                <div key={index} className="flex">
                  <span className="font-space text-gray-500 mr-4 w-6 text-right">{index + 1}.</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {algorithm.principles && (
          <section className="mb-20">
            <h2 className="text-2xl font-space font-bold mb-6 text-white border-b border-gray-800 pb-2">Core Design Principles</h2>
            <div className="space-y-4 font-source text-lg text-gray-300">
              {algorithm.principles.map((principle, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0" style={{ backgroundColor: algorithm.color }}></div>
                  <p>{principle}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. PROS & CONS */}
        {(algorithm.pros || algorithm.cons) && (
          <section className="mb-20">
            <h2 className="text-2xl font-space font-bold mb-6 text-white border-b border-gray-800 pb-2">Pros & Cons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#050d1a]/50 border border-gray-800 rounded-xl p-6">
                <h3 className="flex items-center text-[var(--color-phosphor-green)] font-space mb-4">
                  <CheckCircle2 size={20} className="mr-2" /> Advantages
                </h3>
                <ul className="space-y-3">
                  {(algorithm.pros || []).map((pro, i) => (
                    <li key={i} className="flex text-gray-400 font-source text-sm before:content-['•'] before:mr-2 before:text-[var(--color-phosphor-green)]">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#050d1a]/50 border border-gray-800 rounded-xl p-6">
                <h3 className="flex items-center text-red-400 font-space mb-4">
                  <XCircle size={20} className="mr-2" /> Disadvantages
                </h3>
                <ul className="space-y-3">
                  {(algorithm.cons || []).map((con, i) => (
                    <li key={i} className="flex text-gray-400 font-source text-sm before:content-['•'] before:mr-2 before:text-red-400">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 6. CODE SNIPPET */}
        {algorithm.code && (
          <section>
            <h2 className="text-2xl font-space font-bold mb-6 text-white border-b border-gray-800 pb-2">
              {algorithm.category && (algorithm.category === 'Linear' || algorithm.category === 'Non-Linear' || algorithm.category === 'Sorting' || algorithm.category === 'Searching' || algorithm.category === 'Graphs') ? 'Implementation (TypeScript)' : 'Implementation'}
            </h2>
            <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#020611]">
              <div className="flex items-center px-4 py-2 border-b border-gray-800 bg-[#050d1a]">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-xs font-space text-gray-500">
                  {algorithm.category && (algorithm.category === 'Linear' || algorithm.category === 'Non-Linear' || algorithm.category === 'Sorting' || algorithm.category === 'Searching' || algorithm.category === 'Graphs') ? 'typescript' : 'python'}
                </span>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm font-space text-[var(--color-electric-cyan)]">
                  {algorithm.code}
                </code>
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AlgorithmDetail;
