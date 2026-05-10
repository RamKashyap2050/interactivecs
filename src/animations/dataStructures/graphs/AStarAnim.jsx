import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AStarAnim = ({ isPlaying, speed }) => {
  // A simple grid map metaphor to make heuristic obvious
  const [nodes] = useState([
    { id: 'S', x: -120, y: 80, h: 4 }, // Start
    { id: 'A', x: -60, y: 0, h: 3 },
    { id: 'B', x: 0, y: 80, h: 2 },
    { id: 'C', x: 60, y: 0, h: 1 },
    { id: 'G', x: 120, y: 80, h: 0 }, // Goal
  ]);

  const [edges] = useState([
    { from: 'S', to: 'A', w: 1 },
    { from: 'S', to: 'B', w: 3 },
    { from: 'A', to: 'C', w: 5 },
    { from: 'B', to: 'C', w: 1 },
    { from: 'C', to: 'G', w: 2 },
    { from: 'B', to: 'G', w: 5 }
  ]);

  const [gScores, setGScores] = useState({});
  const [fScores, setFScores] = useState({});
  const [visited, setVisited] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [checkingEdge, setCheckingEdge] = useState(null);
  const [message, setMessage] = useState('Initializing A* Search...');

  useEffect(() => {
    if (!isPlaying) {
      setGScores({});
      setFScores({});
      setVisited([]);
      setCurrentNode(null);
      setCheckingEdge(null);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1800 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      
      let g = { 'S': 0, 'A': Infinity, 'B': Infinity, 'C': Infinity, 'G': Infinity };
      let f = { 'S': 4, 'A': Infinity, 'B': Infinity, 'C': Infinity, 'G': Infinity };
      let vis = [];
      setGScores({ ...g });
      setFScores({ ...f });
      setVisited([]);
      setCurrentNode(null);
      setCheckingEdge(null);
      setMessage('Start at S. Goal is G. f(n) = g(n) + h(n).');
      await new Promise(r => setTimeout(r, baseDelay * 1.5));
      
      let openSet = ['S'];

      while (openSet.length > 0) {
        if (!isMounted) return;
        
        // Find node in openSet with lowest fScore
        let u = openSet[0];
        let minF = f[u];
        for (let i = 1; i < openSet.length; i++) {
          if (f[openSet[i]] < minF) {
            minF = f[openSet[i]];
            u = openSet[i];
          }
        }
        
        if (u === 'G') {
          setCurrentNode(u);
          setMessage(`Reached Goal G! We found the optimal path. Total Cost: ${g['G']}`);
          await new Promise(r => setTimeout(r, baseDelay * 3));
          if (!isMounted) return;
          break;
        }

        openSet = openSet.filter(n => n !== u);
        vis.push(u);
        setVisited([...vis]);
        setCurrentNode(u);
        setMessage(`Selected ${u} (lowest f-score). Checking neighbors...`);
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;

        const neighbors = edges.filter(e => e.from === u || e.to === u);
        for (let edge of neighbors) {
          const v = edge.from === u ? edge.to : edge.from;
          if (vis.includes(v)) continue;

          setCheckingEdge({ from: edge.from, to: edge.to });
          const tentativeG = g[u] + edge.w;
          const neighborH = nodes.find(n => n.id === v).h;
          const tentativeF = tentativeG + neighborH;

          setMessage(`Path to ${v} via ${u}: g=${tentativeG}, h=${neighborH}. So f=${tentativeF}.`);
          await new Promise(r => setTimeout(r, baseDelay * 1.5));
          if (!isMounted) return;

          if (tentativeG < g[v]) {
            g[v] = tentativeG;
            f[v] = tentativeF;
            setGScores({ ...g });
            setFScores({ ...f });
            setMessage(`Better path found! Updating ${v}.`);
            if (!openSet.includes(v)) openSet.push(v);
            await new Promise(r => setTimeout(r, baseDelay));
          } else {
            setMessage(`Not better. Skipping.`);
            await new Promise(r => setTimeout(r, baseDelay * 0.5));
          }
        }
        setCheckingEdge(null);
      }
      
      if (!isMounted) return;
      setCurrentNode(null);
      setMessage('A* Complete! Notice how the heuristic pulled us towards the goal.');
      await new Promise(r => setTimeout(r, baseDelay * 4));
      runAnimation();
    };

    runAnimation();
    return () => { isMounted = false; };
  }, [isPlaying, speed]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-[#f43f5e] font-space text-lg mb-8 h-8 text-center bg-[#f43f5e]/10 px-4 py-2 rounded-full border border-[#f43f5e]/30">
        {message}
      </div>

      <div className="relative w-[300px] h-[250px] flex items-center justify-center mt-4">
        {/* Draw Edges */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {edges.map((edge, idx) => {
            const isChecking = checkingEdge && ((checkingEdge.from === edge.from && checkingEdge.to === edge.to) || (checkingEdge.from === edge.to && checkingEdge.to === edge.from));
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
                />
                <text 
                  x={(x1+x2)/2 - 5} y={(y1+y2)/2 - 10} 
                  fill={isChecking ? "#f43f5e" : "#6b7280"} fontSize="12" fontFamily="monospace" fontWeight="bold"
                >
                  w:{edge.w}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Draw Nodes */}
        {nodes.map(node => {
          const isCurr = currentNode === node.id;
          const isVis = visited.includes(node.id);
          const f = fScores[node.id];
          const fStr = f === Infinity || f === undefined ? '∞' : f;
          
          return (
            <motion.div
              key={node.id}
              initial={false}
              animate={{ 
                scale: isCurr ? 1.2 : 1,
                backgroundColor: isCurr ? '#f43f5e' : (isVis ? '#050d1a' : '#050d1a'),
                borderColor: isCurr ? '#f43f5e' : (isVis ? '#f43f5e' : '#4b5563'),
                color: isCurr ? '#050d1a' : (isVis ? '#f43f5e' : '#4b5563')
              }}
              transition={{ duration: 0.3 }}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-space font-bold z-10 border-2 shadow-lg`}
              style={{ left: node.x + 150 - 24, top: node.y + 125 - 24 }}
            >
              {node.id}
              {/* Labels */}
              <div className="absolute -bottom-6 text-[10px] text-gray-500 font-mono">
                h:{node.h}
              </div>
              <div className="absolute -top-6 text-[10px] bg-[#020611] px-1 border border-gray-800 rounded font-mono text-white">
                f: {fStr}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AStarAnim;
