import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

export const connectMongoDB = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/pdf_storage?authSource=admin`;

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db("pdf_storage");
    console.log("Connected to MongoDB");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export const getMongoDBInstance = (): Db => {
  if (!db) {
    throw new Error("MongoDB not connected. Call connectMongoDB() first.");
  }
  return db;
};

export const closeMongoDBConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};

export default { connectMongoDB, getMongoDBInstance, closeMongoDBConnection };
