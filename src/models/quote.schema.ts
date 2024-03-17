import { Schema, model } from "mongoose";
<<<<<<< HEAD
import { IMosesQuote } from "../db";
=======
import type { IMosesQuote } from "../db";
>>>>>>> docker

const schema = new Schema<IMosesQuote>(
    {
        id: { type: Number, required: true, unique: true },
        content: { type: String, required: true },
        submitterId: { type: String, required: true },
    },
<<<<<<< HEAD
    { timestamps: true, versionKey: false }
=======
    { timestamps: true, versionKey: false },
>>>>>>> docker
);

export default model<IMosesQuote>("moses.quotes", schema, "moses.quotes");
