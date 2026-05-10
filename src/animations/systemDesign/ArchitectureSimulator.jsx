import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to generate unique request IDs
const getReqId = () => Math.random().toString(36).substr(2, 5);

const AnimatedConnection = ({ x1, y1, x2, y2, color, isPlaying, speed, dashed = true, path = null, status = 'healthy' }) => {
  let finalColor = color;
  let finalPlaying = isPlaying;
  let animDirection = [20, 0];

  if (status === 'blocked') {
    finalColor = '#ef4444';
    finalPlaying = false; // Halt animation if blocked
  } else if (status === 'compensating') {
    finalColor = '#ef4444';
    animDirection = [0, 20]; // Reverse direction
  } else if (status === 'inactive') {
    finalColor = '#374151'; // Dim gray for inactive
    finalPlaying = false;
  }

  const markerId = finalColor === '#10b981' ? 'url(#arrow-green)' : finalColor === '#ef4444' ? 'url(#arrow-red)' : 'url(#arrow-gray)';
  
  if (path) {
    return (
      <motion.path 
        d={path} 
        fill="none" 
        stroke={finalColor} 
        strokeWidth="2" 
        strokeDasharray={dashed ? "5 5" : "none"}
        markerEnd={markerId}
        animate={{ strokeDashoffset: finalPlaying ? animDirection : 0 }}
        transition={{ repeat: Infinity, duration: 1 / speed, ease: "linear" }}
      />
    );
  }
  
  return (
    <motion.line 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      stroke={finalColor} 
      strokeWidth="2" 
      strokeDasharray={dashed ? "5 5" : "none"}
      markerEnd={markerId}
      animate={{ strokeDashoffset: finalPlaying ? animDirection : 0 }}
      transition={{ repeat: Infinity, duration: 1 / speed, ease: "linear" }}
    />
  );
};

