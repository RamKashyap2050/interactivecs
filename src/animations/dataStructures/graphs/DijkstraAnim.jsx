import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DijkstraAnim = ({ isPlaying, speed }) => {
  const [nodes] = useState([
    { id: 'A', x: 0, y: -80 },
    { id: 'B', x: 80, y: -40 },
    { id: 'C', x: 120, y: 40 },
    { id: 'D', x: 40, y: 100 },
    { id: 'E', x: -60, y: 60 },
  ]);

  const [edges] = useState([
    { from: 'A', to: 'B', w: 4 },
    { from: 'A', to: 'E', w: 2 },
    { from: 'B', to: 'C', w: 3 },
    { from: 'B', to: 'E', w: 5 },
    { from: 'C', to: 'D', w: 1 },
    { from: 'E', to: 'D', w: 6 },
    { from: 'E', to: 'C', w: 8 }
  ]);

  const [distances, setDistances] = useState({});
  const [visited, setVisited] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [checkingEdge, setCheckingEdge] = useState(null);
  const [message, setMessage] = useState('Initializing Dijkstra...');

  useEffect(() => {
    if (!isPlaying) {
      setDistances({});
      setVisited([]);
      setCurrentNode(null);
      setCheckingEdge(null);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1500 / speed;

    const runAnimation = async () => {
      if (!isMounted) return;
      
      let dist = { 'A': 0, 'B': Infinity, 'C': Infinity, 'D': Infinity, 'E': Infinity };
      let vis = [];
      setDistances({ ...dist });
      setVisited([]);
      setCurrentNode(null);
      setCheckingEdge(null);
      setMessage('Start at node A. Set distance to 0, all others to Infinity.');
      await new Promise(r => setTimeout(r, baseDelay * 2));
      
      while (vis.length < 5) {
        if (!isMounted) return;
        
        // Find unvisited node with smallest distance
        let u = null;
        let minDist = Infinity;
        for (let n of nodes) {
          if (!vis.includes(n.id) && dist[n.id] < minDist) {
            minDist = dist[n.id];
            u = n.id;
          }
        }
        
        if (u === null) break; // unreachable
        
        setCurrentNode(u);
        setMessage(`Current Node: ${u} (Shortest known distance: ${dist[u]}). Marking visited.`);
        await new Promise(r => setTimeout(r, baseDelay));
        if (!isMounted) return;

        vis.push(u);
        setVisited([...vis]);

        // Relax neighbors
        const neighbors = edges.filter(e => e.from === u || e.to === u);
        for (let edge of neighbors) {
          const v = edge.from === u ? edge.to : edge.from;
          if (!vis.includes(v)) {
            setCheckingEdge({ from: edge.from, to: edge.to });
            setMessage(`Checking edge ${u}-${v} (weight ${edge.w}).`);
            await new Promise(r => setTimeout(r, baseDelay));
            
            if (dist[u] + edge.w < dist[v]) {
              setMessage(`Relaxing: ${dist[u]} + ${edge.w} < ${dist[v] === Infinity ? '∞' : dist[v]}. Updating ${v}'s distance to ${dist[u] + edge.w}.`);
              dist[v] = dist[u] + edge.w;
              setDistances({ ...dist });
              await new Promise(r => setTimeout(r, baseDelay * 1.5));
            } else {
              setMessage(`No improvement: ${dist[u]} + ${edge.w} >= ${dist[v]}. Skipping.`);
              await new Promise(r => setTimeout(r, baseDelay * 0.8));
            }
          }
        }
        
        setCheckingEdge(null);
      }
      
      if (!isMounted) return;
      setCurrentNode(null);
      setMessage('Dijkstra Complete! We now have the shortest path from A to everywhere.');
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

      <div className="relative w-[300px] h-[250px] flex items-center justify-center">
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
                  x={(x1+x2)/2 - 5} y={(y1+y2)/2 - 5} 
                  fill={isChecking ? "#f43f5e" : "#6b7280"} fontSize="14" fontFamily="monospace" fontWeight="bold"
                >
                  {edge.w}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Draw Nodes */}
        {nodes.map(node => {
          const isCurr = currentNode === node.id;
          const isVis = visited.includes(node.id);
          const dist = distances[node.id];
          const distStr = dist === Infinity || dist === undefined ? '∞' : dist;
          
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

export default DijkstraAnim;
