import { Elysia } from "elysia";
import data from "../../public/johndoe.json";

const tags = ["✨ Fun"];

export const johndoe = new Elysia().get(
    "/",
    async () => {
        const item = data[Math.floor(Math.random() * data.length)];
        return item;
    },
    { detail: { tags, summary: "Goodbye, John Doe", description: "Data provided by https://goodbyejohndoe.com/" } },
);
