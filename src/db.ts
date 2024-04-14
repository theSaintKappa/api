import { connect, type Document, type Date as Timestamp } from "mongoose";

connect(process.env.MONGO_URI, { dbName: "MosesDB" }).then(() => console.log("🥭 Connected to MongoDB"));

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
