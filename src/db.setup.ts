import mongoose, { Date } from "mongoose";
const connectionStr = process.env.MONGODB_URI;

if (!connectionStr) throw new Error("No MongoDB connection string. Set MONGODB_URI environment variable.");

mongoose.connect(connectionStr).then((asd) => console.log("Connected to MongoDB"));

export interface DocumentTimestamps {
    createdAt: Date;
    updatedAt: Date;
}
