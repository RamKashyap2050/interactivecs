import { algorithms, categories as mlCategories } from './algorithms';
import { dataStructures, dsaCategories } from './dataStructures';
import { systemPatterns, systemCategories } from './systemPatterns';
import { caseStudies, caseStudyCategories } from './caseStudies';

// Export individual collections
export { algorithms, mlCategories };
export { dataStructures, dsaCategories };
export { systemPatterns, systemCategories };
export { caseStudies, caseStudyCategories };

// Unified massive array for routing/lookup
export const allTopics = [
  ...algorithms,
  ...dataStructures,
  ...systemPatterns,
  ...caseStudies
];

// Helper to get a topic by slug regardless of category
export const getTopicBySlug = (slug) => {
  return allTopics.find(topic => topic.slug === slug);
};
