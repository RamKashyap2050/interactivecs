import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BellmanFordAnim = ({ isPlaying, speed }) => {
  const [nodes] = useState([
    { id: 'A', x: 0, y: -80 },
    { id: 'B', x: 80, y: 0 },
    { id: 'C', x: 0, y: 80 },
    { id: 'D', x: -80, y: 0 },
  ]);

  const [edges] = useState([
    { from: 'A', to: 'B', w: 4 },
    { from: 'A', to: 'D', w: 5 },
    { from: 'B', to: 'C', w: -2 }, // negative weight
    { from: 'D', to: 'C', w: 3 },
    { from: 'B', to: 'D', w: 2 }
  ]);

  const [distances, setDistances] = useState({});
  const [checkingEdge, setCheckingEdge] = useState(null);
  const [iteration, setIteration] = useState(0);
  const [message, setMessage] = useState('Initializing Bellman-Ford...');

  useEffect(() => {
    if (!isPlaying) {
      setDistances({});
      setCheckingEdge(null);
      setIteration(0);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1500 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      
      let dist = { 'A': 0, 'B': Infinity, 'C': Infinity, 'D': Infinity };
      setDistances({ ...dist });
      setCheckingEdge(null);
      setIteration(0);
      setMessage('Start at node A. Goal: handle negative weights. Relax ALL edges V-1 times.');
      await new Promise(r => setTimeout(r, baseDelay * 2));
      
      const V = nodes.length;
      for (let i = 1; i < V; i++) {
        if (!isMounted) return;
        setIteration(i);
        setMessage(`Iteration ${i} of ${V-1}. Relaxing every single edge...`);
        await new Promise(r => setTimeout(r, baseDelay));
        
        let relaxedAny = false;
        for (let edge of edges) {
          if (!isMounted) return;
          setCheckingEdge(edge);
          setMessage(`Checking edge ${edge.from}→${edge.to} (w: ${edge.w})`);
          await new Promise(r => setTimeout(r, baseDelay * 0.8));
          
          if (dist[edge.from] !== Infinity && dist[edge.from] + edge.w < dist[edge.to]) {
            setMessage(`Relaxed! ${dist[edge.from]} + ${edge.w} < ${dist[edge.to] === Infinity ? '∞' : dist[edge.to]}. Updating ${edge.to}.`);
            dist[edge.to] = dist[edge.from] + edge.w;
            setDistances({ ...dist });
            relaxedAny = true;
            await new Promise(r => setTimeout(r, baseDelay * 1.5));
          } else {
            setMessage(`No improvement for ${edge.to}.`);
            await new Promise(r => setTimeout(r, baseDelay * 0.5));
          }
        }
        
        if (!relaxedAny) {
          setMessage(`No edges relaxed in iteration ${i}. We can stop early!`);
          await new Promise(r => setTimeout(r, baseDelay * 2));
          break;
        }
      }
      
      if (!isMounted) return;
      setCheckingEdge(null);
      setMessage('Checking for negative cycles (one more pass)...');
      await new Promise(r => setTimeout(r, baseDelay));
      
      let hasNegativeCycle = false;
      for (let edge of edges) {
        if (dist[edge.from] + edge.w < dist[edge.to]) {
          hasNegativeCycle = true;
          setCheckingEdge(edge);
          setMessage(`Negative cycle detected at ${edge.from}→${edge.to}!`);
          break;
        }
      }

      if (!hasNegativeCycle) {
        setMessage('No negative cycles detected. Bellman-Ford Complete!');
      }

      await new Promise(r => setTimeout(r, baseDelay * 4));
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-[#f43f5e] font-space text-lg mb-4 h-8 text-center bg-[#f43f5e]/10 px-4 py-2 rounded-full border border-[#f43f5e]/30">
        {message}
      </div>
      
      <div className="h-8 mb-4 text-[#f43f5e] font-space font-bold">
        {iteration > 0 ? `Iteration: ${iteration} / 3` : ''}
      </div>

      <div className="relative w-[300px] h-[250px] flex items-center justify-center">
        {/* Draw Edges */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            <marker id="arrow-bf" markerWidth="10" markerHeight="10" refX="25" refY="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
            </marker>
            <marker id="arrow-bf-active" markerWidth="10" markerHeight="10" refX="25" refY="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>
          {edges.map((edge, idx) => {
            const isChecking = checkingEdge && checkingEdge.from === edge.from && checkingEdge.to === edge.to;
            const x1 = nodes.find(n=>n.id===edge.from).x + 150;
            const y1 = nodes.find(n=>n.id===edge.from).y + 125;
            const x2 = nodes.find(n=>n.id===edge.to).x + 150;
            const y2 = nodes.find(n=>n.id===edge.to).y + 125;
            
            return (
              <g key={`edge-${idx}`}>
                <motion.line
                  initial={false}
                  animate={{ stroke: isChecking ? '#f43f5e' : '#4b5563', strokeWidth: isChecking ? 4 : 2 }}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  markerEnd={isChecking ? "url(#arrow-bf-active)" : "url(#arrow-bf)"}
                />
                <text 
                  x={(x1+x2)/2 - 5} y={(y1+y2)/2 - 10} 
                  fill={isChecking ? "#f43f5e" : (edge.w < 0 ? "#10b981" : "#6b7280")} 
                  fontSize="14" fontFamily="monospace" fontWeight="bold"
                >
                  {edge.w}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Draw Nodes */}
        {nodes.map(node => {
          const dist = distances[node.id];
          const distStr = dist === Infinity || dist === undefined ? '∞' : dist;
          
          return (
            <motion.div
              key={node.id}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-space font-bold z-10 border-2 bg-[#050d1a] border-[#4b5563] text-[#f43f5e]`}
              style={{ left: node.x + 150 - 24, top: node.y + 125 - 24 }}
            >
              {node.id}
              {/* Distance Label */}
              <div className="absolute -top-6 text-[10px] bg-[#020611] px-1 border border-gray-800 rounded font-mono text-white">
                d: {distStr}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BellmanFordAnim;
