export const sqlModuleData = {
  id: 'sql',
  title: 'SQL (Relational Databases)',
  color: '#f59e0b',
  chapters: [
    {
      id: 'tables-schema',
      title: 'Tables & Schema Design',
      animationComponent: 'TableBirthAnim',
      bookRef: null,
      steps: [
        { name: 'The Problem', description: 'Data without structure is noise. You can store anything. You can find nothing. The relational model solved this in 1970. Edgar Codd\'s paper changed computing forever.' },
        { name: 'Defining Columns', description: 'Columns are contracts. VARCHAR(100) means maximum 100 characters — enforced by the database, not your application. The schema is the first line of defense against bad data.' },
        { name: 'Primary Key', description: 'Primary Key: unique, not null, immutable. The row\'s identity for its entire life. Auto-increment is convenient. UUIDs are safer across distributed systems. The choice has consequences you\'ll feel at 10 million rows.' },
        { name: 'Row Insertion', description: 'One row = one entity. The table grows downward. The schema stays fixed. Every row obeys every column\'s contract. No exceptions.' },
        { name: 'Index Creation', description: 'An index is a sorted copy of a column, stored as a B-Tree. The table has your data. The index has your speed. Every index you create speeds up reads and slows down writes. Nothing is free.' }
      ]
    },
    {
      id: 'relationships',
      title: 'Relationships (1:1, 1:N, M:N)',
      animationComponent: 'RelationshipsAnim',
      bookRef: 'as explained in Chapter 4 of Introduction to AI & Data Science — the same E-commerce example, now animated',
      steps: [
        { name: 'One-to-One (1:1)', description: 'One user has exactly one profile. One profile belongs to exactly one user. The foreign key lives in profiles — it\'s the \'child\' table. users doesn\'t know profiles exist.' },
        { name: 'The Constraint', description: 'Foreign key constraint: referential integrity. The database physically prevents orphan records. You cannot have a profile for a user that doesn\'t exist. The constraint is your safety net.' },
        { name: 'Why Separate Tables?', description: 'Not every query needs profile data. Wide tables waste I/O — fetching 20 columns when you need 4. Separation means smaller rows, more rows per memory page, faster queries that don\'t need profile data.' },
        { name: 'One-to-Many (1:N)', description: 'One user → many posts. The \'many\' side holds the foreign key. Always. This is the fundamental rule of 1:N. The child (posts) references the parent (users). The parent doesn\'t store child IDs.' },
        { name: 'Querying the Relationship', description: 'The JOIN reconstructs the relationship at query time. The database engine fetches the user, then fetches matching posts using the index on posts.user_id. This is why indexing foreign keys matters — it\'s the join condition.' },
        { name: 'Cascade Delete', description: 'Cascade delete: parent deletion triggers child deletion. Convenient. Dangerous. Deleting a user deletes their posts, their comments, their orders. Think before you cascade in production.' },
        { name: 'The Impossibility of M:N', description: 'You cannot store arrays in a relational column. The relational model forbids it — it\'s called First Normal Form. Many-to-many requires a junction table. Always. No exceptions.' },
        { name: 'The Junction Table', description: 'The junction table is the relationship. Each row represents one enrollment. It can carry data ABOUT the relationship — enrolled_at, grade, completion_status. Data that belongs to neither student nor course alone, but to the connection between them.' },
        { name: 'Querying M:N', description: 'Many-to-many always requires two JOINs. students → junction → courses. The junction table is the bridge. Without it: no query can reconstruct the relationship from either side alone.' },
        { name: 'Composite Primary Key', description: 'Composite primary key: the combination of both foreign keys must be unique. Ram can only enroll in Math once. The constraint lives in the schema, not in your application code.' }
      ]
    },
    {
      id: 'joins',
      title: 'Joins Visualizer',
      animationComponent: 'JoinsVisualizer',
      bookRef: null,
      steps: [
        { name: 'INNER JOIN', description: 'INNER JOIN returns only matched rows. Alice has no department — excluded. Bob\'s department doesn\'t exist — excluded. Finance and HR have no employees — excluded. The intersection. The certainty. If a row appears here, both sides exist.' },
        { name: 'LEFT JOIN', description: 'LEFT JOIN: keep everything from the left table. Fill in right side where match exists. NULL where no match. Alice appears with NULLs — she exists, she just has no department. Use case: find employees WITHOUT a department — WHERE departments.id IS NULL.' },
        { name: 'RIGHT JOIN', description: 'RIGHT JOIN: mirror of LEFT JOIN. Keep everything from the right table. Finance and HR appear with NULL employees — departments exist, nobody works there. In practice, RIGHT JOIN is rare — most engineers rewrite as LEFT JOIN by swapping table order. Same result, more readable.' },
        { name: 'FULL OUTER JOIN', description: 'FULL OUTER JOIN: nobody gets left behind. All employees appear. All departments appear. Matches show the connection. Non-matches show NULLs. The complete picture — everything in both tables, whether or not it has a partner. Use case: audit queries — find orphans on either side.' },
        { name: 'CROSS JOIN', description: 'CROSS JOIN: every row from left × every row from right. No ON condition. No filtering. Every combination. Rarely intentional. Often accidental. 5 rows × 4 rows = 20 rows. Fine. 1M rows × 1M rows = 1 trillion rows. Not fine. The join that has ended careers when forgotten in a WHERE clause.' },
        { name: 'SELF JOIN', description: 'A table joining itself. Hierarchical data — org charts, categories, file systems, comment threads. The same table aliased twice, treated as two. manager_id references id in the same table. The database doesn\'t care — it\'s just a foreign key that happens to point home.' }
      ]
    },
    {
      id: 'normalization',
      title: 'Normalization (1NF → 3NF)',
      animationComponent: 'NormalizationAnim',
      bookRef: 'The 1NF, 2NF, 3NF progression from Chapter 4 — watch the anomalies disappear in real time',
      steps: [
        { name: 'The Denormalized Table', description: 'A flat file in a database. Data is duplicated. Ram\'s email appears twice. The Laptop price appears twice. This leads to anomalies.' },
        { name: 'Update & Delete Anomalies', description: 'Change Ram\'s email in one row, forget the other → UPDATE ANOMALY. Delete Varsha\'s order → Her customer details are gone forever → DELETE ANOMALY. The structure is fighting you.' },
        { name: '1NF: Atomic Values', description: 'First Normal Form: Each cell holds a single, atomic value. No arrays. No comma-separated lists. We are already in 1NF, but anomalies remain.' },
        { name: '2NF: Partial Dependencies', description: 'Second Normal Form: Non-key columns must depend on the WHOLE primary key. We split Orders and Products. The product price now lives in one place. No more update anomalies for products.' },
        { name: '3NF: Transitive Dependencies', description: 'Third Normal Form: Non-key columns must not depend on other non-key columns. Email depends on Customer Name, not the Order ID. We split Customers into their own table. Anomalies eliminated. The structure is pure.' }
      ]
    },
    {
      id: 'scaling-acid',
      title: 'Vertical Scaling & ACID',
      animationComponent: 'ACIDScalingAnim',
      bookRef: 'Chapter 4.4 of NestJS book — the bank transfer example you read is now interactive',
      steps: [
        { name: 'Vertical Scaling', description: 'Vertical scaling: make one server bigger. Works until it doesn\'t. Physics has a ceiling. Cost curves exponentially. At some point: one bigger machine costs more than ten smaller ones. SQL scales vertically brilliantly — until it can\'t.' },
        { name: 'Atomicity', description: 'Atomicity: All-or-nothing. Bank transfer $500 from A to B. If debit succeeds but credit fails, money vanishes. Atomicity ensures the entire transaction rolls back. Both accounts remain unchanged.' },
        { name: 'Consistency', description: 'Consistency: Rules enforced throughout. Account balance >= 0 constraint. Attempt to overdraft $1000 from $500. Transaction rejected. Rule enforced.' },
        { name: 'Isolation', description: 'Isolation: Concurrent transaction visualization. T1 and T2 read $1000 simultaneously. T1 deducts $500. T2 deducts $300. Without isolation, dirty read leads to wrong balance. With isolation, T2 waits for T1 to complete. Correct result.' },
        { name: 'Durability', description: 'Durability: Committed = permanent. Transaction committed. Server immediately crashes. Without durability, transaction lost. With durability: WAL (Write-Ahead Log) replays on restart. Data recovered. Balance correct.' }
      ]
    }
  ]
};
