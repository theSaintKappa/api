import { Document, Schema, model } from "mongoose";
import { DocumentTimestamps } from "../db.setup";

export interface IPic extends Document, DocumentTimestamps {
    id: number;
    url: string;
    submitterId: string;
    name: string;
    size: number;
    dimensions: {
        width: number;
        height: number;
    };
    contentType: string;
}

const schema = new Schema<IPic>(
    {
        id: { type: Number, required: true, unique: true },
        url: { type: String, required: true },
        submitterId: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: Number, required: true },
        dimensions: {
            width: { type: Number, required: true },
            height: { type: Number, required: true },
        },
        contentType: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

export default model<IPic>("moses-pics", schema);