const ArchitectureSimulator = ({ architecture, isPlaying, speed }) => {
  const [trafficRate, setTrafficRate] = useState(1); // 1 = normal, 2 = high, 3 = extreme
  const [nodes, setNodes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [faults, setFaults] = useState({});

  useEffect(() => {
    // Setup initial nodes based on architecture
    let initialNodes = [];
    switch(architecture) {
      case 'monolith':
        initialNodes = [
          { id: 'client', name: 'Client', type: 'service', status: 'healthy', x: 0, y: -80 },
          { id: 'app', name: 'Monolith App', type: 'monolith', status: 'healthy', x: 0, y: 0 },
          { id: 'db', name: 'Database', type: 'db', status: 'healthy', x: 0, y: 80 }
        ];
        break;
      case 'modular-monolith':
        initialNodes = [
          { id: 'client', name: 'Client', type: 'service', status: 'healthy', x: 0, y: -80 },
          { id: 'module-a', name: 'Users', type: 'module', status: 'healthy', x: -60, y: 0 },
          { id: 'module-b', name: 'Billing', type: 'module', status: 'healthy', x: 60, y: 0 },
          { id: 'db', name: 'Database', type: 'db', status: 'healthy', x: 0, y: 80 }
        ];
        break;
      case 'soa':
        initialNodes = [
          { id: 'esb', name: 'ESB', type: 'bus', status: 'healthy', x: 0, y: 0 },
          { id: 'svc1', name: 'Service A', type: 'service', status: 'healthy', x: -100, y: -80 },
          { id: 'svc2', name: 'Service B', type: 'service', status: 'healthy', x: 100, y: -80 },
          { id: 'db1', name: 'Shared DB', type: 'db', status: 'healthy', x: 0, y: 80 }
        ];
        break;
      case 'microservices':
        initialNodes = [
          { id: 'gw', name: 'API Gateway', type: 'gateway', status: 'healthy', x: 0, y: -80 },
          { id: 'svc1', name: 'User Svc', type: 'service', status: 'healthy', x: -100, y: 20 },
          { id: 'svc2', name: 'Order Svc', type: 'service', status: 'healthy', x: 0, y: 20 },
          { id: 'svc3', name: 'Payment Svc', type: 'service', status: 'healthy', x: 100, y: 20 }
        ];
        break;
      case 'strangler-fig':
        initialNodes = [
          { id: 'router', name: 'Router', type: 'gateway', status: 'healthy', x: 0, y: -80 },
          { id: 'legacy', name: 'Legacy Monolith', type: 'monolith', status: 'healthy', x: -80, y: 20 },
          { id: 'new', name: 'New Microservice', type: 'service', status: 'healthy', x: 80, y: 20 }
        ];
        break;
      case 'bff':
        initialNodes = [
          { id: 'mobile-bff', name: 'Mobile BFF', type: 'bff', status: 'healthy', x: -80, y: -40 },
          { id: 'web-bff', name: 'Web BFF', type: 'bff', status: 'healthy', x: 80, y: -40 },
          { id: 'svc1', name: 'Service A', type: 'service', status: 'healthy', x: -50, y: 60 },
          { id: 'svc2', name: 'Service B', type: 'service', status: 'healthy', x: 50, y: 60 }
        ];
        break;
      case 'event-driven':
        initialNodes = [
          { id: 'pub', name: 'Publisher', type: 'service', status: 'healthy', x: -100, y: -40 },
          { id: 'bus', name: 'Event Bus', type: 'bus', status: 'healthy', x: 0, y: 0 },
          { id: 'sub1', name: 'Consumer A', type: 'service', status: 'healthy', x: 100, y: -60 },
          { id: 'sub2', name: 'Consumer B', type: 'service', status: 'healthy', x: 100, y: 60 }
        ];
        break;
      case 'cqrs':
        initialNodes = [
          { id: 'cmd', name: 'Command Svc', type: 'service', status: 'healthy', x: -80, y: -40 },
          { id: 'query', name: 'Query Svc', type: 'service', status: 'healthy', x: 80, y: -40 },
          { id: 'db-write', name: 'Write DB', type: 'db', status: 'healthy', x: -80, y: 60 },
          { id: 'db-read', name: 'Read DB', type: 'db', status: 'healthy', x: 80, y: 60 }
        ];
        break;
      case 'saga':
        initialNodes = [
          { id: 'order', name: 'Order Svc', type: 'service', status: 'healthy', x: -100, y: 0 },
          { id: 'pay', name: 'Payment Svc', type: 'service', status: 'healthy', x: 0, y: 0 },
          { id: 'inventory', name: 'Inventory Svc', type: 'service', status: 'healthy', x: 100, y: 0 }
        ];
        break;
      case 'circuit-breaker':
        initialNodes = [
          { id: 'client', name: 'Client Svc', type: 'service', status: 'healthy', x: -80, y: 0 },
          { id: 'cb', name: 'Circuit Breaker', type: 'gateway', status: 'healthy', x: 0, y: 0 },
          { id: 'remote', name: 'Remote Svc', type: 'service', status: 'healthy', x: 80, y: 0 }
        ];
        break;
      case 'sync-async':
        initialNodes = [
          { id: 'client1', name: 'Sync Client', type: 'service', status: 'healthy', x: -80, y: -50 },
          { id: 'server1', name: 'Server', type: 'service', status: 'healthy', x: 80, y: -50 },
          { id: 'client2', name: 'Async Client', type: 'service', status: 'healthy', x: -80, y: 50 },
          { id: 'queue', name: 'Queue', type: 'bus', status: 'healthy', x: 0, y: 50 },
          { id: 'server2', name: 'Worker', type: 'service', status: 'healthy', x: 80, y: 50 }
        ];
        break;
      case 'api-gateway':
        initialNodes = [
          { id: 'client', name: 'Clients', type: 'service', status: 'healthy', x: 0, y: -80 },
          { id: 'gw', name: 'API Gateway', type: 'gateway', status: 'healthy', x: 0, y: 0 },
          { id: 'svc1', name: 'Auth Svc', type: 'service', status: 'healthy', x: -80, y: 80 },
          { id: 'svc2', name: 'Product Svc', type: 'service', status: 'healthy', x: 80, y: 80 }
        ];
        break;
      case 'service-mesh':
        initialNodes = [
          { id: 'svc1', name: 'Service A', type: 'service', status: 'healthy', x: -80, y: -40 },
          { id: 'proxy1', name: 'Sidecar', type: 'gateway', status: 'healthy', x: -80, y: 10 },
          { id: 'proxy2', name: 'Sidecar', type: 'gateway', status: 'healthy', x: 80, y: 10 },
          { id: 'svc2', name: 'Service B', type: 'service', status: 'healthy', x: 80, y: -40 }
        ];
        break;
      default:
        initialNodes = [{ id: 'app', name: 'System', type: 'monolith', status: 'healthy', x: 0, y: 0 }];
    }
    setNodes(initialNodes);
  }, [architecture]);

  const toggleFault = (nodeId) => {
    setFaults(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Render helpers
  const renderNodes = () => {
    return nodes.map(node => {
      const isDead = faults[node.id];
      let bg = '#06b6d4';
      if (node.type === 'monolith') bg = '#f59e0b';
      if (node.type === 'gateway' || node.type === 'bff') bg = '#10b981';
      if (node.type === 'db') bg = '#8b5cf6';
      if (node.type === 'bus') bg = '#f43f5e';

      let isUnreachable = false;
      if (architecture === 'api-gateway' && faults['gw'] && (node.id === 'svc1' || node.id === 'svc2')) isUnreachable = true;
      if (architecture === 'microservices' && faults['gw'] && node.id.startsWith('svc')) isUnreachable = true;
      if (architecture === 'strangler-fig' && faults['router'] && (node.id === 'legacy' || node.id === 'new')) isUnreachable = true;
      if (architecture === 'monolith' && faults['app'] && node.id === 'db') isUnreachable = true;
      if (architecture === 'modular-monolith' && faults['module-a'] && faults['module-b'] && node.id === 'db') isUnreachable = true;
      if (architecture === 'soa' && faults['esb'] && (node.id === 'svc1' || node.id === 'svc2' || node.id === 'db1')) isUnreachable = true;
      if (architecture === 'circuit-breaker' && faults['cb'] && node.id === 'remote') isUnreachable = true;
      if (architecture === 'sync-async' && faults['queue'] && node.id === 'server2') isUnreachable = true;
      
      let nodeName = isDead ? 'DOWN' : node.name;
      let opacity = isDead ? 0.5 : (isUnreachable ? 0.4 : 1);
      let border = isDead ? '2px solid #ef4444' : '2px solid transparent';
      
      if (isUnreachable && !isDead) {
        bg = '#374151'; // Make unreachable nodes look inactive
      }
      
      if (architecture === 'circuit-breaker' && node.id === 'cb') {
        const isRemoteDead = faults['remote'];
        if (isRemoteDead) {
          nodeName = 'OPEN';
          border = '2px dashed #f59e0b';
          bg = '#b45309';
          opacity = 1;
        }
      }
      
      return (
        <motion.div
          key={node.id}
          className="absolute flex items-center justify-center font-space text-xs font-bold text-[#050d1a] cursor-pointer shadow-lg transition-colors z-10"
          style={{
            left: node.x + 200 - 40,
            top: node.y + 125 - 20,
            width: 80,
            height: 40,
            backgroundColor: isDead ? '#4b5563' : bg,
            borderRadius: node.type === 'db' ? '50%' : '8px',
            opacity: opacity,
            border: border
          }}
          onClick={() => toggleFault(node.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {nodeName}
        </motion.div>
      );
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="text-xs font-space text-gray-500 flex items-center mr-2">Traffic:</div>
        {[1, 2, 3].map(rate => (
          <button
            key={rate}
            onClick={() => setTrafficRate(rate)}
            className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs transition-colors
              ${trafficRate === rate ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
            `}
          >
            {rate}
          </button>
        ))}
      </div>

      <div className="absolute top-4 left-4 text-xs font-space text-gray-500 z-20 max-w-[200px]">
        Click any node to simulate a failure. Watch how the architecture handles it.
      </div>

      <div className="relative w-[400px] h-[250px] flex items-center justify-center bg-[#020611] border border-gray-800 rounded-xl overflow-hidden mt-8">
        
        <svg className="absolute inset-0 w-full h-full z-0">
          <defs>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
          </defs>

          {architecture === 'monolith' && (
            <>
              <AnimatedConnection x1="200" y1="45" x2="200" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['app'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="200" y1="125" x2="200" y2="205" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['app'] ? 'inactive' : (faults['db'] ? 'blocked' : 'healthy')} />
            </>
          )}
          {architecture === 'modular-monolith' && (
            <>
              <AnimatedConnection x1="200" y1="45" x2="140" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['module-a'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="200" y1="45" x2="260" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['module-b'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="140" y1="125" x2="200" y2="205" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['module-a'] ? 'inactive' : (faults['db'] ? 'blocked' : 'healthy')} />
              <AnimatedConnection x1="260" y1="125" x2="200" y2="205" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['module-b'] ? 'inactive' : (faults['db'] ? 'blocked' : 'healthy')} />
            </>
          )}

          {architecture === 'microservices' && (
            <>
              <AnimatedConnection x1="200" y1="45" x2="100" y2="145" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['gw'] ? 'inactive' : (faults['svc1'] ? 'blocked' : 'healthy')} />
              <AnimatedConnection x1="200" y1="45" x2="200" y2="145" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['gw'] ? 'inactive' : (faults['svc2'] ? 'blocked' : 'healthy')} />
              <AnimatedConnection x1="200" y1="45" x2="300" y2="145" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['gw'] ? 'inactive' : (faults['svc3'] ? 'blocked' : 'healthy')} />
            </>
          )}
          {architecture === 'soa' && (
            <>
              <AnimatedConnection x1="200" y1="125" x2="100" y2="45" color="#f43f5e" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['esb'] ? 'inactive' : (faults['svc1'] ? 'blocked' : 'healthy')} />
              <AnimatedConnection x1="200" y1="125" x2="300" y2="45" color="#f43f5e" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['esb'] ? 'inactive' : (faults['svc2'] ? 'blocked' : 'healthy')} />
              <AnimatedConnection x1="200" y1="125" x2="200" y2="205" color="#f43f5e" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['esb'] ? 'inactive' : (faults['db1'] ? 'blocked' : 'healthy')} />
            </>
          )}
          {architecture === 'strangler-fig' && (
            <>
              <AnimatedConnection x1="200" y1="45" x2="120" y2="145" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['router'] ? 'inactive' : (faults['legacy'] ? 'blocked' : 'healthy')} />
              <AnimatedConnection x1="200" y1="45" x2="280" y2="145" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['router'] ? 'inactive' : (faults['new'] ? 'blocked' : 'healthy')} />
            </>
          )}
          {architecture === 'bff' && (
            <>
              <AnimatedConnection x1="120" y1="85" x2="150" y2="185" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['svc1'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="120" y1="85" x2="250" y2="185" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['svc2'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="280" y1="85" x2="250" y2="185" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['svc2'] ? 'blocked' : 'healthy'} />
            </>
          )}
          {architecture === 'event-driven' && (
            <>
              <AnimatedConnection x1="100" y1="85" x2="200" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['bus'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="200" y1="125" x2="300" y2="65" color="#10b981" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['sub1'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="200" y1="125" x2="300" y2="185" color="#10b981" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['sub2'] ? 'blocked' : 'healthy'} />
            </>
          )}
          {architecture === 'cqrs' && (
            <>
              <AnimatedConnection x1="120" y1="85" x2="120" y2="185" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['db-write'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="280" y1="85" x2="280" y2="185" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['db-read'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="120" y1="185" x2="280" y2="185" color="#10b981" isPlaying={isPlaying} speed={speed * trafficRate} status={faults['db-read'] ? 'blocked' : 'healthy'} />
            </>
          )}
          {architecture === 'saga' && (
            <>
              <AnimatedConnection x1="100" y1="125" x2="200" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['pay'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="200" y1="125" x2="300" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['inventory'] ? 'blocked' : 'healthy'} />
              {(faults['inventory'] || faults['pay']) && (
                <AnimatedConnection path="M 300 135 Q 200 180 100 135" color="#ef4444" isPlaying={isPlaying} speed={speed * trafficRate} status="compensating" />
              )}
            </>
          )}
          {architecture === 'circuit-breaker' && (
            <>
              <AnimatedConnection x1="120" y1="125" x2="200" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['cb'] || faults['remote'] ? 'blocked' : 'healthy'} />
              {!faults['remote'] && !faults['cb'] && (
                <AnimatedConnection x1="200" y1="125" x2="280" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} />
              )}
            </>
          )}
          {architecture === 'sync-async' && (
            <>
              {/* Sync: Request and Response loop */}
              <AnimatedConnection x1="120" y1="65" x2="280" y2="65" color="#f59e0b" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['server1'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="280" y1="85" x2="120" y2="85" color="#f59e0b" isPlaying={isPlaying} speed={speed * trafficRate} dashed={true} status={faults['server1'] ? 'inactive' : 'healthy'} />
              
              {/* Async: Fast publish, decoupled consume */}
              <AnimatedConnection x1="120" y1="175" x2="200" y2="175" color="#10b981" isPlaying={isPlaying} speed={speed * trafficRate * 2} dashed={false} status={faults['queue'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="200" y1="175" x2="280" y2="175" color="#06b6d4" isPlaying={isPlaying} speed={speed * trafficRate * 0.7} dashed={true} status={faults['queue'] ? 'inactive' : (faults['server2'] ? 'blocked' : 'healthy')} />
            </>
          )}
          {architecture === 'api-gateway' && (
            <>
              <AnimatedConnection x1="200" y1="45" x2="200" y2="125" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['gw'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="200" y1="125" x2="120" y2="205" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['gw'] ? 'inactive' : (faults['svc1'] ? 'blocked' : 'healthy')} />
              <AnimatedConnection x1="200" y1="125" x2="280" y2="205" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['gw'] ? 'inactive' : (faults['svc2'] ? 'blocked' : 'healthy')} />
            </>
          )}
          {architecture === 'service-mesh' && (
            <>
              <AnimatedConnection x1="120" y1="85" x2="120" y2="135" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['proxy1'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="280" y1="85" x2="280" y2="135" color="#4b5563" isPlaying={isPlaying} speed={speed * trafficRate} dashed={false} status={faults['proxy2'] ? 'blocked' : 'healthy'} />
              <AnimatedConnection x1="120" y1="135" x2="280" y2="135" color="#f43f5e" isPlaying={isPlaying} speed={speed * trafficRate} dashed={true} status={faults['proxy2'] || faults['svc2'] ? 'blocked' : 'healthy'} />
            </>
          )}
        </svg>

        {renderNodes()}
      </div>

    </div>
  );
};

export default ArchitectureSimulator;
