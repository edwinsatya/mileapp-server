const { MongoClient } = require('mongodb');

async function createIndexes() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('mileapp');

  const tasks = db.collection('tasks');

  // Index for filtering by status
  await tasks.createIndex({ status: 1 });

  // Index for text search on title
  await tasks.createIndex({ title: "text" });

  // Index for sorting by dueDate or createdAt
  await tasks.createIndex({ dueDate: 1 });
  await tasks.createIndex({ createdAt: -1 });

  console.log('Indexes created successfully!');
  await client.close();
}

createIndexes().catch(console.error);