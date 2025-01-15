import { type MongooseError, type Date as Timestamp, connect } from "mongoose";

export const connectMongo = async () => {
    try {
        await connect(process.env.MONGO_URI, { dbName: "MosesDB", serverSelectionTimeoutMS: 5000 });
        console.log("🥭 Connected to MongoDB!");
    } catch (err) {
        console.error(`❌ Failed to connect to Mongo: ${(<MongooseError>err).message}`);
    }
};
export interface DocumentTimestamps {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
