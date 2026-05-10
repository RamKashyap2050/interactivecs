import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GraphAnim = ({ isPlaying, speed }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [representation, setRepresentation] = useState('visual'); // visual, matrix, list

  // Base layout
  const baseNodes = [
    { id: 'A', x: 0, y: -80 },
    { id: 'B', x: 80, y: -20 },
    { id: 'C', x: 50, y: 80 },
    { id: 'D', x: -50, y: 80 },
    { id: 'E', x: -80, y: -20 },
  ];

  const isolatedNode = { id: 'F', x: 120, y: -80 };

  const baseEdges = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: 7 },
    { from: 'D', to: 'E', weight: 1 },
    { from: 'E', to: 'A', weight: 5 },
    { from: 'A', to: 'C', weight: 3 }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    let currentNodes = [...baseNodes];
    if (!isConnected) currentNodes.push(isolatedNode);
    setNodes(currentNodes);
    setEdges(baseEdges);
  }, [isPlaying, isConnected]);

  // If not playing, keep it frozen
  if (!isPlaying) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 font-space">
        Paused
      </div>
    );
  }

  const toggleDirected = () => setIsDirected(!isDirected);
  const toggleWeighted = () => setIsWeighted(!isWeighted);
  const toggleConnected = () => setIsConnected(!isConnected);

  // Derived representation data
  const adjMatrix = () => {
    const ids = nodes.map(n => n.id);
    const matrix = Array(ids.length).fill(0).map(() => Array(ids.length).fill(0));
    
    edges.forEach(e => {
      const i = ids.indexOf(e.from);
      const j = ids.indexOf(e.to);
      if (i >= 0 && j >= 0) {
        matrix[i][j] = isWeighted ? e.weight : 1;
        if (!isDirected) matrix[j][i] = isWeighted ? e.weight : 1;
      }
    });
    return { ids, matrix };
  };

  const adjList = () => {
    const list = {};
    nodes.forEach(n => list[n.id] = []);
    edges.forEach(e => {
      if (list[e.from]) list[e.from].push({ to: e.to, w: e.weight });
      if (!isDirected && list[e.to]) list[e.to].push({ to: e.from, w: e.weight });
    });
    return list;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      
      {/* Controls */}
      <div className="flex gap-4 mb-8 z-20">
        <button 
          onClick={toggleDirected}
          className={`px-4 py-1.5 rounded-full font-space text-sm font-bold border-2 transition-colors
            ${isDirected ? 'bg-[#f43f5e] border-[#f43f5e] text-white' : 'border-[#f43f5e] text-[#f43f5e] hover:bg-[#f43f5e]/10'}
          `}
        >
          {isDirected ? 'Directed' : 'Undirected'}
        </button>
        <button 
          onClick={toggleWeighted}
          className={`px-4 py-1.5 rounded-full font-space text-sm font-bold border-2 transition-colors
            ${isWeighted ? 'bg-[#f43f5e] border-[#f43f5e] text-white' : 'border-[#f43f5e] text-[#f43f5e] hover:bg-[#f43f5e]/10'}
          `}
        >
          {isWeighted ? 'Weighted' : 'Unweighted'}
        </button>
        <button 
          onClick={toggleConnected}
          className={`px-4 py-1.5 rounded-full font-space text-sm font-bold border-2 transition-colors
            ${isConnected ? 'bg-[#f43f5e] border-[#f43f5e] text-white' : 'border-[#f43f5e] text-[#f43f5e] hover:bg-[#f43f5e]/10'}
          `}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </button>
      </div>

      <div className="flex gap-4 mb-8 z-20">
        {['visual', 'matrix', 'list'].map(rep => (
          <button 
            key={rep}
            onClick={() => setRepresentation(rep)}
            className={`px-3 py-1 font-space text-xs uppercase tracking-wider rounded transition-colors
              ${representation === rep ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}
            `}
          >
            {rep}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-[500px] h-[300px] flex items-center justify-center border border-gray-800 bg-[#020611] rounded-xl overflow-hidden">
        
        {/* Visual Graph View */}
        {representation === 'visual' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
            {/* SVG Edges */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="25" refY="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
                </marker>
              </defs>
              <AnimatePresence>
                {edges.map((edge, idx) => {
                  const fromN = nodes.find(n => n.id === edge.from);
                  const toN = nodes.find(n => n.id === edge.to);
                  if (!fromN || !toN) return null;
                  
                  // Center offsets
                  const x1 = fromN.x + 250; const y1 = fromN.y + 150;
                  const x2 = toN.x + 250; const y2 = toN.y + 150;
                  
                  return (
                    <g key={`edge-${idx}`}>
                      <motion.line
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#6b7280" strokeWidth="2"
                        markerEnd={isDirected ? "url(#arrow)" : ""}
                      />
                      {isWeighted && (
                        <text 
                          x={(x1+x2)/2 - 5} y={(y1+y2)/2 - 5} 
                          fill="#f43f5e" fontSize="14" fontFamily="monospace" fontWeight="bold"
                        >
                          {edge.weight}
                        </text>
                      )}
                    </g>
                  );
                })}
              </AnimatePresence>
            </svg>

            {/* Nodes */}
            {nodes.map(node => (
              <motion.div
                key={node.id}
                layout
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute w-10 h-10 rounded-full bg-[#050d1a] border-2 border-[#f43f5e] text-[#f43f5e] flex items-center justify-center font-space font-bold z-10 shadow-[0_0_15px_#f43f5e40]"
                style={{ left: node.x + 250 - 20, top: node.y + 150 - 20 }}
              >
                {node.id}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Adjacency Matrix View */}
        {representation === 'matrix' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center w-full h-full">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-gray-800 text-gray-500 font-space"></th>
                  {adjMatrix().ids.map(id => <th key={id} className="p-2 border border-gray-800 text-[#f43f5e] font-space w-10">{id}</th>)}
                </tr>
              </thead>
              <tbody>
                {adjMatrix().matrix.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-gray-800 text-[#f43f5e] font-space font-bold text-center w-10">{adjMatrix().ids[i]}</td>
                    {row.map((cell, j) => (
                      <td key={j} className={`p-2 border border-gray-800 font-mono text-center w-10 ${cell ? 'text-white bg-[#f43f5e]/20' : 'text-gray-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Adjacency List View */}
        {representation === 'list' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start justify-center w-full h-full p-10 font-space">
            {Object.entries(adjList()).map(([id, neighbors]) => (
              <div key={id} className="flex items-center mb-3 text-lg">
                <div className="w-8 h-8 rounded bg-[#f43f5e]/20 border border-[#f43f5e] text-[#f43f5e] flex items-center justify-center font-bold mr-4">
                  {id}
                </div>
                <div className="text-gray-500 mr-4">→</div>
                <div className="flex gap-2">
                  {neighbors.length === 0 ? (
                    <span className="text-gray-600">[]</span>
                  ) : (
                    neighbors.map((n, i) => (
                      <div key={i} className="px-2 py-1 bg-gray-800 rounded text-gray-300 text-sm flex items-center gap-2">
                        {n.to}
                        {isWeighted && <span className="text-[#f43f5e] text-xs">({n.w})</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GraphAnim;
