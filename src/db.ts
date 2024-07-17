import { type Document, type MongooseError, type Date as Timestamp, connect } from "mongoose";

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

export interface IMosesQuote extends Document, DocumentTimestamps {
    id: number;
    content: string;
    submitterId: string;
}

export interface IMosesPic extends Document, DocumentTimestamps {
    id: string;
    url: string;
    submitterId: string;
    name: string;
    size: number;
    dimensions: { width: number; height: number };
    contentType: string;
}
