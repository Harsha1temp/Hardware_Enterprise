// import { MongoClient, type Db, ObjectId } from "mongodb"

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }

// const uri = process.env.MONGODB_URI
// const options = {}

// let client: MongoClient
// let clientPromise: Promise<MongoClient>
// let db: Db

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   const globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>
//   }

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     globalWithMongo._mongoClientPromise = client.connect()
//   }
//   clientPromise = globalWithMongo._mongoClientPromise
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

// export async function connectToDatabase() {
//   if (!db) {
//     const dbClient = await clientPromise
//     db = dbClient.db("om_sai_enterprises")
//   }
//   return { db, ObjectId }
// }

// export { clientPromise }
// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("dbConnect called. Cached connection:", !!cached.conn); // Log if cached
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add serverSelectionTimeoutMS for faster timeout feedback (e.g., 5 seconds)
      serverSelectionTimeoutMS: 5000
    };

    console.log('Attempting to connect to MongoDB...'); // Log connection attempt
    console.log('Using URI:', MONGODB_URI); // Log the URI (be careful if sharing logs later)

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('MongoDB Connection Successful!'); // Log success
      return mongoose;
    });
  } else {
      console.log("Awaiting existing connection promise..."); // Log if waiting
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) { // Catch specific error
    console.error('!!! MongoDB Connection Error:', e.message); // Log the error message
    console.error('Full error object:', e); // Log the full error object
    cached.promise = null; // Reset promise on error
    throw new Error(`Database connection failed: ${e.message}`); // Re-throw a clearer error
  }

  return cached.conn;
}

export default dbConnect;