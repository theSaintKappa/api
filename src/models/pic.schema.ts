import { Schema, model } from "mongoose";
<<<<<<< HEAD
import { IMosesPic } from "../db";
=======
import type { IMosesPic } from "../db";
>>>>>>> docker

const schema = new Schema<IMosesPic>(
    {
        id: { type: String, required: true, unique: true },
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
<<<<<<< HEAD
    { timestamps: true, versionKey: false }
=======
    { timestamps: true, versionKey: false },
>>>>>>> docker
);

export default model<IMosesPic>("moses.pics", schema, "moses.pics");
