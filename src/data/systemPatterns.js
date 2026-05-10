export const systemCategories = [
  { id: 'all', name: 'All Patterns', color: '#f3f4f6' },
  { id: 'Monolithic', name: 'Monolithic', color: '#f59e0b' },
  { id: 'Service-Based', name: 'Service-Based', color: '#06b6d4' },
  { id: 'Event-Driven', name: 'Event-Driven', color: '#10b981' },
  { id: 'Communication', name: 'Communication', color: '#f43f5e' }
];

export const systemPatterns = [
  // Monolithic
  {
    id: "monolith",
    slug: "monolith",
    name: "Monolithic Architecture",
    category: "Monolithic",
    tagline: "Single deployable unit containing all business logic.",
    color: "#f59e0b",
    bigIdea: "Everything in one place. Fast to build, slow to scale. Every successful startup starts here and most stay here longer than they admit.",
    intuition: "A massive factory where everything from raw materials to final packaging happens under one roof.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Single Codebase: All features and modules exist within the same repository.",
      "Single Deployment: The entire application is packaged and deployed as one unit.",
      "In-Memory Communication: Modules call each other directly via function calls, avoiding network latency.",
      "Shared Database: A single unified relational database holds all the application state."
    ],
    pros: [
      "Extremely simple to develop and debug initially.",
      "Zero network latency between internal components.",
      "Simple deployment pipeline (just deploy the one artifact).",
      "Easy to implement cross-cutting concerns like logging and security."
    ],
    cons: [
      "Codebase becomes difficult to navigate as the team scales.",
      "A bug in one module (e.g., memory leak) can crash the entire system.",
      "Must scale the entire application even if only one module is under heavy load.",
      "Tied to a single technology stack; hard to upgrade frameworks."
    ],
    code: `// Everything in one repo\nimport { auth, billing, inventory } from './core';\n\nconst app = new Express();\napp.use('/auth', auth);\napp.use('/billing', billing);\napp.use('/inventory', inventory);\napp.listen(8080);`
  },
  {
    id: "modular-monolith",
    slug: "modular-monolith",
    name: "Modular Monolith",
    category: "Monolithic",
    tagline: "Single deployment, strict internal boundaries.",
    color: "#f59e0b",
    bigIdea: "A monolith that respects itself. Single deployment, but internal boundaries that make future extraction possible. The architecture most teams should use before microservices.",
    intuition: "A factory under one roof, but with distinct, walled-off departments that only communicate through designated windows.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Domain Boundaries: Code is strictly separated by domain (e.g., Orders, Billing).",
      "Encapsulation: Modules expose public APIs and hide internal implementations.",
      "Independent Data Access: Modules manage their own tables and do not perform SQL joins across boundaries.",
      "Single Process: Still runs as a single operating system process to maintain deployment simplicity."
    ],
    pros: [
      "Prevents the 'Big Ball of Mud' codebase deterioration.",
      "Maintains the deployment simplicity of a traditional Monolith.",
      "Allows for easy extraction into microservices later if scaling demands it.",
      "Allows different teams to work on different modules with less conflict."
    ],
    cons: [
      "Requires strong discipline to maintain boundaries; easy to accidentally couple code.",
      "Still requires scaling the entire application together.",
      "Language and framework lock-in across all modules."
    ],
    code: `// Strict boundaries enforced by tooling/interfaces\nimport { OrderService } from '@modules/orders';\nimport { BillingService } from '@modules/billing';\n\n// No direct DB access across modules allowed\nOrderService.createOrder(userId);`
  },

  // Service-Based
  {
    id: "soa",
    slug: "soa",
    name: "SOA (Service Oriented)",
    category: "Service-Based",
    tagline: "Services communicating via an Enterprise Service Bus.",
    color: "#06b6d4",
    bigIdea: "The 2000s answer to monolith problems. Services exist but all talk through one central bus. The bus becomes the new monolith. A lesson in where bottlenecks move, not disappear.",
    intuition: "A city where all roads must go through a central toll booth. Very organized, but terrible traffic jams.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Coarse-Grained Services: Services represent large business capabilities.",
      "Enterprise Service Bus (ESB): All communication routes through a massive, highly-intelligent central hub.",
      "Protocol Translation: The ESB translates messages (e.g., SOAP to REST, XML to JSON).",
      "Shared Data: Often relies on a massive shared central database."
    ],
    pros: [
      "Integrates wildly different legacy systems together.",
      "Centralized governance, monitoring, and security routing.",
      "Allows for reuse of enterprise-wide business capabilities."
    ],
    cons: [
      "The ESB becomes a massive single point of failure and bottleneck.",
      "Requires expensive proprietary middleware.",
      "Overly complex XML/SOAP specifications lead to slow development."
    ],
    code: `// SOAP/XML over an ESB (Conceptual)\n<soapenv:Envelope>\n  <soapenv:Body>\n    <ord:ProcessOrder>\n      <ord:orderId>12345</ord:orderId>\n    </ord:ProcessOrder>\n  </soapenv:Body>\n</soapenv:Envelope>`
  },
  {
    id: "microservices",
    slug: "microservices",
    name: "Microservices",
    category: "Service-Based",
    tagline: "Small, independent, loosely coupled services.",
    color: "#06b6d4",
    bigIdea: "End-to-end ownership. Each service owns its data, its deployment, its scaling. The organizational pattern as much as the technical one. Conway's Law made visible.",
    intuition: "A city of specialized independent shops. The baker only bakes, the butcher only cuts meat. If the baker burns down, you can still buy meat.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Fine-Grained Services: Highly specialized services focused on one capability.",
      "Database per Service: Services do NOT share databases. They own their data entirely.",
      "Dumb Pipes, Smart Endpoints: Communication is over simple protocols (HTTP REST, gRPC) without intelligent middleware.",
      "Independent Deployment: Updating Service A should not require touching Service B."
    ],
    pros: [
      "Independent scaling: Only scale the services experiencing high traffic.",
      "Technology Diversity: Write the ML service in Python and the Web service in Go.",
      "Fault Isolation: If the recommendation engine crashes, users can still check out.",
      "Faster iterations for small, autonomous teams."
    ],
    cons: [
      "Massive operational complexity (Kubernetes, CI/CD, tracing).",
      "Network latency and unreliable communication over the wire.",
      "Data consistency is extremely hard without distributed transactions."
    ],
    code: `// HTTP REST between independent services\nasync function checkout() {\n  const user = await fetch('http://user-service:8080/users/1');\n  const inventory = await fetch('http://inventory-service:8081/check');\n  // Network logic required\n}`
  },
  {
    id: "strangler-fig",
    slug: "strangler-fig",
    name: "Strangler Fig Pattern",
    category: "Service-Based",
    tagline: "Incremental migration from monolith to microservices.",
    color: "#06b6d4",
    bigIdea: "You don't rewrite the monolith. You strangle it. Route traffic incrementally to new services until the old system can be quietly decommissioned. The only safe way to migrate.",
    intuition: "Building a new house around the old house, moving into the new rooms one by one, then demolishing the old house.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Incremental Migration: Avoid 'big bang' rewrites which historically fail.",
      "Traffic Routing: Use an API Gateway to route specific requests to the new system, defaulting back to the legacy system.",
      "Coexistence: Both the old monolith and new microservices run simultaneously in production.",
      "Decommissioning: Once all functionality is routed to the new system, the monolith is killed."
    ],
    pros: [
      "Massively reduces the risk of system rewrites.",
      "Delivers continuous business value during the migration.",
      "Easy to rollback a specific feature if the new microservice fails."
    ],
    cons: [
      "Requires maintaining two entirely separate systems during the migration phase.",
      "Complex data synchronization if both systems need to read/write the same entities.",
      "The migration phase can take years for large enterprise applications."
    ],
    code: `// API Gateway Routing Logic\napp.use((req, res, next) => {\n  if (req.path.startsWith('/new-feature')) {\n    proxy.web(req, res, { target: 'http://new-microservice' });\n  } else {\n    proxy.web(req, res, { target: 'http://legacy-monolith' });\n  }\n});`
  },
  {
    id: "bff",
    slug: "bff",
    name: "Backend for Frontend",
    category: "Service-Based",
    tagline: "Dedicated API gateways for specific clients.",
    color: "#06b6d4",
    bigIdea: "One API cannot serve all masters. The BFF tailors the response for each client type. Netflix runs one per client platform. Your mobile app shouldn't suffer because your desktop app wants more data.",
    intuition: "Having a dedicated personal shopper for mobile and a different one for desktop. They know exactly what you want and only bring you that.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Client-Specific Logic: A mobile app requires a different data payload than a rich desktop web app.",
      "Aggregation: The BFF calls 5 different internal microservices and aggregates the response so the client only makes 1 network call.",
      "Ownership: The frontend team typically owns their specific BFF service."
    ],
    pros: [
      "Reduces network calls from the client over slow mobile networks.",
      "Prevents a single bloated 'God API' that tries to serve every platform.",
      "Allows frontend teams to iterate faster without waiting on backend API changes."
    ],
    cons: [
      "Code duplication across different BFFs (Mobile BFF vs Web BFF).",
      "Increases the number of services that must be deployed and monitored.",
      "Can accidentally become a monolithic bottleneck if not kept lean."
    ],
    code: `// Mobile BFF aggregation\napp.get('/mobile/dashboard', async (req, res) => {\n  // Fetch from internal microservices in parallel\n  const [user, preferences] = await Promise.all([\n    fetch('http://users/1'),\n    fetch('http://prefs/1')\n  ]);\n  // Return stripped down payload for mobile\n  res.json({ id: user.id, theme: preferences.theme });\n});`
  },

  // Event-Driven
  {
    id: "event-driven",
    slug: "event-driven",
    name: "Event-Driven Architecture",
    category: "Event-Driven",
    tagline: "Services react to state changes published to an event bus.",
    color: "#10b981",
    bigIdea: "Services that don't know each other exist. Publish an event, walk away. Whoever cares will handle it. The architecture that scales without coordination overhead.",
    intuition: "A radio broadcast. The station transmits the music (event). Anyone with a radio (consumer) can tune in and listen asynchronously.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Asynchronous: Publishers do not wait for consumers to process events.",
      "Decoupling: The publisher has no idea who (or how many) consumers are listening.",
      "Event Bus/Broker: A central infrastructure piece (like Kafka or RabbitMQ) handles message routing and retention.",
      "Fire and Forget: State changes are broadcasted as immutable facts."
    ],
    pros: [
      "Highly scalable and responsive to bursts of traffic.",
      "Incredibly loose coupling; you can add new consumers without touching the publisher code.",
      "Fault tolerant; if a consumer is down, the broker holds the message until it comes back online."
    ],
    cons: [
      "Extremely hard to trace logical flows (where did this request go?).",
      "Requires complex infrastructure like Kafka clusters.",
      "Eventual consistency: The system is not instantly updated everywhere at once."
    ],
    code: `// Producer\nawait kafka.produce({ topic: 'order.created', messages: [{ value: JSON.stringify({ orderId: 123 }) }] });\n\n// Consumer\nawait consumer.subscribe({ topic: 'order.created' });\nconsumer.run({\n  eachMessage: async ({ message }) => {\n    sendEmailConfirmation(message.value);\n  }\n});`
  },
  {
    id: "cqrs",
    slug: "cqrs",
    name: "CQRS",
    category: "Event-Driven",
    tagline: "Separate models for reading and writing data.",
    color: "#10b981",
    bigIdea: "Reads and writes are different problems. Stop solving them with the same model. Separate the write model (normalized, consistent) from the read model (denormalized, fast).",
    intuition: "A restaurant. The kitchen uses complex recipes and stations (Write DB). The waiter just hands you a simple printed menu (Read DB).",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Command/Query Segregation: 'Commands' alter state but return no data. 'Queries' return data but do not alter state.",
      "Different Databases: Write to a highly normalized relational DB, read from a highly denormalized NoSQL document store or Search Index.",
      "Eventual Synchronization: The write side publishes events that a background worker uses to update the read side."
    ],
    pros: [
      "Independent scaling of reads (usually 90% of traffic) and writes (10% of traffic).",
      "Optimized data schemas; reads require zero JOIN operations.",
      "Security is easier; the read side has zero logic to alter data."
    ],
    cons: [
      "Huge increase in architectural complexity.",
      "Eventual consistency implies users might write data, refresh the page, and not see their update immediately.",
      "Keeping the read DB perfectly synchronized with the write DB is notoriously difficult."
    ],
    code: `// Write Side (Command)\nfunction handleCreateOrder(cmd) {\n  const order = new Order(cmd);\n  sqlDb.save(order);\n  eventBus.publish('OrderCreated', order);\n}\n\n// Read Side (Query)\nfunction getOrdersByCustomer(customerId) {\n  // Blazing fast read from a flattened NoSQL projection\n  return mongoDb.collection('ordersView').find({ customerId });\n}`
  },
  {
    id: "saga",
    slug: "saga",
    name: "Saga Pattern",
    category: "Event-Driven",
    tagline: "Distributed transactions via local steps and compensating rollbacks.",
    color: "#10b981",
    bigIdea: "ACID transactions don't exist across services. Saga is the honest alternative — a sequence of local transactions with compensating rollbacks for failures.",
    intuition: "Booking a vacation. You book the flight, then hotel. If the hotel is full, you can't magically undo the flight—you have to explicitly issue a 'cancel flight' command.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Local Transactions: Every step in the business process is a local database transaction.",
      "Compensating Actions: If step 3 fails, the system must trigger specific logic to explicitly undo the effects of step 2 and step 1.",
      "Choreography vs Orchestration: Sagas can be driven by events (Choreography) or managed by a central controller (Orchestration)."
    ],
    pros: [
      "The only viable way to maintain data consistency across independent microservices.",
      "Avoids the massive performance bottleneck of distributed locks (Two-Phase Commit)."
    ],
    cons: [
      "Extremely difficult to implement correctly.",
      "You must write code for every single failure scenario and rollback state.",
      "Lack of Isolation: During a long-running Saga, other services might read partially completed data."
    ],
    code: `// Orchestration Saga Example\nasync function checkoutSaga(order) {\n  try {\n    await paymentService.charge(order);\n    try {\n      await inventoryService.reserve(order);\n    } catch (e) {\n      // Compensating action for inventory failure\n      await paymentService.refund(order);\n      throw new Error("Inventory failed, payment refunded.");\n    }\n  } catch (err) {\n    markOrderFailed(order);\n  }\n}`
  },
  {
    id: "circuit-breaker",
    slug: "circuit-breaker",
    name: "Circuit Breaker",
    category: "Event-Driven",
    tagline: "Fails fast when a downstream service is unresponsive.",
    color: "#10b981",
    bigIdea: "Stop hammering a failing service. When failures hit threshold, open the circuit — fail fast, recover gracefully. Every resilient distributed system needs this.",
    intuition: "A literal electrical circuit breaker. If a power surge happens, it snaps open to protect the house from burning down. It stays open until it's safe.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Closed State: Normal operation. Requests flow freely.",
      "Open State: The downstream service is failing. The breaker trips, instantly rejecting all requests to prevent cascading failures.",
      "Half-Open State: After a timeout, allows a tiny trickle of requests through to test if the downstream service has recovered.",
      "Fallbacks: When open, the system provides a graceful degradation response (e.g., returning cached data)."
    ],
    pros: [
      "Prevents catastrophic cascading failures across microservices.",
      "Gives failing services time to recover without being hammered by retries.",
      "Improves user experience by failing fast rather than hanging on loading screens."
    ],
    cons: [
      "Requires tuning thresholds correctly (too sensitive = false alarms, too loose = system crash).",
      "Adds operational overhead to monitor the state of all breakers."
    ],
    code: `// Circuit Breaker logic\nif (breaker.state === 'OPEN') {\n  return getCachedFallbackData();\n}\n\ntry {\n  const response = await makeExternalCall();\n  breaker.recordSuccess();\n  return response;\n} catch (err) {\n  breaker.recordFailure();\n  throw err;\n}`
  },

  // Communication
  {
    id: "sync-async",
    slug: "sync-async",
    name: "Sync vs Async",
    category: "Communication",
    tagline: "Direct waiting vs message queuing.",
    color: "#f43f5e",
    bigIdea: "Sync is a phone call — you wait. Async is an email — you continue. The choice determines whether your services share each other's bad days.",
    intuition: "Calling someone on the phone (sync) vs sending a text message (async).",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Synchronous (HTTP/gRPC): The caller blocks its thread and waits for a response. Highly coupled in time.",
      "Asynchronous (Queues): The caller places a message on a queue and immediately returns. The worker processes it whenever it has capacity."
    ],
    pros: [
      "Sync is easy to reason about and code.",
      "Async absorbs massive traffic spikes (load leveling).",
      "Async isolates the caller from the worker's performance or downtime."
    ],
    cons: [
      "Sync systems cascade failures; if the DB is slow, the entire HTTP thread pool locks up.",
      "Async systems cannot return immediate answers to the user (requires polling or websockets)."
    ],
    code: `// Synchronous\nconst result = await fetch('/api/process-video');\nreturn result;\n\n// Asynchronous\nawait messageQueue.push({ task: 'process-video', id: 123 });\nreturn { status: 'processing', checkBackUrl: '/status/123' };`
  },
  {
    id: "api-gateway",
    slug: "api-gateway",
    name: "API Gateway",
    category: "Communication",
    tagline: "Single entry point for all clients.",
    color: "#f43f5e",
    bigIdea: "The single front door. Authentication, rate limiting, routing, SSL termination — all in one place. Every microservices system needs one.",
    intuition: "A bouncer at a club. They check your ID, count how many people are inside, and point you to the right floor.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Reverse Proxy: All external traffic hits the Gateway first, never the internal microservices directly.",
      "Cross-Cutting Concerns: Handles auth validation, IP rate limiting, and CORS globally.",
      "Dynamic Routing: Maps external URLs to internal cluster IP addresses."
    ],
    pros: [
      "Hides internal microservice architecture from the public internet.",
      "Centralizes security policies in one place.",
      "Offloads heavy tasks like SSL termination away from application servers."
    ],
    cons: [
      "Becomes a potential single point of failure (must be highly available).",
      "Can add a slight network hop latency.",
      "Developers can mistakenly put business logic into the Gateway layer."
    ],
    code: `// Conceptual Gateway configuration\nexport default {\n  routes: [\n    { path: '/users/*', target: 'http://internal-user-svc:8080' },\n    { path: '/orders/*', target: 'http://internal-order-svc:8080' }\n  ],\n  plugins: ['jwt-auth', 'rate-limiter']\n};`
  },
  {
    id: "service-mesh",
    slug: "service-mesh",
    name: "Service Mesh",
    category: "Communication",
    tagline: "Infrastructure layer for service-to-service communication.",
    color: "#f43f5e",
    bigIdea: "Infrastructure concerns extracted from application code. Your service just makes a call — the sidecar handles encryption, retries, metrics, and discovery.",
    intuition: "Having a dedicated translator and bodyguard travel with you everywhere you go. You just speak naturally; they handle the rest.",
    math: { equation: "", costFunction: "", complexity: { time: "N/A", space: "N/A" } },
    principles: [
      "Sidecar Pattern: A network proxy container runs alongside every single application container in the pod.",
      "Control Plane vs Data Plane: The proxies (Data Plane) actually move the packets. A central manager (Control Plane) configures the proxies.",
      "Zero-Trust Security: Enforces mutual TLS (mTLS) automatically between all internal services."
    ],
    pros: [
      "Removes network retry, circuit breaker, and timeout logic from application code.",
      "Provides out-of-the-box distributed tracing and observability.",
      "Secures internal cluster communication effortlessly."
    ],
    cons: [
      "Adds immense operational complexity (e.g., managing Istio or Linkerd).",
      "Adds memory and CPU overhead (you run thousands of sidecar proxies).",
      "Adds a tiny amount of latency to every single network hop."
    ],
    code: `// Application Code has ZERO networking logic!\n// The Sidecar intercepts this standard HTTP call, \n// encrypts it with mTLS, checks routing rules, and executes retries.\nconst user = await fetch('http://users.local/profile');`
  }
];
