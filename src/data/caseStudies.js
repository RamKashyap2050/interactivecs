export const caseStudyCategories = [
  { id: 'all', name: 'All Case Studies' },
  { id: 'content-delivery', name: 'Content Delivery', color: '#f59e0b' },
  { id: 'real-time', name: 'Real-Time Systems', color: '#06b6d4' },
  { id: 'social-feed', name: 'Social/Feed Systems', color: '#8b5cf6' },
  { id: 'storage', name: 'Storage Systems', color: '#10b981' },
  { id: 'infrastructure', name: 'Infrastructure', color: '#f43f5e' },
  { id: 'maps-location', name: 'Maps/Location', color: '#eab308' }
];

export const caseStudies = [
  {
    id: 'tinyurl-bitly',
    slug: 'tinyurl-bitly',
    name: 'TinyURL / Bitly',
    category: 'infrastructure',
    color: '#f43f5e',
    tagline: 'A user pastes a long URL. In milliseconds they get back 7 characters. Billions of times per day. How?',
    difficulty: 'Beginner',
    tags: ['Hashing', 'Base62', 'Caching', 'Replication'],
    readTime: '15 min',
    famousFor: 'Generating 3.5 trillion unique short codes with just 7 characters.',
    prerequisites: [
      { name: 'Caching', slug: 'caching' },
      { name: 'Database Replication', slug: 'database-replication' }
    ],
    companies: ['Bitly', 'TinyURL', 'Twitter'],
    interviewAngle: {
      mistake: 'Jumping straight to a massive NoSQL cluster without considering a simple RDBMS with read replicas.',
      bottleneck: 'The read path. Billions of clicks vs millions of creates.',
      questions: [
        'How do you handle hash collisions?',
        'Why Base62 instead of Base64?',
        'How do you scale the read path to handle celebrity tweet spikes?'
      ]
    },
    steps: [
      { name: 'The Problem', description: 'URLs can be 500+ characters. Social media has limits. QR codes break. Analytics are impossible. Enter URL shortening.' },
      { name: 'Client Request', description: "POST /shorten { url: 'https://very-long-url...' } The journey begins." },
      { name: 'Load Balancer', description: 'Bitly handles 6 billion clicks/month. One server cannot do this. Load balancer distributes requests across a fleet — round-robin, least connections, or IP hash.' },
      { name: 'Application Server', description: 'First question: have we seen this URL before? Checking cache before doing any expensive work. Cache hit = skip steps 5-7 entirely.' },
      { name: 'Cache Check (Redis)', description: 'Redis stores recent URL mappings in memory. O(1) lookup. If this URL was shortened recently by anyone — instant return. Cache miss here, continuing to hashing.' },
      { name: 'Hashing', description: 'MD5(longURL) → 128-bit hash. Base62 encode → [a-z][A-Z][0-9]. First 7 characters → 62^7 = 3.5 trillion combinations. Collision? Append +1 and rehash. Simple.' },
      { name: 'Collision Check', description: 'Probability of collision with 7 chars: tiny. But at billions of URLs — it happens. Simple fix: detect and rehash. Deterministic.' },
      { name: 'Database Write', description: 'Primary-replica replication. Write to primary. Reads distributed across replicas. Short URLs are write-once, read-many — replicas handle the read tsunami.' },
      { name: 'Cache Write', description: 'After writing to DB, populate cache immediately. Next person who shortens this same URL gets cache hit at Step 5. TTL prevents stale entries.' },
      { name: 'Response', description: '50ms end to end. The user has no idea about hashing, Base62, collision detection, or replication. That\'s the job.' },
      { name: 'Redirect Flow', description: 'Read path is the hot path. Billions of clicks. Cache hit rate target: 99%+. Redis makes this ~5ms. Without cache: database query every click = database on fire.' },
      { name: 'Scale Numbers', description: 'The celebrity problem: one tweet = 10M clicks in 60 seconds. Solution: CDN caches redirects at edge nodes globally. Database never sees it.' }
    ],
    animationComponent: 'TinyURLAnim'
  },
  {
    id: 'netflix-cdn',
    slug: 'netflix-cdn',
    name: 'Netflix Video Streaming',
    category: 'content-delivery',
    color: '#f59e0b',
    tagline: 'You press play on Stranger Things. In 2 seconds, HD video starts. 200 million people do this simultaneously. How does Netflix not collapse?',
    difficulty: 'Intermediate',
    tags: ['CDN', 'Microservices', 'Adaptive Bitrate', 'Chaos Engineering'],
    readTime: '20 min',
    famousFor: 'Pushing content directly into ISP networks and inventing Chaos Engineering.',
    prerequisites: [
      { name: 'Monolith vs Microservices', slug: 'microservices' },
      { name: 'API Gateway', slug: 'api-gateway' }
    ],
    companies: ['Netflix', 'YouTube', 'Disney+'],
    interviewAngle: {
      mistake: 'Assuming you just throw AWS CloudFront at it and call it a day.',
      bottleneck: 'The internet backbone cannot physically handle petabytes of simultaneous 4K streams.',
      questions: [
        'How do you reduce latency when the speed of light is the bottleneck?',
        'How do you handle the "thundering herd" problem at 8 PM on a Friday?',
        'How do you choose which movies to cache in a specific geographic edge node?'
      ]
    },
    steps: [
      { name: 'The Scale Problem', description: 'No single data center can serve the world. Physics is the enemy — light takes 150ms to cross the Atlantic. Video requires 25MB/s minimum for HD. The solution isn\'t faster servers. It\'s shorter distances.' },
      { name: 'Client Request & Auth', description: 'Authentication lives in AWS. Your identity, your subscription tier, your watch history — all in the cloud. But the video? That\'s different.' },
      { name: 'Microservices Routing', description: 'Netflix runs 700+ microservices. Each owned by a small team. Streaming, billing, recommendations, search — all independent. If recommendations goes down, you can still watch. Fault isolation.' },
      { name: 'Adaptive Bitrate Decision', description: 'Your video is pre-encoded at 6+ quality levels. Client measures bandwidth every few seconds. Starts low, climbs to best quality your connection supports. The buffer never empties. Magic? No — DASH/HLS adaptive streaming.' },
      { name: 'Open Connect CDN Decision', description: 'Netflix built its own CDN. Not AWS CloudFront — their own servers, physically inside ISPs worldwide. Why? Cheaper egress costs, lower latency, better relationships with ISPs. Open Connect serves 95% of Netflix traffic.' },
      { name: 'Content Pre-positioning', description: 'Netflix doesn\'t wait for you to request popular content. At night, they push it to OCA nodes near you. When you press play — the video is already 2km away. Pre-positioning reduces origin server load by 95%.' },
      { name: 'Video Chunk Request', description: 'Video delivered in 4-second chunks. First chunk arrives in <100ms from local OCA. Player buffers 30-60 seconds ahead. You see 2 seconds of loading. The 58 seconds of buffer behind that — invisible.' },
      { name: 'Cache Miss Path', description: 'Cache miss hierarchy. Local → Regional → Origin. Long-tail content probably not pre-positioned. Falls through to S3. CDN hit rate target: 95%+ for popular content.' },
      { name: 'Adaptive Quality Switch', description: 'Buffer drain detected → quality drop → buffer recovers → quality rises. The algorithm runs every few seconds. You see a slight quality dip. You don\'t see buffering. That\'s the trade.' },
      { name: 'Chaos Engineering', description: 'Chaos Monkey — Netflix\'s tool that randomly kills production servers. By breaking things deliberately, teams build systems that survive accidents. If your system can\'t handle a killed server in testing, it will fail in production.' },
      { name: 'Global Redundancy', description: 'Active-active multi-region deployment. Netflix runs in multiple AWS regions simultaneously. Region failure = traffic reroutes. Users notice higher latency briefly. Nobody loses their movie.' },
      { name: 'Encoding Pipeline', description: 'One title = months of encoding work. Netflix encodes per-scene — action scenes get more bits, static scenes get fewer. Result: better quality at lower file size than fixed-bitrate competitors.' },
      { name: 'Personalization Intersection', description: 'The video delivery and the recommendation engine are separate microservices that never directly talk. Events flow through Kafka. The right thumbnail for you is calculated by a model that has nothing to do with video delivery.' },
      { name: 'Scale Numbers Reveal', description: 'The physics of scale. Every number here represents an engineering decision that took years to optimize. Start with monolith. Scale to this. The journey matters more than the destination.' },
      { name: 'What Would Break Without Each Piece', description: 'Architecture isn\'t about using cool technology. It\'s about knowing what breaks without each piece. Remove CDN: buffering. Remove adaptive bitrate: exclusion of slow-connection users. Every component earns its place.' }
    ],
    animationComponent: 'NetflixCDNAnim'
  },
  {
    id: 'uber-backend',
    slug: 'uber-backend',
    name: 'Uber Backend',
    category: 'real-time',
    color: '#06b6d4',
    tagline: 'You open Uber. In seconds you see 12 nearby drivers moving on a map. You book one. He arrives in 4 minutes. What just happened in the backend?',
    difficulty: 'Intermediate',
    tags: ['Geohashing', 'WebSockets', 'A*', 'Event-Driven'],
    readTime: '20 min',
    famousFor: 'Managing 5M concurrent drivers globally with sub-second matching latency.',
    prerequisites: [
      { name: 'Sync vs Async', slug: 'sync-async' },
      { name: 'Event-Driven Architecture', slug: 'event-driven' }
    ],
    companies: ['Uber', 'Lyft', 'Grab'],
    interviewAngle: {
      mistake: 'Using a traditional relational database (SQL) for real-time location tracking and updating.',
      bottleneck: 'The sheer volume of GPS pings (75M writes per minute) requires specialized write-heavy stores.',
      questions: [
        'How do you quickly find all drivers within a 2km radius?',
        'How do you calculate ETA considering live traffic?',
        'Why decouple payment processing from the trip completion event?'
      ]
    },
    steps: [
      { name: 'The Real-Time Problem', description: "5 million GPS pings every 4 seconds. That's 75 million writes per minute. No traditional database survives this without specialized architecture." },
      { name: 'Driver Location Update', description: "Every driver's phone is a sensor. 4-second intervals balance battery life vs map freshness. Heading included for predictive positioning." },
      { name: 'Location Service (Write Path)', description: "Geohashing converts 2D coordinates to a 1D string. Nearby locations share prefixes. 'dr5ru' covers a ~5km² area. Stored in Redis — O(1) write, O(1) proximity lookup by prefix matching." },
      { name: 'Rider Opens App (Read Path)', description: "Rider's geohash → prefix match in Redis → list of nearby drivers in milliseconds. No scanning millions of rows. No SQL JOIN. Geohash prefix = efficient spatial index." },
      { name: 'Map Rendering', description: "WebSocket keeps connection open. Server pushes updates — client doesn't poll. Client-side interpolation makes movement smooth between 4-second updates. What looks real-time is partly clever animation." },
      { name: 'ETA Calculation', description: "ETA = graph shortest path + traffic model. Uber has historical speed data for every road segment, time of day, day of week. A* finds the path, traffic model adjusts the time. Parallel calculation for all nearby drivers." },
      { name: 'Matching Algorithm', description: "Matching isn't just nearest driver. It's global optimization across all current requests. The Hungarian Algorithm minimizes total wait time across all riders simultaneously. One rider getting a closer driver might mean three others wait longer." },
      { name: 'Surge Pricing', description: "Surge pricing is a supply-demand balancing mechanism, not just profit. Higher price attracts supply. Demand reduces slightly. Market clears. Crude but effective. The math is simple — the ethics debate is not." },
      { name: 'Trip State Machine', description: "The trip is a state machine. Each transition is an event. Event-driven architecture means payment, rating prompts, driver payout, analytics — all triggered by events, not by the trip service calling them directly." },
      { name: 'Real-Time Trip Tracking', description: "During a trip, the same location pipeline serves both the map and the ETA countdown. Route service continuously recalculates arrival time as driver deviates or traffic changes. All through the same WebSocket." },
      { name: 'Payment', description: "Payment is deliberately async from the trip. The trip completes — payment processes in the background. Failed payment? Retry logic. The rider is already home before payment fully processes. UX beats payment latency." },
      { name: 'Fraud Detection', description: "Every transaction scored by ML in real-time. <50ms decision. Features: historical patterns, device data, location consistency, amount. False positive = angry rider. False negative = fraud loss. Threshold tuning is a business decision as much as a technical one." },
      { name: 'Scale Numbers', description: "Every number here is a constraint that shaped an architectural decision. 75M location updates/min → Redis not SQL. Sub-100ms matching → in-memory geohash not database query. Scale makes the obvious choice wrong." }
    ],
    animationComponent: 'UberBackendAnim'
  },
  {
    id: 'whatsapp-realtime',
    slug: 'whatsapp-realtime',
    name: 'WhatsApp Messaging',
    category: 'real-time',
    color: '#10b981',
    tagline: "You send a message to a friend. They're offline. They come back online 3 hours later. The message delivers. Two blue ticks appear. How?",
    difficulty: 'Intermediate',
    tags: ['WebSockets', 'Erlang', 'Cassandra', 'E2E Encryption'],
    readTime: '15 min',
    famousFor: 'Handling millions of concurrent connections on a single server with 50 engineers.',
    prerequisites: [
      { name: 'Sync vs Async', slug: 'sync-async' },
      { name: 'Event-Driven Architecture', slug: 'event-driven' }
    ],
    companies: ['WhatsApp', 'Discord', 'Slack'],
    interviewAngle: {
      mistake: 'Using HTTP polling or a standard REST API for chat.',
      bottleneck: 'Connection overhead. Managing millions of open TCP connections requires a language/architecture built for extreme concurrency.',
      questions: [
        'How do you know if a user is online or offline?',
        'How do you route a message to the specific server holding the recipient\'s WebSocket connection?',
        'What happens to messages if the recipient\'s phone is turned off?'
      ]
    },
    steps: [
      { name: 'The Concurrency Problem', description: "Traditional servers: one thread per connection. 2M connections = 2M threads = 32GB RAM just for thread stacks. WhatsApp runs on Erlang — 2M lightweight processes, ~300 bytes each. The right language made billion-scale possible with surprisingly few servers." },
      { name: 'Persistent Connection', description: "WhatsApp maintains persistent connections. Not HTTP request-response — a kept-open socket. Heartbeats detect dead connections. Your phone is always listening, even in background. Battery optimization fights this. WhatsApp wins." },
      { name: 'Message Send', description: "Single grey tick = server received your message. The message_id is generated client-side — idempotent. If connection drops mid-send, client retries with same ID. Server deduplicates. No duplicate messages." },
      { name: 'Message Storage', description: "Messages only stored if recipient is offline. WhatsApp is not designed to be a message archive — it's a delivery system. Cassandra chosen for write-heavy workload, horizontal scalability, and partition-by-recipient for fast delivery when user comes online." },
      { name: 'Offline Delivery', description: "Cassandra is the waiting room. When you come online, server dumps your queued messages. ACK received → messages deleted from store. The store is ephemeral, not permanent. End-to-end encryption means server stores ciphertext it cannot read." },
      { name: 'End-to-End Encryption', description: "The server is a blind courier. Keys never leave your device. WhatsApp cannot read your messages. The government cannot compel WhatsApp to decrypt them — WhatsApp doesn't have the keys. This is the architecture of privacy." },
      { name: 'Delivery Receipt (Second Tick)', description: "Second grey tick = delivered to device. The ACK is a message itself — travels through the same pipeline in reverse. If recipient's phone is off, you wait for grey tick 2 until they reconnect. Tick 2 = device received, not human read." },
      { name: 'Read Receipt (Blue Ticks)', description: "Blue ticks = human eyes on message. Read receipts are optional by WhatsApp design — respecting privacy over social pressure. But if you disable them, you also cannot see others' read receipts. Symmetric policy." },
      { name: 'Group Messages', description: "Group messages are fan-out at server level. 1 send = N deliveries. WhatsApp groups capped at 1024 members — above that, fan-out cost becomes prohibitive. Read receipts in group show per-member status. The aggregation logic lives server-side." },
      { name: 'Media Handling', description: "Media is never in the message pipeline. Too large. Instead: upload to CDN, send URL. The decryption key travels with the URL in the message. Server has the ciphertext. Server does not have the key. End-to-end encryption maintained for media too." },
      { name: 'Presence (Online Status)', description: "Presence is expensive at scale. 2 billion users × average 200 contacts = 400 billion presence subscriptions potentially. WhatsApp limits: only mutual contacts, only when both are active. Presence information expires — no persistent long-polling." },
      { name: 'Scale Numbers', description: "50 engineers. 2 billion users. The most efficient engineering team in tech history. Erlang's concurrency model, Cassandra's write throughput, and disciplined architecture made this possible. More engineers often means more complexity, not more scale." }
    ],
    animationComponent: 'WhatsAppRealtimeAnim'
  },
  {
    id: 'twitter-feed',
    slug: 'twitter-feed',
    name: 'Twitter Feed (Fan-Out)',
    category: 'social-feed',
    color: '#8b5cf6',
    tagline: 'Elon Musk tweets. 100 million followers need to see it. In seconds. How does Twitter decide whether to push or pull?',
    difficulty: 'Advanced',
    tags: ['Fan-Out', 'Redis', 'Elasticsearch', 'Graph DB'],
    readTime: '20 min',
    famousFor: 'Pioneering the hybrid push/pull model for asymmetric follower graphs.',
    prerequisites: [
      { name: 'Caching', slug: 'caching' },
      { name: 'Event-Driven Architecture', slug: 'event-driven' }
    ],
    companies: ['Twitter', 'Instagram', 'Facebook'],
    interviewAngle: {
      mistake: 'Using a pure push (fan-out on write) model for all users regardless of follower count.',
      bottleneck: 'Celebrity accounts causing millions of writes in milliseconds, crashing the cache servers.',
      questions: [
        'How do you handle a user with 100 million followers?',
        'How do you merge pre-computed timelines with celebrity tweets at read time?',
        'How are trending topics calculated in real-time?'
      ]
    },
    steps: [
      { name: 'The Fan-Out Problem', description: "Fan-out on write: pre-compute everyone's timeline. Works for normal users. Breaks for celebrities. This is the most famous system design problem — because the obvious solution doesn't scale, and the scaled solution introduces complexity." },
      { name: 'The Pull Model (Naive)', description: "Pull on read: compute timeline at request time. Fresh data. But: 500 follows = 500 queries or one massive JOIN. At 200M users opening Twitter daily = 100 billion queries. The database does not survive this." },
      { name: 'The Push Model (Timeline Cache)', description: "Pre-compute on write, serve from cache on read. Tweet once → write to N follower caches. Read = Redis list lookup. 10ms regardless of follow count. Works perfectly until N = 100M." },
      { name: 'The Hybrid Model', description: "Twitter's actual solution: hybrid. Normal users: fan-out on write. Celebrities: fan-out on read. At read time, merge timeline cache with followed celebrity tweets. Complexity hidden from the user." },
      { name: 'Tweet Storage', description: "One tweet = four separate writes. MySQL for the canonical tweet data. S3/CDN for media. Elasticsearch for search. Redis for timelines. Each service owns its store. Consistency is eventual across all four." },
      { name: 'Timeline Assembly', description: "The timeline you see is assembled from three different sources at read time. Tweet_ids from cache are hydrated (full content fetched). Celebrities' tweets fetched on demand. Ads injected. Sorted by time. Paginated. All in <100ms." },
      { name: 'Real-Time Delivery', description: "The feed updates without you refreshing. Server-Sent Events or WebSocket maintains open connection. When your timeline cache is updated, the server pushes a notification. Client fetches new tweets. Real-time feel without polling every second." },
      { name: 'Trending Topics', description: "Trending = velocity, not volume. A hashtag trending isn't the most-used hashtag. It's the fastest-growing in the last hour. Sliding window counters in Redis. Geo-segmented. What's trending in Toronto differs from Tokyo." },
      { name: 'Search', description: "Twitter search indexes billions of tweets. Elasticsearch handles full-text. Relevance isn't just keyword match — your social graph influences what's relevant. Tweets from people you follow rank higher. The search index is the social graph + text." },
      { name: 'Follow Graph Storage', description: "The social graph is the core data structure of any social network. Twitter built FlockDB — a distributed graph database optimized for follower/following queries. The graph has hundreds of billions of edges." },
      { name: 'Scale Numbers', description: "The fan-out problem is a metaphor for all of system design: the solution that works at 1,000 users breaks at 1,000,000. The threshold between push and pull models is an engineering judgment call, not a mathematical certainty. Choose, measure, adjust." }
    ],
    animationComponent: 'TwitterFeedAnim'
  },
  {
    id: 'google-maps',
    slug: 'google-maps',
    name: 'Google Maps',
    category: 'maps-location',
    color: '#eab308',
    tagline: 'You search "coffee near me". In 200ms you see 20 shops. You ask for directions. How does Google find the shortest route through 10 million road segments?',
    difficulty: 'Advanced',
    tags: ['Spatial Indexing', 'Graph Algorithms', 'Dijkstra', 'Quadtrees'],
    readTime: '20 min',
    famousFor: 'Mapping the world and calculating dynamic routes globally in milliseconds.',
    prerequisites: [
      { name: 'Sync vs Async', slug: 'sync-async' },
      { name: 'Caching', slug: 'caching' }
    ],
    companies: ['Google', 'Apple', 'Uber'],
    interviewAngle: {
      mistake: 'Using basic SQL queries with Haversine distance formulas to find nearby locations.',
      bottleneck: 'Calculating distances to every location is O(N). You need O(log N) spatial indexing.',
      questions: [
        'How do you represent a 2D map in a 1D database index?',
        'Why doesn\'t standard Dijkstra\'s algorithm work for global routing?',
        'How do you integrate live traffic into pathfinding?'
      ]
    },
    steps: [
      { name: 'The Proximity Problem', description: "Finding nearby locations by brute force means calculating distance to every location in the database. 1 million businesses = 1 million calculations. The solution: spatial indexing — never calculate what you can look up." },
      { name: 'Geohashing', description: "Geohashing converts 2D space to 1D string. Nearby places share prefixes. Prefix search in a database index is O(log n). You've turned a 2D proximity problem into a 1D range query. The elegance is in the dimensionality reduction." },
      { name: 'Quadtree', description: "Quadtree vs Geohash: quadtree adapts to density. Manhattan gets tiny cells (millions of businesses). Canadian wilderness gets huge cells (few businesses). Geohash cells are uniform regardless of density. Google Maps uses both — context determines choice." },
      { name: 'The Road Network Graph', description: "Google Maps has 10 million road segments globally. Edges weighted by travel time, not distance. Weights update in near-real-time from: Speed sensors, Mobile device GPS velocity, Historical patterns, Reported incidents. The graph is alive." },
      { name: 'Dijkstra at Scale Problem', description: "Pure Dijkstra on 10M road segments: too slow. It explores in every direction equally. A route from Toronto to Montreal explores nodes in Detroit, New York, everywhere within that radius. The solution: bidirectional search + hierarchical routing." },
      { name: 'Bidirectional Dijkstra', description: "Run Dijkstra from both ends simultaneously. Stop when frontiers meet. Explores ~25% of the nodes vs one-directional. 4x faster. Still not enough for real-time global routing. Enter: Contraction Hierarchies." },
      { name: 'Contraction Hierarchies', description: "Preprocessing creates a hierarchy. Local streets contracted away for long queries. Toronto → Montreal: only highways considered. Preprocessing takes hours. Queries take milliseconds. The trade: storage for speed. Google preprocesses the entire world's road network nightly." },
      { name: 'Real-Time Traffic Integration', description: "Google Maps' moat is data, not algorithms. The routing algorithm is known. The real-time traffic data from 1 billion Android devices is not reproducible. Waze acquisition added human-reported incidents. Data quality wins." },
      { name: 'ETA Calculation', description: "ETA is a prediction problem, not a math problem. Distance ÷ speed = naive ETA. ML model adds: historical patterns (Monday 8am is always slow here), weather effect, events (concert ending nearby). The model is always wrong. The question is by how little." },
      { name: 'Tile-Based Map Rendering', description: "The map is not one image. It's a grid of tiles. Pre-rendered, CDN-cached, zoom-level specific. Google pre-renders trillions of tiles. Your map load = CDN tile fetch, not real-time rendering. Panning prefetches adjacent tiles. You never see the seam." },
      { name: 'Place Search', description: "Place search combines text search + proximity. Elasticsearch handles text. Geohash handles proximity. Ranking is a learning-to-rank ML model: distance matters, but a 4.8-star place 200m away beats a 3.2-star place 50m away. Personalization layer adds your history." },
      { name: 'Scale Numbers', description: "Google Maps is simultaneously: a graph algorithm problem, a spatial indexing problem, a real-time data aggregation problem, a CDN tile serving problem, and a machine learning ranking problem. Each layer a decade of engineering. Each layer a case study on its own." }
    ],
    animationComponent: 'GoogleMapsAnim'
  },
  {
    id: 'dropbox-sync',
    slug: 'dropbox-sync',
    name: 'Dropbox / Google Drive File Sync',
    category: 'storage',
    color: '#10b981',
    tagline: 'You edit a 10 GB video file. A few seconds later, the changes appear on your phone. How does Dropbox sync only the changed parts without exploding?',
    difficulty: 'Intermediate',
    tags: ['Chunking', 'Deduplication', 'Conflict Resolution', 'Metadata'],
    readTime: '15 min',
    famousFor: 'Inventing delta sync and saving petabytes of bandwidth using chunk deduplication.',
    prerequisites: [
      { name: 'Hashing', slug: 'hashing' },
      { name: 'Sync vs Async', slug: 'sync-async' }
    ],
    companies: ['Dropbox', 'Google Drive', 'OneDrive'],
    interviewAngle: {
      mistake: 'Re-uploading the entire 10 GB file when only 1 byte changes.',
      bottleneck: 'Network bandwidth is the primary constraint. You must minimize data transfer at all costs.',
      questions: [
        'How do you avoid uploading the same file twice if two different users upload it?',
        'How do you handle a scenario where a user renames a 100 GB folder?',
        'How do you resolve concurrent edits to the same file?'
      ]
    },
    steps: [
      { name: 'The Sync Problem', description: "Naïve sync transfers the entire file after every change. For a 10 GB video, that’s 10 GB upload for a one-line edit. Unacceptable on mobile or slow connections. The solution? Break files into chunks – only sync what changed." },
      { name: 'File Chunking', description: "4 MB chunks. Hash each chunk. Upload only changed chunks. Edit the last paragraph of a 10 GB file? Only one 4 MB chunk changes – 4 MB uploaded, not 10 GB. This is delta sync. It works because modern files are mostly unchanged." },
      { name: 'Deduplication', description: "Deduplication – store every chunk only once. When 1 million users save the same cat photo, the cloud holds one copy and 1 million references. Hashes make this safe: collision-resistant SHA-256 ensures different content never shares a hash." },
      { name: 'Metadata Service', description: "The metadata service is a highly available database (often Paxos/Raft replicated). It stores: which chunks make up a file, timestamps, versions, and sharing ACLs. File renames or moves are pure metadata operations – O(1) database writes, not O(file size)." },
      { name: 'Upload Flow', description: "Upload is a two-phase commit. Phase 1: client sends list of hashes it has. Server replies with which chunks it needs (dedup already covers existing chunks). Phase 2: client uploads missing chunks. Phase 3 (commit): server atomically updates the file’s chunk list. Atomicity prevents partial updates." },
      { name: 'Sync Client Logic', description: "Local client: OS-level file watcher (inotify on Linux, ReadDirectoryChangesW on Windows). Changes are debounced – waiting for idle periods to avoid uploading during active writing. Push notifications via WebSocket or long polling notify other devices within seconds." },
      { name: 'Conflict Resolution', description: "Conflict happens when two clients modify the same file before seeing each other’s changes. Dropbox’s strategy: last writer wins for the chunk? No – they use a CRDT-like approach for text files, but for binaries they create a conflict copy. Google Drive tries auto-merge for Docs; for binary files, it preserves both versions. The rule: never lose data." },
      { name: 'CDN Download', description: "Uploads go to the origin; downloads are served from CDNs (CloudFront, Akamai). Popular files are cached at edges – 10,000 users downloading the same meeting recording get it from their local PoP. Cold files hit the origin, but large files are chunk-streamed over HTTP/2 or QUIC." },
      { name: 'Sharing & Permissions', description: "Sharing is metadata only: a link is a permission grant stored in the metadata service. No extra physical copy. Permissions are checked on every download. Revocation is immediate because tokens are validated in real time against an ACL cache (e.g., Redis)." },
      { name: 'Versioning', description: "Versioning is free because chunks are immutable. A new version = a new list of chunk pointers. Old chunk lists stay in the metadata store. Garbage collection runs periodically, deleting chunks that no version references. Deleted file versions remain for 30–180 days (recycle bin)." },
      { name: 'Scale Numbers', description: "File sync is a distributed systems masterpiece: chunking + dedup + metadata sharding + CDNs + conflict resolution. Each piece is simple; together they serve billions of files daily. The hardest part? Not the algorithm – it’s maintaining consistency across millions of devices while the network is flaky." }
    ],
    animationComponent: 'DropboxSyncAnim'
  },
  {
    id: 'redis-cache',
    slug: 'redis-cache',
    name: 'Redis Distributed Cache',
    category: 'infrastructure',
    color: '#ef4444',
    tagline: 'Your database handles 10k QPS – but your homepage needs 100k QPS during a flash sale. How does Redis serve cached data in under a millisecond without melting?',
    difficulty: 'Intermediate',
    tags: ['Caching', 'Cache Stampede', 'Eviction', 'Clustering'],
    readTime: '20 min',
    famousFor: 'Being the world\'s fastest in-memory data store and the backbone of microsecond architectures.',
    prerequisites: [
      { name: 'Caching', slug: 'caching' },
      { name: 'Database Replication', slug: 'database-replication' }
    ],
    companies: ['Twitter', 'GitHub', 'Snapchat'],
    interviewAngle: {
      mistake: 'Thinking Redis is just a key-value store like Memcached.',
      bottleneck: 'The Database hitting 100% CPU on read-heavy workloads.',
      questions: [
        'How do you prevent a Cache Stampede (Thundering Herd)?',
        'What is the difference between Cache-Aside and Write-Through?',
        'How does Redis cluster partition data without a central proxy?'
      ]
    },
    steps: [
      { name: 'The Cache Problem', description: "Caching keeps frequently accessed data in memory. 50 ms database query → 2 ms cache read. 25x faster. But caching introduces new problems: stale data, eviction policies, and stampedes. Redis is the weapon of choice because of its rich data structures and microsecond latency." },
      { name: 'Cache-Aside Pattern', description: "Cache-aside (lazy loading): application is responsible for reading and writing to cache. On miss, load from DB and store. On write, invalidate or update cache. Pros: only requested data is cached. Cons: cold start – first request always misses. Hit rate improves over time." },
      { name: 'Write-Through Pattern', description: "Write-through: every write goes to cache and DB together. Consistency is strong – no stale reads. But write latency increases (must wait for DB). Used when reads vastly outnumber writes and consistency is critical (e.g., user session data)." },
      { name: 'Write-Behind Pattern', description: "Write-behind (write-back): writes hit cache and are acknowledged immediately. DB updates happen asynchronously. Great for bursty writes – decouples fast cache from slow DB. Risk: if cache crashes before flush, data is lost. Use with append-only logs or Redis persistence." },
      { name: 'Cache Eviction Policies', description: "Redis eviction policies: LRU evicts least recently used – good for general purpose. LFU keeps frequently accessed items – better for skewed access patterns. TTL is per-key expiration (e.g., session timeout). Random or noeviction (returns error when full). Choose based on access pattern." },
      { name: 'Redis Data Structures', description: "Redis is not a simple key-value store. Strings (counters, JSON blobs), Lists (queues), Sets (unique tags), Sorted Sets (leaderboards, rate limiters), Hashes (objects), Bitmaps (analytics), HyperLogLog (approximate counts), Geospatial (nearby queries). Choose the right structure – it changes complexity from O(N) to O(1)." },
      { name: 'Cache Stampede Problem', description: "Cache stampede: a hot key expires, and thousands of threads try to recompute it at once. Database melts. Fixes: 1) Mutex – one thread recomputes, others wait. 2) Probabilistic early expiration – refresh the cache before TTL ends with a random probability. 3) Never expiring – actively update the cache in the background. Redis handles this well with SET NX for locking." },
      { name: 'Redis Cluster', description: "Redis Cluster shards data across up to 1,000 nodes. 16,384 hash slots assigned to nodes. Clients hash the key (CRC16(key) mod 16384) to find the right node. No central proxy – clients talk directly. High availability: each master has replicas. If master fails, replica is promoted in seconds." },
      { name: 'Replication & Persistence', description: "Persistence: RDB – compact, faster recovery, but can lose minutes of writes. AOF – durable (fsync every second), but larger logs. Both can be combined. Replication: master-replica async replication. Use at least two replicas for HA. Sentinel monitors and auto-fails over." },
      { name: 'Cache Warming Strategies', description: "Cache warming avoids cold-start latency spikes. Eager warm: load top-K items from production logs. On-demand: accept first-request misses. Preheat via background job that replays yesterday’s hot keys. For rolling restarts, use Redis replication to keep the new node warm before switching traffic." },
      { name: 'Scale Numbers', description: "Redis is the workhorse of modern infrastructure. At sub-millisecond latencies, it handles sessions, API rate limits, real-time leaderboards, and pub/sub. The magic is not just speed – it’s the combination of rich data structures, atomic operations, and battle-tested clustering. But remember: a cache is not a database – data loss is acceptable, consistency is relaxed, and stampedes will bite you if you’re not careful." }
    ],
    animationComponent: 'RedisCacheAnim'
  }
];
