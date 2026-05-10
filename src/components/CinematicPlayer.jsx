import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import NetflixCDNAnim from '../animations/caseStudies/NetflixCDNAnim';
import WhatsAppRealtimeAnim from '../animations/caseStudies/WhatsAppRealtimeAnim';

import TinyURLAnim from '../animations/caseStudies/TinyURLAnim';

import UberBackendAnim from '../animations/caseStudies/UberBackendAnim';
import TwitterFeedAnim from '../animations/caseStudies/TwitterFeedAnim';
import GoogleMapsAnim from '../animations/caseStudies/GoogleMapsAnim';
import DropboxSyncAnim from '../animations/caseStudies/DropboxSyncAnim';
import RedisCacheAnim from '../animations/caseStudies/RedisCacheAnim';

const CinematicPlayer = ({ caseStudy }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const totalSteps = caseStudy.steps.length;

  // Render the correct animation component based on case study
  const renderAnimation = () => {
    switch (caseStudy.animationComponent) {
      case 'NetflixCDNAnim':
        return <NetflixCDNAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'WhatsAppRealtimeAnim':
        return <WhatsAppRealtimeAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'TinyURLAnim':
        return <TinyURLAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'UberBackendAnim':
        return <UberBackendAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'TwitterFeedAnim':
        return <TwitterFeedAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'GoogleMapsAnim':
        return <GoogleMapsAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'DropboxSyncAnim':
        return <DropboxSyncAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      case 'RedisCacheAnim':
        return <RedisCacheAnim currentStep={currentStep} isPlaying={isPlaying} speed={speed} />;
      default:
        return <div className="text-white">Animation not found</div>;
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
      }, 5000 / speed); // 5 seconds per step, modified by speed
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, totalSteps]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const stepForward = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setIsPlaying(false); // Pause on manual step
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

  const playerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={playerRef} className="w-full h-full flex flex-col font-source text-white bg-[#020611]">
      {/* Top Bar */}
      <div className="h-12 border-b border-gray-800 bg-[#0a1526] flex items-center justify-between px-4 z-20">
        <h3 className="font-space font-bold text-sm" style={{ color: caseStudy.color }}>
          {caseStudy.name}
        </h3>
        <div className="flex items-center gap-4">
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
          <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition-colors">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Animation Canvas */}
      <div className="flex-grow relative overflow-hidden bg-[#020611]">
        {/* The React Animation goes here */}
        <div className="absolute inset-0 z-0">
          {renderAnimation()}
        </div>

        {/* Annotation Panel overlay (Slides in from right) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-4 right-4 w-80 bg-[#0a1526]/90 backdrop-blur-md border border-gray-800 rounded-xl p-5 shadow-2xl z-10"
          >
            <div className="text-[10px] font-space text-gray-500 uppercase tracking-wider mb-2">
              Step {currentStep + 1} of {totalSteps}
            </div>
            <h4 className="text-lg font-space font-bold text-white mb-2" style={{ color: caseStudy.color }}>
              {caseStudy.steps[currentStep].name}
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {caseStudy.steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Control Bar */}
      <div className="h-16 border-t border-gray-800 bg-[#0a1526] flex items-center px-4 justify-between z-20">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button onClick={restart} className="p-2 text-gray-400 hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-800 mx-2"></div>
          <button onClick={stepBackward} disabled={currentStep === 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button onClick={togglePlay} className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform">
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button onClick={stepForward} disabled={currentStep === totalSteps - 1} className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Progress Bar Checkpoints */}
        <div className="flex-grow max-w-md flex items-center justify-between mx-8">
          {caseStudy.steps.map((step, idx) => (
            <div key={idx} className="flex-1 flex items-center">
              <button 
                onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
                className="group relative flex items-center justify-center w-full"
              >
                <div className={`h-1 w-full rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-[var(--color-electric-cyan)]' : 'bg-gray-800'}`} style={{ backgroundColor: idx <= currentStep ? caseStudy.color : '' }}></div>
                <div className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${idx === currentStep ? 'scale-150 ring-4 ring-[#0a1526]' : 'scale-100'} ${idx <= currentStep ? 'bg-[var(--color-electric-cyan)]' : 'bg-gray-700'}`} style={{ backgroundColor: idx <= currentStep ? caseStudy.color : '' }}></div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-[#050d1a] border border-gray-700 text-xs text-white p-1 px-2 rounded whitespace-nowrap pointer-events-none">
                  {step.name}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Step Status Text */}
        <div className="text-right w-48 truncate text-sm font-space text-gray-400 hidden sm:block">
          {caseStudy.steps[currentStep].name}
        </div>

      </div>
    </div>
  );
};

export default CinematicPlayer;
