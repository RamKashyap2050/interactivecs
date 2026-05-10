import React, { useState } from 'react';
import AnimationPlayer from '../components/AnimationPlayer';
import LinearRegressionAnim from './regression/LinearRegressionAnim';
import MultipleRegressionAnim from './regression/MultipleRegressionAnim';
import LogisticRegressionAnim from './regression/LogisticRegressionAnim';
import RidgeRegressionAnim from './regression/RidgeRegressionAnim';
import LassoRegressionAnim from './regression/LassoRegressionAnim';
import CARTAnim from './classification/CARTAnim';
import ID3Anim from './classification/ID3Anim';
import C45Anim from './classification/C45Anim';
import CHAIDAnim from './classification/CHAIDAnim';
import RandomForestAnim from './ensemble/RandomForestAnim';
import GBMAnim from './ensemble/GBMAnim';
import BaggingAnim from './ensemble/BaggingAnim';
import XGBoostAnim from './ensemble/XGBoostAnim';
import CatBoostAnim from './ensemble/CatBoostAnim';
import LightGBMAnim from './ensemble/LightGBMAnim';
import StackingAnim from './ensemble/StackingAnim';
import KMeansAnim from './unsupervised/KMeansAnim';
import DBSCANAnim from './unsupervised/DBSCANAnim';
import HierarchicalAnim from './unsupervised/HierarchicalAnim';

// DSA Imports
import ArrayAnim from './dataStructures/linear/ArrayAnim';
import StackAnim from './dataStructures/linear/StackAnim';
import QueueAnim from './dataStructures/linear/QueueAnim';
import LinkedListAnim from './dataStructures/linear/LinkedListAnim';
import BinaryTreeAnim from './dataStructures/nonLinear/BinaryTreeAnim';
import BSTAnim from './dataStructures/nonLinear/BSTAnim';
import AVLTreeAnim from './dataStructures/nonLinear/AVLTreeAnim';
import BTreeAnim from './dataStructures/nonLinear/BTreeAnim';
import BPlusTreeAnim from './dataStructures/nonLinear/BPlusTreeAnim';
import HeapAnim from './dataStructures/nonLinear/HeapAnim';
import GraphAnim from './dataStructures/nonLinear/GraphAnim';

// Sorting & Searching & Pathfinding Imports
import SortingPlayground from '../components/SortingPlayground';
import LinearSearchAnim from './dataStructures/searching/LinearSearchAnim';
import BinarySearchAnim from './dataStructures/searching/BinarySearchAnim';
import BFSAnim from './dataStructures/searching/BFSAnim';
import DFSAnim from './dataStructures/searching/DFSAnim';
import DijkstraAnim from './dataStructures/graphs/DijkstraAnim';
import AStarAnim from './dataStructures/graphs/AStarAnim';
import BellmanFordAnim from './dataStructures/graphs/BellmanFordAnim';

// Architecture Imports
import ArchitectureSimulator from './systemDesign/ArchitectureSimulator';

import { getTopicBySlug } from '../data/index';

const AnimationFactory = ({ algorithmSlug, preview = false }) => {
  const [isPlaying, setIsPlaying] = useState(preview);
  const [speed, setSpeed] = useState(preview ? 2 : 1); // Run faster in preview
  const [key, setKey] = useState(0);

  const algorithm = getTopicBySlug(algorithmSlug);
  
  if (!algorithm) return null;

  const handleRestart = () => {
    setIsPlaying(false);
    setKey(prev => prev + 1);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const renderAnimation = () => {
    switch (algorithmSlug) {
      case 'linear-regression':
        return <LinearRegressionAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'multiple-regression':
        return <MultipleRegressionAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'logistic-regression':
        return <LogisticRegressionAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'ridge-regression':
        return <RidgeRegressionAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'lasso-regression':
        return <LassoRegressionAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'cart':
        return <CARTAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'id3':
        return <ID3Anim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'c45':
        return <C45Anim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'chaid':
        return <CHAIDAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'random-forest':
        return <RandomForestAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'gbm':
        return <GBMAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'bagging':
        return <BaggingAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'xgboost':
        return <XGBoostAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'catboost':
        return <CatBoostAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'lightgbm':
        return <LightGBMAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'stacking':
        return <StackingAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'k-means':
        return <KMeansAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'dbscan':
        return <DBSCANAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'hierarchical':
        return <HierarchicalAnim key={key} isPlaying={isPlaying} speed={speed} />;
      
      // DSA - Linear
      case 'array': return <ArrayAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'stack': return <StackAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'queue': return <QueueAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'linked-list': return <LinkedListAnim key={key} isPlaying={isPlaying} speed={speed} />;
      
      // DSA - Non-Linear
      case 'binary-tree': return <BinaryTreeAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'bst': return <BSTAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'avl-tree': return <AVLTreeAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'b-tree': return <BTreeAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'b-plus-tree': return <BPlusTreeAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'heap': return <HeapAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'graph': return <GraphAnim key={key} isPlaying={isPlaying} speed={speed} />;

      // Sorting
      case 'bubble-sort':
      case 'selection-sort':
      case 'insertion-sort':
      case 'merge-sort':
      case 'quick-sort':
      case 'heap-sort':
      case 'radix-sort':
      case 'tim-sort':
        return <SortingPlayground key={key} algorithm={algorithmSlug} isPlaying={isPlaying} speed={speed} />;

      // Searching
      case 'linear-search': return <LinearSearchAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'binary-search': return <BinarySearchAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'bfs': return <BFSAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'dfs': return <DFSAnim key={key} isPlaying={isPlaying} speed={speed} />;

      // Graphs (Pathfinding)
      case 'dijkstra': return <DijkstraAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'a-star': return <AStarAnim key={key} isPlaying={isPlaying} speed={speed} />;
      case 'bellman-ford': return <BellmanFordAnim key={key} isPlaying={isPlaying} speed={speed} />;

      // System Architecture Patterns
      case 'monolith':
      case 'modular-monolith':
      case 'soa':
      case 'microservices':
      case 'strangler-fig':
      case 'bff':
      case 'event-driven':
      case 'cqrs':
      case 'saga':
      case 'circuit-breaker':
      case 'sync-async':
      case 'api-gateway':
      case 'service-mesh':
        return <ArchitectureSimulator key={key} architecture={algorithmSlug} isPlaying={isPlaying} speed={speed} />;

      default:
        return <div className="text-gray-500 font-space">Animation for {algorithm.name} coming soon.</div>;
    }
  };

  if (preview) {
    return (
      <div className="w-[1000px] h-[650px] relative origin-top-left transform scale-[0.24] pointer-events-none opacity-80">
        {renderAnimation()}
      </div>
    );
  }

  return (
    <AnimationPlayer
      isPlaying={isPlaying}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onRestart={handleRestart}
      speed={speed}
      onSpeedChange={setSpeed}
      color={algorithm.color}
    >
      {renderAnimation()}
    </AnimationPlayer>
  );
};

export default AnimationFactory;
