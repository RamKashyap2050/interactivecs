export const dsaCategories = [
  { id: 'all', name: 'All Data Structures', color: '#f3f4f6' },
  { id: 'Linear', name: 'Linear', color: '#f59e0b' },
  { id: 'Non-Linear', name: 'Non-Linear', color: '#8b5cf6' },
  { id: 'Sorting', name: 'Sorting', color: '#06b6d4' },
  { id: 'Searching', name: 'Searching', color: '#10b981' },
  { id: 'Graphs', name: 'Graphs', color: '#f43f5e' }
];

export const dataStructures = [
  // Linear
  {
    id: "array",
    slug: "array",
    name: "Arrays",
    category: "Linear",
    tagline: "Contiguous memory blocks for fast index-based access.",
    color: "#f59e0b",
    bigIdea: "Direct memory — index is address. O(1) access, O(n) insert. The tradeoff that launched a thousand data structures.",
    intuition: "Think of an array as a row of lockers. You know exactly where locker #5 is, but if you want to insert a new locker between #2 and #3, you have to move all the others.",
    math: {
      equation: "A[i] = BaseAddress + i \\times \\text{ElementSize}",
      costFunction: "",
      complexity: { time: "Access: O(1), Insert: O(n)", space: "O(n)" }
    },
    code: `const arr = new Array(5);\\narr[0] = 10;\\nconsole.log(arr[0]);`
  },
  {
    id: "stack",
    slug: "stack",
    name: "Stack",
    category: "Linear",
    tagline: "Last-In, First-Out (LIFO) data structure.",
    color: "#f59e0b",
    bigIdea: "Last In First Out. Your browser's back button, your undo history, every recursive call — all stacks in disguise.",
    intuition: "Think of a stack of plates. You can only add a plate to the top, and you can only remove a plate from the top.",
    math: {
      equation: "\\text{push}(x), \\text{pop}()",
      costFunction: "",
      complexity: { time: "Push/Pop: O(1)", space: "O(n)" }
    },
    code: `const stack = [];\\nstack.push(1);\\nstack.pop();`
  },
  {
    id: "queue",
    slug: "queue",
    name: "Queue",
    category: "Linear",
    tagline: "First-In, First-Out (FIFO) data structure.",
    color: "#f59e0b",
    bigIdea: "First In First Out. Print spoolers, load balancers, job queues — patience encoded in data.",
    intuition: "Think of a line at a grocery store. The first person in line is the first person served.",
    math: {
      equation: "\\text{enqueue}(x), \\text{dequeue}()",
      costFunction: "",
      complexity: { time: "Enqueue/Dequeue: O(1)", space: "O(n)" }
    },
    code: `const queue = [];\\nqueue.push(1); // Enqueue\\nqueue.shift(); // Dequeue`
  },
  {
    id: "linked-list",
    slug: "linked-list",
    name: "Linked List",
    category: "Linear",
    tagline: "A chain of nodes, each pointing to the next.",
    color: "#f59e0b",
    bigIdea: "Every Git commit is a linked list node. Every branch a pointer. You've been using linked lists every day without knowing it.",
    intuition: "Think of a scavenger hunt where each clue tells you where to find the next clue. You must follow the chain to get to the end.",
    math: {
      equation: "Node = \\{ value, next \\}",
      costFunction: "",
      complexity: { time: "Access: O(n), Insert/Delete: O(1) (given pointer)", space: "O(n)" }
    },
    code: `class Node {\\n  constructor(val) {\\n    this.val = val;\\n    this.next = null;\\n  }\\n}`
  },
  
  // Non-Linear
  {
    id: "binary-tree",
    slug: "binary-tree",
    name: "Binary Tree",
    category: "Non-Linear",
    tagline: "A tree where each node has at most two children.",
    color: "#8b5cf6",
    bigIdea: "No rules, just structure. Two children per node. The parent of all tree-based thinking.",
    intuition: "A hierarchy. Like a company org chart where every manager has exactly two direct reports.",
    math: {
      equation: "Node = \\{ value, left, right \\}",
      costFunction: "",
      complexity: { time: "Search: O(n)", space: "O(n)" }
    },
    code: `class TreeNode {\\n  constructor(val) {\\n    this.val = val;\\n    this.left = this.right = null;\\n  }\\n}`
  },
  {
    id: "bst",
    slug: "bst",
    name: "Binary Search Tree",
    category: "Non-Linear",
    tagline: "A sorted binary tree for efficient searching.",
    color: "#8b5cf6",
    bigIdea: "O(log n) search when balanced. O(n) when not. The difference between a librarian and a pile of books.",
    intuition: "Everything to the left is smaller, everything to the right is larger. It's a binary search built into a data structure.",
    math: {
      equation: "L < Node < R",
      costFunction: "",
      complexity: { time: "Search: O(log n) avg, O(n) worst", space: "O(n)" }
    },
    code: `// Insert logic\\nif (val < node.val) node.left = insert(node.left, val);\\nelse node.right = insert(node.right, val);`
  },
  {
    id: "avl-tree",
    slug: "avl-tree",
    name: "AVL Tree",
    category: "Non-Linear",
    tagline: "A self-balancing binary search tree.",
    color: "#8b5cf6",
    bigIdea: "Self-balancing. Every insert triggers a health check. The algorithm that refuses to become a linked list.",
    intuition: "Whenever a branch gets too heavy, the tree physically rotates nodes to balance the weight.",
    math: {
      equation: "|Height(L) - Height(R)| \\le 1",
      costFunction: "",
      complexity: { time: "Search/Insert/Delete: O(log n)", space: "O(n)" }
    },
    code: `// Rotation snippet\\nfunction rotateRight(y) {\\n  let x = y.left;\\n  y.left = x.right;\\n  x.right = y;\\n  return x;\\n}`
  },
  {
    id: "b-tree",
    slug: "b-tree",
    name: "B-Tree",
    category: "Non-Linear",
    tagline: "A self-balancing tree designed for disk storage.",
    color: "#8b5cf6",
    bigIdea: "The backbone of every database index. When data lives on disk, minimize I/O — B-Trees do exactly that.",
    intuition: "Instead of 2 children per node, nodes have many children (often hundreds), making the tree very wide and very shallow, requiring fewer disk reads.",
    math: {
      equation: "\\text{Keys per node} \\le M - 1",
      costFunction: "",
      complexity: { time: "Search/Insert: O(\\log_M n)", space: "O(n)" }
    },
    code: `// Conceptual\\nclass BTreeNode {\\n  keys = [];\\n  children = [];\\n}`
  },
  {
    id: "b-plus-tree",
    slug: "b-plus-tree",
    name: "B+ Tree",
    category: "Non-Linear",
    tagline: "A B-Tree where all data is stored in linked leaves.",
    color: "#8b5cf6",
    bigIdea: "B-Tree's smarter sibling. Internal nodes just point, leaf nodes store everything, linked for range scans. Every SQL index you've ever used was probably this.",
    intuition: "A massive directory (internal nodes) that guides you to a sorted filing cabinet (leaf nodes). Once at the filing cabinet, you can just flip to the next folder (linked list).",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "Search: O(\\log_M n), Range Query: O(\\log_M n + K)", space: "O(n)" }
    },
    code: `// Leaf node\\nclass BPlusLeaf {\\n  keys = []; values = [];\\n  nextLeaf = null;\\n}`
  },
  {
    id: "heap",
    slug: "heap",
    name: "Heap",
    category: "Non-Linear",
    tagline: "A complete binary tree that satisfies the heap property.",
    color: "#8b5cf6",
    bigIdea: "The Priority Queue's engine. Your OS task scheduler lives here. Every 'what should I run next?' question answered in O(log n).",
    intuition: "The largest (or smallest) element is always at the very top. When you remove it, the next one bubbles up to take its place.",
    math: {
      equation: "A[i] \\ge A[2i+1] \\text{ and } A[i] \\ge A[2i+2]",
      costFunction: "",
      complexity: { time: "Insert/Extract: O(log n), Peek: O(1)", space: "O(n)" }
    },
    code: `// Parent index\\nconst parent = i => Math.floor((i - 1) / 2);`
  },
  {
    id: "graph",
    slug: "graph",
    name: "Graph",
    category: "Non-Linear",
    tagline: "Nodes connected by edges representing relationships.",
    color: "#8b5cf6",
    bigIdea: "Maps, social networks, the internet itself. Vertices and edges — the two ingredients for modelling almost anything real.",
    intuition: "Cities are nodes, roads are edges. Or people are nodes, friendships are edges.",
    math: {
      equation: "G = (V, E)",
      costFunction: "",
      complexity: { time: "Depends on algorithm", space: "O(V + E)" }
    },
    code: `const adjList = new Map();\\nadjList.set('A', ['B', 'C']);`
  },

  // Sorting
  {
    id: "bubble-sort",
    slug: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    tagline: "Swaps adjacent elements if they are in the wrong order.",
    color: "#06b6d4",
    bigIdea: "The algorithm everyone learns first and uses last. O(n²) — 1 million entries at 1ms each = 31,000 years. Educational, humbling, never production.",
    intuition: "Heavy elements 'sink' to the bottom (right), while light elements 'bubble' to the top (left).",
    math: {
      equation: "A[j] > A[j+1] \\implies \\text{swap}(A[j], A[j+1])",
      costFunction: "",
      complexity: { time: "O(n^2)", space: "O(1)" }
    },
    code: `for(let i=0; i<n; i++)\\n  for(let j=0; j<n-i-1; j++)\\n    if(A[j] > A[j+1]) swap(A, j, j+1);`
  },
  {
    id: "selection-sort",
    slug: "selection-sort",
    name: "Selection Sort",
    category: "Sorting",
    tagline: "Finds the minimum element and places it at the beginning.",
    color: "#06b6d4",
    bigIdea: "Selects minimum, places it. Looks smarter than Bubble Sort, achieves the same O(n²). The difference is fewer swaps — which matters sometimes.",
    intuition: "Scan the unsorted part, find the absolute smallest card, and place it at the end of the sorted part.",
    math: {
      equation: "\\min(A[i \\dots n])",
      costFunction: "",
      complexity: { time: "O(n^2)", space: "O(1)" }
    },
    code: `for(let i=0; i<n; i++) {\\n  let minIdx = i;\\n  for(let j=i+1; j<n; j++)\\n    if(A[j] < A[minIdx]) minIdx = j;\\n  swap(A, i, minIdx);\\n}`
  },
  {
    id: "insertion-sort",
    slug: "insertion-sort",
    name: "Insertion Sort",
    category: "Sorting",
    tagline: "Builds the sorted array one element at a time.",
    color: "#06b6d4",
    bigIdea: "Select and insert vs select and find minimum. Fewer redundant comparisons. Python uses this for small subarrays inside TimSort.",
    intuition: "Like sorting playing cards in your hand. You pick up a card and slide it left until it finds its correct spot.",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "O(n^2) worst, O(n) best", space: "O(1)" }
    },
    code: `for(let i=1; i<n; i++) {\\n  let key = A[i];\\n  let j = i - 1;\\n  while(j >= 0 && A[j] > key) {\\n    A[j+1] = A[j];\\n    j--;\\n  }\\n  A[j+1] = key;\\n}`
  },
  {
    id: "merge-sort",
    slug: "merge-sort",
    name: "Merge Sort",
    category: "Sorting",
    tagline: "A divide and conquer algorithm.",
    color: "#06b6d4",
    bigIdea: "Divide. Conquer. Merge. Guaranteed O(n log n). The reliable workhorse — predictable, parallelizable, stable.",
    intuition: "Cut the deck in half until you have single cards. Then merge them back together in order. It's easier to merge two sorted decks than to sort one messy deck.",
    math: {
      equation: "T(n) = 2T(n/2) + O(n)",
      costFunction: "",
      complexity: { time: "O(n \\log n)", space: "O(n)" }
    },
    code: `function mergeSort(arr) {\\n  if (arr.length <= 1) return arr;\\n  const mid = Math.floor(arr.length / 2);\\n  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));\\n}`
  },
  {
    id: "quick-sort",
    slug: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    tagline: "Partitions an array around a pivot element.",
    color: "#06b6d4",
    bigIdea: "Average O(n log n), worst O(n²). Pivot selection is everything. The fastest sorting algorithm in practice — when your pivot isn't the minimum element.",
    intuition: "Pick a random person in the room (the pivot). Tell everyone shorter to go left, everyone taller to go right. Now sort the left and right groups.",
    math: {
      equation: "T(n) = T(k) + T(n-k-1) + O(n)",
      costFunction: "",
      complexity: { time: "O(n \\log n) avg, O(n^2) worst", space: "O(\\log n)" }
    },
    code: `// Partition logic\\nlet pivot = A[high], i = low - 1;\\nfor(let j=low; j<high; j++) {\\n  if(A[j] < pivot) swap(A, ++i, j);\\n}\\nswap(A, i+1, high);`
  },
  {
    id: "heap-sort",
    slug: "heap-sort",
    name: "Heap Sort",
    category: "Sorting",
    tagline: "Builds a heap and extracts the maximum repeatedly.",
    color: "#06b6d4",
    bigIdea: "Heapify once, extract forever. O(n log n) guaranteed, O(1) space. Slower constants than QuickSort in practice — but never has a bad day.",
    intuition: "Turn the array into a Max-Heap. The biggest item is now at the root. Swap it to the end of the array, shrink the heap size by 1, and repeat.",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "O(n \\log n)", space: "O(1)" }
    },
    code: `// Extract max and heapify\\nfor(let i=n-1; i>0; i--) {\\n  swap(A, 0, i);\\n  heapify(A, i, 0);\\n}`
  },
  {
    id: "radix-sort",
    slug: "radix-sort",
    name: "Radix Sort",
    category: "Sorting",
    tagline: "A non-comparative sorting algorithm.",
    color: "#06b6d4",
    bigIdea: "No comparisons — just counting. O(n·k) where k is digits. Phone numbers, zip codes, fixed-width IDs — Radix Sort's natural habitat.",
    intuition: "Sort by the ones digit. Then sort by the tens digit. Then sort by the hundreds. Like sorting mail into 10 buckets.",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "O(nk)", space: "O(n + k)" }
    },
    code: `// Iterate over digits\\nfor (let exp = 1; max / exp > 0; exp *= 10) {\\n  countingSort(arr, n, exp);\\n}`
  },
  {
    id: "tim-sort",
    slug: "tim-sort",
    name: "Tim Sort",
    category: "Sorting",
    tagline: "A hybrid sorting algorithm derived from merge sort and insertion sort.",
    color: "#06b6d4",
    bigIdea: "Java's Arrays.sort(). Python's .sort(). The algorithm that powers the real world. Hybrid of Insertion and Merge — best of both worlds.",
    intuition: "Real-world data is often partially sorted. TimSort finds these naturally sorted sequences (runs), uses insertion sort for small chunks, and merges them.",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "O(n \\log n)", space: "O(n)" }
    },
    code: `// Concept\\nruns = findRuns(arr);\\nruns.forEach(run => insertionSort(run));\\nmergeRuns(runs);`
  },

  // Searching
  {
    id: "linear-search",
    slug: "linear-search",
    name: "Linear Search",
    category: "Searching",
    tagline: "Check every element one by one.",
    color: "#10b981",
    bigIdea: "O(n). Simple. Works on unsorted data. When you have 10 items, this is fine. When you have 10 million, this is pain.",
    intuition: "Looking for a book in a disorganized pile? You have to check every single book until you find it.",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "O(n)", space: "O(1)" }
    },
    code: `for(let i=0; i<n; i++) {\\n  if(A[i] === target) return i;\\n}`
  },
  {
    id: "binary-search",
    slug: "binary-search",
    name: "Binary Search",
    category: "Searching",
    tagline: "Halves the search space at each step in a sorted array.",
    color: "#10b981",
    bigIdea: "O(log n). Array must be sorted. The algorithm behind every autocomplete, every database index range query, every 'is this in the set' check at scale.",
    intuition: "Looking for 'Smith' in a phonebook. Open to the middle. If 'M', you know 'Smith' is in the right half. Rip the phonebook in half and repeat.",
    math: {
      equation: "\\text{mid} = L + \\lfloor \\frac{R - L}{2} \\rfloor",
      costFunction: "",
      complexity: { time: "O(\\log n)", space: "O(1)" }
    },
    code: `while(left <= right) {\\n  let mid = Math.floor((left + right)/2);\\n  if(A[mid] === target) return mid;\\n  if(A[mid] < target) left = mid + 1;\\n  else right = mid - 1;\\n}`
  },
  {
    id: "bfs",
    slug: "bfs",
    name: "Breadth First Search",
    category: "Searching",
    tagline: "Explores all neighbors before moving deeper.",
    color: "#10b981",
    bigIdea: "Wide net. Every node at distance 1, then distance 2, then distance 3. Guaranteed shortest path on unweighted graphs. The organized search party.",
    intuition: "Like water rippling out from a stone thrown in a pond. It touches everything 1 unit away before touching anything 2 units away.",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "O(V + E)", space: "O(V)" }
    },
    code: `const queue = [start];\\nwhile(queue.length > 0) {\\n  const node = queue.shift();\\n  for(let neighbor of graph[node]) queue.push(neighbor);\\n}`
  },
  {
    id: "dfs",
    slug: "dfs",
    name: "Depth First Search",
    category: "Searching",
    tagline: "Explores as deep as possible along each branch before backtracking.",
    color: "#10b981",
    bigIdea: "Deep tunnel vision with a stack. Goes all the way down before going sideways. Backtracking built in. Maze solving, cycle detection, topological sort.",
    intuition: "Walking a maze by always hugging the left wall. If you hit a dead end, turn around and try the next path.",
    math: {
      equation: "",
      costFunction: "",
      complexity: { time: "O(V + E)", space: "O(V)" }
    },
    code: `function dfs(node) {\\n  visited.add(node);\\n  for(let neighbor of graph[node]) {\\n    if(!visited.has(neighbor)) dfs(neighbor);\\n  }\\n}`
  },

  // Graphs
  {
    id: "dijkstra",
    slug: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graphs",
    tagline: "Finds shortest paths in a weighted graph.",
    color: "#f43f5e",
    bigIdea: "BFS meets weights. Greedy assumption — always settle the closest unvisited node. Works perfectly until a negative weight appears. The algorithm behind GPS routing.",
    intuition: "At each city, look at all roads leading out. Pick the shortest total road distance. Repeat.",
    math: {
      equation: "d[v] = \\min(d[v], d[u] + w(u, v))",
      costFunction: "",
      complexity: { time: "O((V+E)\\log V)", space: "O(V)" }
    },
    code: `// Relaxation step\\nif(dist[u] + weight < dist[v]) {\\n  dist[v] = dist[u] + weight;\\n  pq.enqueue(v, dist[v]);\\n}`
  },
  {
    id: "a-star",
    slug: "a-star",
    name: "A* Algorithm",
    category: "Graphs",
    tagline: "Dijkstra guided by a heuristic.",
    color: "#f43f5e",
    bigIdea: "Dijkstra with a compass. The heuristic h(n) points toward the goal, cutting unnecessary exploration by 5x. Every game pathfinding engine, every maps routing system.",
    intuition: "Dijkstra explores equally in all directions. A* uses a hint (like straight-line distance to the target) to pull the search toward the destination.",
    math: {
      equation: "f(n) = g(n) + h(n)",
      costFunction: "",
      complexity: { time: "O(E)", space: "O(V)" }
    },
    code: `// f_score = distance_so_far + heuristic\\nfScore[neighbor] = tentative_gScore + heuristic(neighbor, goal);`
  },
  {
    id: "bellman-ford",
    slug: "bellman-ford",
    name: "Bellman-Ford",
    category: "Graphs",
    tagline: "Handles negative weights and detects negative cycles.",
    color: "#f43f5e",
    bigIdea: "The anxious algorithm. Checks V-1 times: 'are we sure we can't do better?' Slower than Dijkstra but honest about negative weights. Fintech, game theory.",
    intuition: "Relax every single edge in the entire graph. Do this V-1 times. If on the Vth time an edge can still be relaxed, there is a negative cycle.",
    math: {
      equation: "d[v] = \\min(d[v], d[u] + w(u, v)) \\text{ run } |V|-1 \\text{ times}",
      costFunction: "",
      complexity: { time: "O(VE)", space: "O(V)" }
    },
    code: `for(let i=0; i<V-1; i++) {\\n  for(let {u, v, w} of edges) {\\n    if(dist[u] + w < dist[v]) dist[v] = dist[u] + w;\\n  }\\n}`
  }
];
