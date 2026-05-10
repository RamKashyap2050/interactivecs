import React, { useState, useEffect } from 'react';
import { Smartphone, Server, Database, Users, Share2, Activity, Search, Image as ImageIcon, MessageCircle, Star, TrendingUp, GitMerge } from 'lucide-react';
import { AnimatedConnection, NodeBox, SvgDefs } from '../../components/SystemDiagram';
import ScaleNumbers from '../../components/ScaleNumbers';
import { motion, AnimatePresence } from 'framer-motion';

const TwitterFeedAnim = ({ currentStep, isPlaying, speed }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (currentStep === 0 && isPlaying) {
      // Generate massive explosion of particles for celebrity fan-out
      const pts = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 300 + 100,
        duration: Math.random() * 2 + 1
      }));
      setParticles(pts);
    } else {
      setParticles([]);
    }
  }, [currentStep, isPlaying]);

  const userX = window.innerWidth * 0.2;
  const userY = window.innerHeight * 0.4;
  
  const fanoutX = window.innerWidth * 0.4;
  const fanoutY = window.innerHeight * 0.4;
  
  const dbX = window.innerWidth * 0.7;
  const dbY = window.innerHeight * 0.2;

  const redisX = window.innerWidth * 0.7;
  const redisY = window.innerHeight * 0.4;

  const elasticX = window.innerWidth * 0.7;
  const elasticY = window.innerHeight * 0.6;
  
  const s3X = window.innerWidth * 0.7;
  const s3Y = window.innerHeight * 0.8;

  const timelineX = window.innerWidth * 0.4;
  const timelineY = window.innerHeight * 0.6;

  const sseX = window.innerWidth * 0.4;
  const sseY = window.innerHeight * 0.2;

  return (
    <div className="w-full h-full relative font-source">
      <svg className="absolute inset-0 w-full h-full z-0">
        <SvgDefs />

        {/* Step 0: Fan-Out Explosion */}
        {currentStep === 0 && (
          <AnimatedConnection x1={userX} y1={userY} x2={fanoutX} y2={fanoutY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
        )}

        {/* Step 1: Pull Model */}
        {currentStep === 1 && (
          <>
            <AnimatedConnection x1={userX} y1={userY} x2={fanoutX} y2={fanoutY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY} x2={dbX} y2={dbY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 3} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY + 20} x2={dbX} y2={dbY + 20} color="#f59e0b" isPlaying={isPlaying} speed={speed * 2.5} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY + 40} x2={dbX} y2={dbY + 40} color="#f59e0b" isPlaying={isPlaying} speed={speed * 3.5} />
            <AnimatedConnection x1={dbX} y1={dbY - 20} x2={fanoutX} y2={fanoutY - 20} color="#10b981" isPlaying={isPlaying} speed={speed} dashed={true} />
          </>
        )}

        {/* Step 2: Push Model */}
        {currentStep === 2 && (
          <>
            <AnimatedConnection x1={userX} y1={userY} x2={fanoutX} y2={fanoutY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY} x2={redisX} y2={redisY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 4} />
            <AnimatedConnection x1={redisX} y1={redisY + 20} x2={userX} y2={userY + 150} color="#10b981" isPlaying={isPlaying} speed={speed * 4} dashed={true} />
          </>
        )}

        {/* Step 3: Hybrid Model Branches */}
        {currentStep === 3 && (
          <>
            <AnimatedConnection x1={userX} y1={userY} x2={fanoutX} y2={fanoutY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            {/* Branch 1: Normal */}
            <path d={`M ${fanoutX} ${fanoutY} Q ${fanoutX + 100} ${fanoutY - 100} ${redisX} ${redisY}`} fill="none" stroke="#374151" strokeWidth="2" />
            {/* Branch 2: Celeb */}
            <path d={`M ${fanoutX} ${fanoutY} Q ${fanoutX + 100} ${fanoutY + 100} ${dbX} ${dbY}`} fill="none" stroke="#374151" strokeWidth="2" />
          </>
        )}

        {/* Step 4: Storage Writes */}
        {currentStep === 4 && (
          <>
            <AnimatedConnection x1={userX} y1={userY} x2={fanoutX} y2={fanoutY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY} x2={dbX} y2={dbY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY} x2={redisX} y2={redisY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2.2} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY} x2={elasticX} y2={elasticY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2.4} />
            <AnimatedConnection x1={fanoutX} y1={fanoutY} x2={s3X} y2={s3Y} color="#06b6d4" isPlaying={isPlaying} speed={speed * 1.8} />
          </>
        )}

        {/* Step 5: Timeline Assembly */}
        {currentStep === 5 && (
          <>
            <AnimatedConnection x1={redisX} y1={redisY} x2={timelineX} y2={timelineY} color="#10b981" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={dbX} y1={dbY} x2={timelineX} y2={timelineY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 1.5} />
            <AnimatedConnection x1={timelineX} y1={timelineY} x2={userX} y2={userY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 3} dashed={true} />
          </>
        )}

        {/* Step 6: SSE Delivery */}
        {currentStep === 6 && (
          <>
            <AnimatedConnection x1={userX} y1={userY} x2={sseX} y2={sseY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 0.5} dashed={true} />
            <AnimatedConnection x1={redisX} y1={redisY} x2={sseX} y2={sseY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} />
            <AnimatedConnection x1={sseX} y1={sseY} x2={userX} y2={userY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 3} />
          </>
        )}

        {/* Step 8: Search */}
        {currentStep === 8 && (
          <>
            <AnimatedConnection x1={userX} y1={userY} x2={elasticX} y2={elasticY} color="#8b5cf6" isPlaying={isPlaying} speed={speed * 3} />
            <AnimatedConnection x1={dbX} y1={dbY} x2={elasticX} y2={elasticY} color="#f59e0b" isPlaying={isPlaying} speed={speed * 3} dashed={true} />
            <AnimatedConnection x1={elasticX} y1={elasticY} x2={userX} y2={userY} color="#06b6d4" isPlaying={isPlaying} speed={speed * 2} dashed={false} />
          </>
        )}
      </svg>

      {/* OVERLAYS AND NODES */}
      
      {/* Step 0: Explosion */}
      {currentStep === 0 && (
        <>
          <NodeBox id="user" x={userX} y={userY} icon={Smartphone} label="Celebrity" color="#06b6d4" />
          <NodeBox id="fanout" x={fanoutX} y={fanoutY} icon={Share2} label="Fanout Svc" color="#8b5cf6" />
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <AnimatePresence>
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: fanoutX, y: fanoutY, opacity: 1, scale: 1 }}
                  animate={{ 
                    x: fanoutX + Math.cos(p.angle) * p.dist * 3, 
                    y: fanoutY + Math.sin(p.angle) * p.dist * 3, 
                    opacity: 0,
                    scale: 0.5
                  }}
                  transition={{ duration: p.duration, ease: "easeOut" }}
                  className="absolute w-2 h-2 bg-[#ef4444] rounded-full"
                />
              ))}
            </AnimatePresence>
          </div>
          <div className="absolute left-[50%] top-[20%] text-[#ef4444] text-4xl font-space font-bold animate-pulse">
            10 BILLION WRITES / SEC
          </div>
        </>
      )}

      {currentStep === 1 && (
        <>
          <NodeBox id="user" x={userX} y={userY} icon={Smartphone} label="Follower" color="#06b6d4" />
          <NodeBox id="timeline" x={fanoutX} y={fanoutY} icon={Activity} label="Timeline Svc" color="#8b5cf6" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="MySQL" sublabel="Massive JOIN" color="#ef4444" status="failed" />
          <div className="absolute left-[30%] top-[30%] text-[#ef4444] font-mono text-sm bg-black/50 p-2 rounded border border-[#ef4444]">Latency: 2000ms</div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <NodeBox id="user" x={userX} y={userY} icon={Smartphone} label="Author" color="#06b6d4" />
          <NodeBox id="fanout" x={fanoutX} y={fanoutY} icon={Share2} label="Fanout Svc" color="#8b5cf6" />
          <NodeBox id="redis" x={redisX} y={redisY} icon={Database} label="Redis" sublabel="Home Timeline Cache" color="#10b981" />
          <div className="absolute left-[80%] top-[40%] bg-[#0a1526] p-4 rounded-lg border border-[#10b981]">
            <div className="text-white font-mono text-xs mb-2">Follower's Timeline List</div>
            <div className="flex flex-col gap-1">
              <div className="bg-[#10b981]/20 text-[#10b981] text-xs font-mono p-1 rounded">tweet_id: 9942</div>
              <div className="bg-[#10b981]/20 text-[#10b981] text-xs font-mono p-1 rounded">tweet_id: 9941</div>
              <div className="bg-[#10b981]/20 text-[#10b981] text-xs font-mono p-1 rounded">tweet_id: 9890</div>
            </div>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          <NodeBox id="user" x={userX} y={userY} icon={Smartphone} label="Author" color="#06b6d4" />
          <NodeBox id="fanout" x={fanoutX} y={fanoutY} icon={GitMerge} label="Routing Logic" color="#8b5cf6" />
          <NodeBox id="redis" x={redisX} y={redisY} icon={Database} label="Redis Cache" sublabel="Push (Normal Users)" color="#10b981" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="Database" sublabel="Pull (Celebrities)" color="#f59e0b" />
          
          <div className="absolute left-[35%] top-[25%] bg-[#0a1526] border border-[#06b6d4] p-4 rounded-xl text-center shadow-xl">
            <div className="text-white text-sm font-space mb-2">Follower Count</div>
            <div className="text-3xl text-[#06b6d4] font-bold font-mono">{isPlaying ? '> 10,000' : '< 10,000'}</div>
          </div>
        </>
      )}

      {currentStep === 4 && (
        <>
          <NodeBox id="user" x={userX} y={userY} icon={Smartphone} label="Author" color="#06b6d4" />
          <NodeBox id="fanout" x={fanoutX} y={fanoutY} icon={Share2} label="Ingestion" color="#8b5cf6" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="MySQL" sublabel="Source of Truth" color="#3b82f6" />
          <NodeBox id="redis" x={redisX} y={redisY} icon={Database} label="Redis" sublabel="Timelines" color="#10b981" />
          <NodeBox id="elastic" x={elasticX} y={elasticY} icon={Search} label="Elasticsearch" sublabel="Search Index" color="#f59e0b" />
          <NodeBox id="s3" x={s3X} y={s3Y} icon={ImageIcon} label="S3 / CDN" sublabel="Media Storage" color="#ec4899" />
        </>
      )}

      {currentStep === 5 && (
        <>
          <NodeBox id="redis" x={redisX} y={redisY} icon={Database} label="Redis Cache" sublabel="Followed Normals" color="#10b981" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Database} label="MySQL" sublabel="Followed Celebs" color="#f59e0b" />
          <NodeBox id="timeline" x={timelineX} y={timelineY} icon={GitMerge} label="Timeline Merger" color="#8b5cf6" />
          <NodeBox id="user" x={userX} y={userY} icon={Smartphone} label="Reader" color="#06b6d4" />
          
          <div className="absolute left-[35%] top-[70%] bg-[#0a1526] border border-[#8b5cf6] p-4 rounded-xl">
            <div className="text-white font-mono text-sm mb-2 border-b border-gray-700 pb-1">Merge Sort by Time</div>
            <div className="flex items-center gap-2 text-xs text-[#f59e0b]"><Star className="w-3 h-3"/> Celeb Tweet (Just now)</div>
            <div className="flex items-center gap-2 text-xs text-[#10b981]"><Users className="w-3 h-3"/> Friend Tweet (2m ago)</div>
            <div className="flex items-center gap-2 text-xs text-[#ec4899]"><Activity className="w-3 h-3"/> Ad injected</div>
          </div>
        </>
      )}

      {currentStep === 6 && (
        <>
          <NodeBox id="user" x={userX} y={userY} icon={Smartphone} label="Reader" color="#06b6d4" />
          <NodeBox id="sse" x={sseX} y={sseY} icon={Activity} label="SSE Connection" color="#8b5cf6" />
          <NodeBox id="redis" x={redisX} y={redisY} icon={Database} label="Redis Pub/Sub" color="#10b981" />
          
          <div className="absolute left-[15%] top-[55%] w-48 h-32 bg-[#050d1a] border border-gray-700 rounded-lg overflow-hidden flex flex-col">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={isPlaying ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full p-2 bg-[#0a1526] border-b border-gray-800 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-[#06b6d4]"></div>
              <div className="flex-1 h-2 bg-gray-600 rounded"></div>
            </motion.div>
            <div className="w-full p-2 flex items-center gap-2 opacity-50">
              <div className="w-6 h-6 rounded-full bg-gray-600"></div>
              <div className="flex-1 h-2 bg-gray-700 rounded"></div>
            </div>
          </div>
        </>
      )}

      {currentStep === 7 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <div className="w-[600px] h-[400px] bg-[#0a1526] border border-[#f59e0b] rounded-xl flex flex-col p-6">
            <div className="text-white font-space text-xl mb-4 flex items-center gap-2"><TrendingUp className="text-[#f59e0b]"/> Redis Sliding Window</div>
            <div className="flex-1 flex items-end gap-4 pb-4 border-b border-gray-700">
              {[10, 15, 30, 80, 200, 150].map((h, i) => (
                <div key={i} className="flex-1 bg-[#f59e0b] rounded-t flex items-end justify-center pb-2 text-black font-bold text-xs" style={{ height: `${h}px` }}>
                  {i === 4 ? 'NOW' : ''}
                </div>
              ))}
            </div>
            <div className="text-center text-gray-400 font-mono text-sm mt-4">Velocity &gt; Volume. Spike in last 5 mins = Trending.</div>
          </div>
        </div>
      )}

      {currentStep === 8 && (
        <>
          <NodeBox id="user" x={userX} y={userY} icon={Search} label="Search 'SpaceX'" color="#06b6d4" />
          <NodeBox id="elastic" x={elasticX} y={elasticY} icon={Search} label="Elasticsearch" sublabel="Full Text Index" color="#f59e0b" />
          <NodeBox id="db" x={dbX} y={dbY} icon={Users} label="Social Graph" sublabel="Relevance Score" color="#8b5cf6" />
          
          <div className="absolute left-[65%] top-[75%] bg-[#0a1526] border border-[#f59e0b] p-3 rounded text-xs font-mono text-white shadow-xl">
            score = text_match * 0.4 +<br/>
            engagement * 0.3 +<br/>
            social_graph_distance * 0.3
          </div>
        </>
      )}

      {currentStep === 9 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020611] z-20">
          <svg width="600" height="400">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
              </marker>
            </defs>
            <circle cx="300" cy="200" r="20" fill="#f59e0b" />
            <text x="290" y="235" fill="white" fontSize="12" className="font-space">User</text>
            
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const x = 300 + Math.cos(angle * Math.PI / 180) * 150;
              const y = 200 + Math.sin(angle * Math.PI / 180) * 150;
              return (
                <g key={angle}>
                  <line x1="300" y1="200" x2={x} y2={y} stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray={isPlaying ? "5" : "0"} />
                  <circle cx={x} cy={y} r="15" fill="#8b5cf6" />
                </g>
              )
            })}
          </svg>
          <div className="absolute bottom-12 text-[#8b5cf6] font-space text-2xl">FlockDB: The Follow Graph</div>
        </div>
      )}

      {/* Scale Numbers */}
      {currentStep === 10 && (
        <div className="absolute inset-0 bg-[#020611]/80 backdrop-blur-sm z-40 flex flex-wrap items-center justify-center gap-8 p-12">
          <ScaleNumbers value={350000000} label="Monthly Active Users" />
          <ScaleNumbers value={500000000} label="Tweets / Day" />
          <ScaleNumbers value={100000000} label="Followers for Celeb" suffix="+" />
          <ScaleNumbers value={10000} label="Hybrid Switch Threshold" />
          <ScaleNumbers value={800} label="Redis Timeline Max Size" />
          <ScaleNumbers value={100} label="Read Latency Target" suffix="ms" />
        </div>
      )}

    </div>
  );
};

export default TwitterFeedAnim;
