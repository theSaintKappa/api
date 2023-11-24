import { connect, Date, Document } from "mongoose";
import secrets from "../secrets";

connect(secrets.mongoUri, { dbName: "MosesDB" }).then(() => console.log("🥭 Connected to MongoDB"));

export interface DocumentTimestamps {
    createdAt: Date;
    updatedAt: Date;
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
