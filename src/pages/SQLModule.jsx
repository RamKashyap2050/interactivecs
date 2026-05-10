import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, BookOpen } from 'lucide-react';
import ChapterNav from '../components/ChapterNav';
import { sqlModuleData } from '../data/sqlModuleData';
import TableBirthAnim from '../animations/databases/sql/TableBirthAnim';
import RelationshipsAnim from '../animations/databases/sql/RelationshipsAnim';
import JoinsVisualizer from '../animations/databases/sql/JoinsVisualizer';
import NormalizationAnim from '../animations/databases/sql/NormalizationAnim';
import ACIDScalingAnim from '../animations/databases/sql/ACIDScalingAnim';

const SQLModule = () => {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const chapter = sqlModuleData.chapters[activeChapterIdx];
  const totalSteps = chapter.steps.length;

  const handleChapterChange = (idx) => {
    setActiveChapterIdx(idx);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const renderAnimation = () => {
    switch (chapter.animationComponent) {
      case 'TableBirthAnim':
        return <TableBirthAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'RelationshipsAnim':
        return <RelationshipsAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'JoinsVisualizer':
        return <JoinsVisualizer currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'NormalizationAnim':
        return <NormalizationAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'ACIDScalingAnim':
        return <ACIDScalingAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      default:
        return <div className="text-white">Animation placeholder for {chapter.animationComponent}</div>;
    }
  };

  // Handle auto-play stepping
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < totalSteps - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 8000 / speed); // 8 seconds per step to allow internal animations to complete
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, totalSteps]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const stepForward = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="flex h-screen pt-16 bg-[#020611] font-source text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <ChapterNav 
        chapters={sqlModuleData.chapters} 
        activeChapter={activeChapterIdx} 
        onSelect={handleChapterChange} 
        color={sqlModuleData.color}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Top Bar for Chapter Info */}
        <div className="h-14 border-b border-gray-800 bg-[#0a1526] flex items-center justify-between px-6 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-space font-bold text-lg" style={{ color: sqlModuleData.color }}>
              {chapter.title}
            </h2>
            {chapter.bookRef && (
              <div className="flex items-center gap-1.5 text-xs font-mono bg-gray-800/50 text-gray-400 px-3 py-1 rounded-full border border-gray-700">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate max-w-[400px]">{chapter.bookRef}</span>
              </div>
            )}
          </div>
          <div className="flex bg-[#050d1a] border border-gray-800 rounded-md overflow-hidden">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1 text-xs font-space transition-colors ${speed === s ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Animation Canvas */}
        <div className="flex-1 relative overflow-hidden bg-[#020611]">
          <div className="absolute inset-0 z-0">
            {renderAnimation()}
          </div>

          {/* Annotation Panel overlay (Slides in from right) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeChapterIdx}-${currentStep}`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-6 right-6 w-80 bg-[#0a1526]/90 backdrop-blur-md border border-gray-800 rounded-xl p-5 shadow-2xl z-10"
            >
              <div className="text-[10px] font-space text-gray-500 uppercase tracking-wider mb-2">
                Step {currentStep + 1} of {totalSteps}
              </div>
              <h4 className="text-lg font-space font-bold text-white mb-2" style={{ color: sqlModuleData.color }}>
                {chapter.steps[currentStep].name}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {chapter.steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Control Bar */}
        <div className="h-20 border-t border-gray-800 bg-[#0a1526] flex items-center px-6 justify-between z-20 shrink-0">
          
          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <button onClick={restart} className="p-2.5 text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-full hover:bg-gray-700">
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-px h-8 bg-gray-800 mx-2"></div>
            <button onClick={stepBackward} disabled={currentStep === 0} className="p-2.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors bg-gray-800/50 rounded-full hover:bg-gray-700">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button onClick={togglePlay} className="p-4 bg-white text-black rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button onClick={stepForward} disabled={currentStep === totalSteps - 1} className="p-2.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors bg-gray-800/50 rounded-full hover:bg-gray-700">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Progress Bar Checkpoints */}
          <div className="flex-grow max-w-2xl flex items-center justify-between mx-12">
            {chapter.steps.map((step, idx) => (
              <div key={idx} className="flex-1 flex items-center">
                <button 
                  onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
                  className="group relative flex items-center justify-center w-full h-8"
                >
                  <div className={`h-1.5 w-full rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-[#f59e0b]' : 'bg-gray-800'}`}></div>
                  <div className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${idx === currentStep ? 'scale-150 ring-4 ring-[#0a1526]' : 'scale-100'} ${idx <= currentStep ? 'bg-[#f59e0b]' : 'bg-gray-700'}`}></div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#050d1a] border border-gray-700 text-xs text-white p-1.5 px-3 rounded whitespace-nowrap pointer-events-none z-50">
                    {step.name}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Step Status Text */}
          <div className="text-right w-56 truncate text-sm font-space text-gray-400 hidden lg:block">
            {chapter.steps[currentStep].name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLModule;
