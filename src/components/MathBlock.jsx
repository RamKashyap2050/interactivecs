import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const MathBlock = ({ math, block = true }) => {
  return (
    <div className={`overflow-x-auto py-2 ${block ? 'my-4 text-center' : 'inline-block'}`}>
      {block ? (
        <BlockMath math={math} />
      ) : (
        <InlineMath math={math} />
      )}
    </div>
  );
};

export default MathBlock;
