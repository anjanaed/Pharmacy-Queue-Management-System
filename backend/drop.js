// // filepath: /c:/Users/USER/Documents/Pharmacy Queue Management System/dropIndex.js
// const mongoose = require('mongoose');

// // Replace with your MongoDB connection string
// const uri = 'mongodb+srv://backendoc2002:5zneisS9SrygW9mB@pharmacy.hft0r.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Pharmacy';

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
//     return mongoose.connection.db.collection('orders').dropIndex('orderID_1');
//   })
//   .then(() => {
//     console.log('Index dropped');
//     mongoose.connection.close();
//   })
//   .catch(err => {
//     console.error('Error dropping index:', err);
//     mongoose.connection.close();
//   });

// const mongoose = require('mongoose');

// // Replace with your MongoDB connection string
// const uri = 'mongodb+srv://backendoc2002:5zneisS9SrygW9mB@pharmacy.hft0r.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Pharmacy';

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => {
//     console.log('Connected to MongoDB');
//     const db = mongoose.connection.db;

//     // List all collections
//     const collections = await db.listCollections().toArray();
//     console.log('Collections:');
//     collections.forEach(collection => console.log(collection.name));

//     // List indexes for each collection
//     for (const collection of collections) {
//       const indexes = await db.collection(collection.name).indexes();
//       console.log(`Indexes for collection ${collection.name}:`);
//       console.log(indexes);
//     }

//     mongoose.connection.close();
//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//     mongoose.connection.close();
//   });

const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Replace with your MongoDB connection string


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;

    // Remove all records from the 'orders' collection
    const result = await db.collection('orders').deleteMany({});
    console.log(`Deleted ${result.deletedCount} records from the 'orders' collection`);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    mongoose.connection.close();
  });