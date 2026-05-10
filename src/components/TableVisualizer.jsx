import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TableVisualizer = ({ 
  tableName, 
  columns, 
  rows, 
  highlightedRows = [], 
  highlightedCells = [], // format: [{rowIdx, colIdx, color}]
  dimmedRows = [],
  color = '#f59e0b',
  className = ""
}) => {
  return (
    <div className={`flex flex-col bg-[#0a1526] border border-gray-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {tableName && (
        <div className="bg-[#050d1a] px-4 py-2 border-b border-gray-800 flex items-center justify-between">
          <span className="font-mono text-sm font-bold" style={{ color }}>{tableName}</span>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300 font-source">
          <thead className="bg-[#050d1a]/50 text-xs uppercase font-mono text-gray-500 border-b border-gray-800">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 whitespace-nowrap">
                  {col.name}
                  {col.type && (
                    <span className="ml-2 text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">
                      {col.type}
                    </span>
                  )}
                  {col.key && (
                    <span className="ml-1 text-[10px] bg-amber-900/30 text-amber-500 px-1.5 py-0.5 rounded border border-amber-900/50">
                      PK
                    </span>
                  )}
                  {col.fk && (
                    <span className="ml-1 text-[10px] bg-cyan-900/30 text-cyan-500 px-1.5 py-0.5 rounded border border-cyan-900/50">
                      FK
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.map((row, rowIdx) => {
                const isHighlighted = highlightedRows.includes(rowIdx);
                const isDimmed = dimmedRows.includes(rowIdx);
                
                return (
                  <motion.tr
                    key={row.id || rowIdx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: isDimmed ? 0.3 : 1, 
                      y: 0,
                      backgroundColor: isHighlighted ? `${color}1A` : 'transparent'
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`border-b border-gray-800/50 last:border-0 transition-colors ${isHighlighted ? '' : 'hover:bg-white/5'}`}
                  >
                    {columns.map((col, colIdx) => {
                      const cellHighlight = highlightedCells.find(h => h.rowIdx === rowIdx && h.colIdx === colIdx);
                      const isNull = row[col.key || col.name] === null || row[col.key || col.name] === undefined;
                      const cellValue = isNull ? 'NULL' : row[col.key || col.name];
                      
                      return (
                        <td 
                          key={colIdx} 
                          className="px-4 py-3 whitespace-nowrap relative"
                        >
                          {cellHighlight && (
                            <motion.div 
                              layoutId={`highlight-${rowIdx}-${colIdx}`}
                              className="absolute inset-1 rounded opacity-20"
                              style={{ backgroundColor: cellHighlight.color || color }}
                            />
                          )}
                          <span className={`relative z-10 ${isNull ? 'text-gray-600 italic' : ''} ${cellHighlight ? 'font-bold' : ''}`}
                                style={cellHighlight ? { color: cellHighlight.color || color } : {}}>
                            {cellValue.toString()}
                          </span>
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-600 font-mono text-xs italic">
                  Empty Set
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableVisualizer;
