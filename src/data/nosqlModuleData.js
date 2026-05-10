export const nosqlModuleData = {
  id: 'nosql',
  title: 'NoSQL (Distributed Databases)',
  color: '#06b6d4',
  chapters: [
    {
      id: 'document-model',
      title: 'Document Model',
      animationComponent: 'DocumentModelAnim',
      bookRef: 'MongoDB: The Definitive Guide — Ch. 2',
      steps: [
        { name: 'The SQL Row Problem', description: 'A SQL row is rigid. Every column exists on every row. Ram\'s user record and Varsha\'s user record have identical structure — even when 80% of the fields don\'t apply to one of them. The schema is a contract you sign before you understand your data.' },
        { name: 'The MongoDB Document', description: 'A document is a JSON-like structure that can contain nested objects, arrays, and any shape of data. Ram\'s user document contains his address, skills, and projects — all in one read. No JOINs. No separate tables. One document, one query.' },
        { name: 'Nested Objects Unfold', description: 'The address isn\'t a separate table. It\'s a subdocument nested inside the user document. Query user — get address for free. No JOIN needed. The cost: updating deeply nested data requires careful update operators ($set, $push). The benefit: reads are O(1).' },
        { name: 'Arrays in Documents', description: 'The skills array contains all of Ram\'s skills. The projects array contains full project objects. SQL would require junction tables for both. MongoDB stores them inline. One document. Complete data. MongoDB can index array elements — query "find all users with Python skill" works efficiently.' },
        { name: 'Schema Flexibility', description: 'Three documents in one collection. Different shapes. User 1 has all fields. User 2 has only name and email. User 3 has an extra "company" field. All accepted. SQL equivalent: ALTER TABLE — affects ALL rows, migration required, possible downtime at scale. MongoDB: add a field to one document, zero impact on others.' },
        { name: 'The Trade-off', description: 'Schema flexibility is power and danger simultaneously. No enforcement = inconsistency creeps in. Some documents have "email", some have "e_mail". Queries break. MongoDB\'s schema validation bridges this — optional JSON Schema validation per collection. Structure where you want it. Flexibility where you need it.' }
      ]
    },
    {
      id: 'key-value-model',
      title: 'Key-Value Model (Redis)',
      animationComponent: 'KeyValueAnim',
      bookRef: null,
      steps: [
        { name: 'The Key-Value Concept', description: 'The simplest data model: a key maps to a value. Hash table at planetary scale. O(1) read. O(1) write. Redis is not just a key-value store — it\'s a data structure server. Five data structures built in. Each optimized for specific access patterns.' },
        { name: 'String — Sessions & Counters', description: 'SET user:1:name "Ram Kashyap" → GET user:1:name → "Ram Kashyap". Simple box: key maps to value. TTL set to expire in 3600 seconds. Use cases: session tokens, cached API responses, page view counters (INCR is atomic — no race conditions). 100M strings fit in ~10GB RAM.' },
        { name: 'List — Queues & Feeds', description: 'LPUSH adds to head. RPUSH adds to tail. LPOP removes from head. LRANGE returns a range. Vertical stack of items. Push/pop from both ends. Use cases: activity feeds (LPUSH new events, LRANGE 0 9 for latest 10), task queues (LPUSH tasks, worker BRPOP blocks waiting), message buffers.' },
        { name: 'Hash — Object Caching', description: 'HSET user:1 name "Ram" age 26 city "Toronto" — mini table within a key. HGET user:1 name → "Ram". HGETALL returns all fields. More memory-efficient than storing full JSON string when you need partial access. Use cases: user sessions (update single field without deserializing whole object), object caching.' },
        { name: 'Set — Unique Tracking', description: 'SADD online_users "ram" "varsha" "praneel" — unordered, no duplicates. SISMEMBER checks membership O(1). SMEMBERS returns all. SUNION, SINTER, SDIFF for set operations. Use cases: unique daily visitors (SADD date:2024 user_id), social graph (who follows both A and B: SINTER), tag systems.' },
        { name: 'Sorted Set — Leaderboards', description: 'ZADD leaderboard 9850 "ram" 7200 "varsha" — each member has a score. ZRANGE returns sorted by score. ZRANK returns position. O(log N) operations. Use cases: gaming leaderboards, rate limiting (score=timestamp, trim by range = sliding window), priority queues (score=priority), news feeds ranked by relevance.' }
      ]
    },
    {
      id: 'wide-column-model',
      title: 'Wide-Column (Cassandra)',
      animationComponent: 'WideColumnAnim',
      bookRef: 'Cassandra: The Definitive Guide — Ch. 4',
      steps: [
        { name: 'Beyond Fixed Columns', description: 'SQL tables have fixed columns — every row has the same columns, NULLs stored for missing values. Cassandra\'s wide-column model: rows can have completely different sets of columns. Sparse data doesn\'t waste space. Row 1 has 3 columns. Row 2 has 8 columns. Row 3 has 2 columns. All in the same table.' },
        { name: 'Partition Key Design', description: 'Cassandra\'s superpower: know where your data lives before you query it. Every row has a partition key. All rows with the same partition key live on the same node. Query for user_id=1: Cassandra hashes the key, finds the node, retrieves data directly. No scatter. No broadcast.' },
        { name: 'Query-First Design', description: 'In SQL, normalize first, query second. In Cassandra, design your table around your queries first. "Find all messages for user_id=5, ordered by timestamp desc" → partition key: user_id, clustering key: timestamp DESC. The data model IS the query plan. Design for access patterns, not data relationships.' },
        { name: 'Write Path: Commit Log + Memtable', description: 'Write arrives → commit log (disk, sequential write) → memtable (RAM). Immediately acknowledged to client. Commit log ensures durability — replayed on crash. Memtable = in-memory buffer. Sequential disk writes are fast (~200MB/s). Random writes would be slow (~5MB/s). Cassandra uses sequential. That\'s why writes are so fast.' },
        { name: 'Write Path: SSTable & Compaction', description: 'Memtable fills up → flushed to SSTable (Sorted String Table) on disk. Immutable once written. Multiple SSTables accumulate. Compaction merges SSTables: removes deleted data (tombstones), merges duplicates, produces one sorted SSTable. Reads check memtable first, then SSTables in reverse chronological order.' },
        { name: 'Why WhatsApp Chose Cassandra', description: '75 million writes per minute. WhatsApp\'s message queues needed extreme write throughput. Cassandra: write to commit log + memtable = done. Replication happens in parallel. No single primary bottleneck. Horizontal scaling: add nodes, capacity scales linearly. WhatsApp ran 2 billion users on a surprisingly small cluster.' }
      ]
    },
    {
      id: 'sharding',
      title: 'Horizontal Scaling & Sharding',
      animationComponent: 'ShardingAnim',
      bookRef: null,
      steps: [
        { name: 'The Vertical Ceiling', description: 'CPU at 90%. RAM at 95%. Disk I/O maxed. Queries slowing. Add more CPU — server grows, cost grows faster. AWS\'s largest EC2 instance: 448 vCPUs, 24 TB RAM, $109/hour. You\'ve hit the physics ceiling. The solution: stop making one machine bigger. Start adding more machines.' },
        { name: 'Range-Based Sharding', description: '100 million user rows split into 4 shards by user_id range. Shard 1: 1-25M (Server 1). Shard 2: 25-50M (Server 2). Query for user_id=42M: router sends directly to Shard 2. One server queried, not four. Simple, predictable, fast for range queries.' },
        { name: 'The Hot Shard Problem', description: 'Old users (low IDs) are more active — they\'ve been using the product longer. Shard 1 handles 80% of traffic. Shards 3 and 4 are nearly idle. Shard 1 melts. Range-based sharding created a new disease: hot shards. The cure became the problem. Hash-based sharding is the answer.' },
        { name: 'Consistent Hashing Ring', description: 'A ring of positions 0 to 2³². Server nodes placed at hash positions on the ring. Incoming data: hash(key) → position. Assign to nearest server clockwise. Distribution is roughly even. The ring is the routing table. No central coordinator needed.' },
        { name: 'Add / Remove Servers', description: 'Add Server E at position 250: only data between 100-250 migrates from Server B to Server E. Other shards untouched. Traditional sharding: add a server = redistribute everything. Consistent hashing: add a server = redistribute 1/N of data. Remove Server C: only Server D absorbs its data. Minimal disruption.' },
        { name: 'Virtual Nodes', description: 'Each physical server gets multiple positions on the ring (virtual nodes). Server A: positions 50, 200, 600. Server B: positions 120, 350, 750. More positions = more data = more load. Heterogeneous clusters: powerful servers get more virtual nodes. Cassandra default: 256 virtual nodes per server. Natural load balancing.' },
        { name: 'Cross-Shard Queries (The Cost)', description: '"Find all users in Toronto" — Toronto users are on ALL shards (hash is by user_id, not city). Router must query all 4 shards simultaneously (scatter), gather results, merge, sort, return. 4 queries instead of 1. Latency multiplies. Design your shard key around your most common query. Everything else will be slow. Accept this.' }
      ]
    },
    {
      id: 'replication',
      title: 'Replication & Consistency',
      animationComponent: 'ReplicationAnim',
      bookRef: 'Designing Data-Intensive Applications — Ch. 5',
      steps: [
        { name: 'Why Replication?', description: 'Single database node. Hardware failure. Server sparks and dies. All data inaccessible. Recovery from backup: 4 hours. Replication: copies of data on multiple servers. One fails — others serve traffic. Replication solves availability AND read scalability simultaneously.' },
        { name: 'Primary-Replica Model', description: 'Primary handles all writes. Two replicas handle reads. Write arrives at Primary → replication stream pushes write to Replica 1 and Replica 2. Read traffic distributed: 33% each node. Read capacity triples with two replicas. Write capacity unchanged — primary is still the bottleneck.' },
        { name: 'Automatic Failover', description: 'Primary fails. Replicas detect absence of heartbeat (typically 30s timeout). Election: Replica 1 promoted to new Primary. Replica 2 now replicates from new Primary. Old Primary comes back: rejoins as replica, syncs missed writes. Total downtime: ~30 seconds. Without replication: hours of manual recovery.' },
        { name: 'Replication Lag & Stale Reads', description: 'Write to Primary. Propagation to replicas takes 200ms (network + processing). During that 200ms: user reads from Replica 1. Replica 1 hasn\'t received the write yet. User sees stale data. This is eventual consistency — eventually all replicas converge. Not immediately. Eventually. Your application must handle reading stale data gracefully.' },
        { name: 'Cassandra Replication Factor', description: 'Replication Factor 3: every row stored on 3 nodes. Write arrives: primary replica + 2 neighbors on the ring all receive the write. QUORUM (2/3 must confirm) → acknowledged. One node dead: data still available. Two nodes dead: QUORUM cannot be met. RF=3, QUORUM: tolerate 1 failure. RF=5, QUORUM: tolerate 2 failures.' },
        { name: 'CAP Theorem', description: 'Consistency, Availability, Partition Tolerance — pick two. During a network partition: CP systems (HBase, ZooKeeper) refuse writes to disconnected nodes — consistent but less available. AP systems (Cassandra, DynamoDB) accept writes to both partitions — available but divergent. CA is theoretical only — partitions always happen in distributed systems.' },
        { name: 'Conflict Resolution', description: 'Network partition heals. Region A wrote "Ram K", Region B wrote "Ram Kashyap" to the same document. Conflict. Three strategies: Last Write Wins (timestamp-based, simple but lossy — clock skew causes wrong winner). Vector Clocks (accurate, complex, application resolves). CRDTs (mathematically conflict-free, commutative merge). Amazon\'s cart used CRDTs — items added during partition, never lost.' }
      ]
    }
  ]
};
