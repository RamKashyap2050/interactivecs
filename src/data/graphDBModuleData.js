export const graphDBModuleData = {
  id: 'graphdb',
  title: 'Graph Database (Neo4j)',
  color: '#8b5cf6',
  chapters: [
    {
      id: 'graph-model',
      title: 'Graph Model',
      animationComponent: 'GraphModelAnim',
      bookRef: null,
      steps: [
        { name: 'Nodes — Entities', description: 'A node is an entity. A person, a company, a product, an event. Labels categorize them (:Person, :Company, :Project, :Skill). Properties describe them — id, name, age, city. In a relational database, nodes are rows. In a graph database, nodes are first-class citizens with direct relationships stored alongside them.' },
        { name: 'Edges — Relationships', description: 'Edges ARE the data in a graph database. Not a foreign key. Not a join table. The relationship itself is stored, named, directional, and carries properties. WORKS_AT {since: 2019, role: "Engineer"}. KNOWS {since: 2020, context: "work"}. In SQL: relationships are implicit. In Graph DB: relationships are explicit, stored, and traversable in O(1).' },
        { name: 'Property Graph Model', description: 'The property graph model: nodes with labels and properties, edges with types, direction, and properties. A graph database stores this natively — not as rows and foreign keys, but as actual connected structures in memory. The pointer IS the relationship. Following an edge costs one pointer dereference, not a join across tables.' },
        { name: 'Graph vs SQL Comparison', description: 'SQL: "Find friends of friends of Ram" requires 2 self-JOINs and a subquery — complex, slow at scale. Graph DB: MATCH (ram)-[:KNOWS*2]->(fof) — one pattern, O(1) per hop. The graph model shines when relationships are the data, not an afterthought. Social networks, recommendation engines, fraud detection, knowledge graphs.' },
      ]
    },
    {
      id: 'graph-representations',
      title: 'Graph Representations',
      animationComponent: 'GraphRepAnim',
      bookRef: 'DSA Module — Adjacency Matrix — now in database context',
      steps: [
        { name: 'Adjacency Matrix', description: 'A 5×5 matrix where cell [i][j]=1 means node i connects to node j. Edge lookup: O(1). Space: O(V²). With 5 nodes and 4 edges, 21 cells are zero — wasted. Scale to 1M users: 1M × 1M = 1 trillion cells. Average user knows 200 people. 99.98% of the matrix is zero. Not viable for production.' },
        { name: 'Sparse Matrix Problem', description: 'Social networks are sparse graphs — most nodes connect to only a few others relative to the total. 1 million users, 200M friendships: adjacency matrix needs 1 trillion cells, 200M with value 1. 99.98% zeros. The matrix teaches the concept. No production graph database uses adjacency matrix storage. We need something better.' },
        { name: 'Adjacency List', description: 'Store only actual edges. Ram: [Varsha, Praneel]. Varsha: [Alice]. Space: O(V + E). At 1M users, 200M friendships: 200M list entries stored — vs 1 trillion for the matrix. 5,000× more space efficient. Finding neighbors: go to that node\'s list, return it. O(degree). The basis of how graph databases store data.' },
        { name: 'Native Graph Storage — Index-Free Adjacency', description: 'The superpower of native graph databases. Each node in memory directly holds a pointer to its first relationship record. Each relationship record chains to the next. Query "Who does Ram know?": follow pointer from Ram → first rel → next → next → done. Zero table scans. Zero index lookups. O(degree of Ram) regardless of graph size. 1B users: same speed as 1M users for local traversal.' },
        { name: 'Matrix Powers for Analytics', description: 'A² = A multiplied by A. A²[i][j] = number of paths of length 2 from i to j. A³[i][j] = 3-hop paths. Google\'s PageRank is an eigenvector of the adjacency matrix — iterative matrix multiplication until convergence. Betweenness centrality, clustering coefficient — all computable via matrix operations. The matrix isn\'t for storing graphs — it\'s for analyzing them.' },
      ]
    },
    {
      id: 'traversal',
      title: 'Graph Traversal',
      animationComponent: 'GraphTraversalAnim',
      bookRef: null,
      steps: [
        { name: 'BFS — Friends Within 2 Hops', description: 'Breadth-First Search expands level by level. Start at Ram. Level 1: all people Ram knows directly (3 nodes). Level 2: all people those people know (5 more nodes). Result: 8 people reachable within 2 hops. BFS guarantees the shortest hop-count path. Used in social graph "degrees of separation" and recommendation engines.' },
        { name: 'DFS — Finding Paths', description: 'Depth-First Search dives deep before backtracking. "Is there a path from Ram to Bob?" DFS follows Ram→Varsha→Alice→Bob — found. If it hits a dead end, backtracks and tries another branch. DFS is used for cycle detection, topological sort, and finding all paths between two nodes. Graph databases execute DFS natively via pointer traversal.' },
        { name: 'Shortest Path', description: 'Dijkstra\'s algorithm on a weighted graph: relationship weights represent connection strength or cost. Neo4j\'s shortestPath() is a built-in first-class function — not application code, not a recursive CTE. The graph database executes it via optimized pointer traversal. Used in logistics (shortest route), social networks (degrees of separation), and network analysis.' },
        { name: 'Friends-of-Friends Query', description: 'SQL: 3 JOINs + subquery + EXCEPT to find friends-of-friends not already known. Complex, slow at scale. Cypher: MATCH (ram)-[:KNOWS*2]-(fof) WHERE NOT (ram)-[:KNOWS]-(fof). One pattern. The database traverses pointers, not indexes. At 1M users with 200M edges, the graph DB query runs in milliseconds. The SQL query runs in seconds.' },
      ]
    },
    {
      id: 'cypher',
      title: 'Cypher Query Language',
      animationComponent: 'CypherAnim',
      bookRef: null,
      steps: [
        { name: 'Pattern Matching Concept', description: 'Cypher reads like ASCII art of the graph. (node)-[edge]->(node) is both the syntax and the visual representation of what you\'re querying. The pattern you write IS the shape you\'re finding in the graph. (p:Person) matches any person node. [:KNOWS] matches an edge of type KNOWS. The query language mirrors the data model.' },
        { name: 'MATCH — Find Nodes', description: 'MATCH (p:Person {name: "Ram"}) RETURN p — finds Ram\'s node, highlights it. The curly brace filter {name: "Ram"} is a property filter. Labels (:Person) restrict node types. RETURN specifies what to give back. Simple, readable, powerful. No FROM, no WHERE clauses for basic lookups — the pattern IS the query.' },
        { name: 'Traverse Relationships', description: 'MATCH (p:Person {name:"Ram"})-[:KNOWS]->(friend) RETURN friend.name — follows all KNOWS edges outward from Ram. Each match lights up one of Ram\'s connections. The arrow direction (->) matters — [:KNOWS]-> means Ram knows them, not they know Ram. Undirected: -[:KNOWS]-. Both directions matter in property graphs.' },
        { name: 'Variable-Length Paths', description: 'MATCH (p)-[:KNOWS*2]->(fof) — *2 means exactly 2 hops. [:KNOWS*1..3] means 1 to 3 hops. [:KNOWS*] means any depth (use with LIMIT!). Variable-length traversal expands rings outward from a node. The database follows pointer chains to any depth. This would be recursive CTEs in SQL. In Cypher: star notation.' },
        { name: 'Recommendation Query', description: 'MATCH (ram)-[:SKILLED_IN]->(skill)<-[:SKILLED_IN]-(other) WHERE NOT (ram)-[:KNOWS]-(other) RETURN other.name, collect(skill.name) as shared_skills ORDER BY size(shared_skills) DESC LIMIT 5. This finds people who share skills with Ram but aren\'t already connected. 6 lines. The SQL equivalent: 15 lines, 3 subqueries, 4 JOINs. Expressiveness is correctness.' },
      ]
    },
    {
      id: 'scale-sharding',
      title: 'Scale & Sharding',
      animationComponent: 'GraphScaleAnim',
      bookRef: null,
      steps: [
        { name: 'The Graph Sharding Problem', description: 'SQL sharding: partition by user_id. Clean — each row is independent, Shard 1 rarely needs Shard 2. Graph sharding: an edge between a node on Shard 1 and a node on Shard 2 requires a network hop to follow. Deep traversal at depth 6 = up to 6 cross-shard network roundtrips. This is the fundamental tension: graphs are connected by nature, distributed systems require disconnection.' },
        { name: 'Cut Edges — The Cost', description: 'Every edge that crosses a shard boundary becomes a "cut edge." Following a cut edge: network roundtrip to another machine (~1ms+). Local edge: pointer dereference (~nanoseconds). 1ms vs 1ns = 1,000,000× slower. At depth 6 traversal with 50% cross-shard edges: 3 network hops = ~3ms overhead vs ~nanoseconds for local. The partition strategy determines query performance.' },
        { name: 'Community Detection Partitioning', description: 'Run Louvain community detection or label propagation on the graph before sharding. Natural clusters emerge — friend groups, topic communities, organizational units. Assign each community to a shard. Result: most edges stay within communities = within shards. Cross-shard edges only occur at community boundaries. 70-90% of traversals stay local vs 50% with random partitioning.' },
        { name: 'Vertex Cut vs Edge Cut', description: 'Edge cut: assign nodes to shards, cut edges that cross boundaries. Simple, but cross-shard traversal for high-degree nodes (celebrities, hub companies) is frequent. Vertex cut: duplicate high-degree nodes on multiple shards. Ram (10K connections) duplicated on all 4 shards — queries about Ram resolve locally anywhere. More storage, much faster traversal for hubs.' },
        { name: 'Native Scale Solutions', description: 'Neo4j: vertical scaling to ~100B edges on one large server — handles most real-world use cases. Neo4j Fabric: federated queries across multiple databases. Amazon Neptune: managed, auto-scales read replicas. TigerGraph: purpose-built distributed graph DB. For 99% of applications: one big Neo4j instance handles everything. Distributed graph is a very specific, hard problem — avoid unless necessary.' },
        { name: 'Graph Analytics at Scale (Pregel)', description: 'Apache Spark GraphX uses the Pregel model for analytical graph processing on billions of nodes. Each vertex: receives messages from neighbors, computes a new value, sends messages to neighbors. Iterate until convergence. PageRank on 1B nodes: ~10 iterations, each a distributed message-passing wave. Node importance stabilizes. The adjacency matrix we studied: this is how it runs at planetary scale.' },
      ]
    },
  ]
};
