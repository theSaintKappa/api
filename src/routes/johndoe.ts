import type { Elysia } from "elysia";
import data from "./johndoe.json";

const tags = ["✨ Fun"];

const johndoe = (app: Elysia) =>
    app.get(
        "/",
        async () => {
            const item = data[Math.floor(Math.random() * data.length)];
            return item;
        },
        { detail: { tags, summary: "Goodbye, John Doe", description: "Data provided by https://goodbyejohndoe.com/" } },
    );

export default johndoe;
