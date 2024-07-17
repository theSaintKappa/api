import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import packageJson from "../package.json";
import { connectMongo } from "./db";
import albumCover from "./routes/albumCover";
import johndoe from "./routes/johndoe";
import moses from "./routes/moses";

await connectMongo();

const app = new Elysia()
    .use(cors())
    .use(rateLimit({ duration: 60000, max: 60, errorResponse: "Whoa there, slow down. You can only make 60 requests per minute." }))
    .use(
        swagger({
            path: "/docs",
            exclude: ["/", "/docs", "/docs/json", "/public/public"],
            documentation: {
                info: {
                    title: "SaintKappa API",
                    version: packageJson.version,
                    description:
                        "Welcome to the playground of *whimsical data exchange*! Dive into the world of my REST API, crafted with the magic of **Elysia.js** and **Bun**. With a sprinkle of *coding sorcery*, this API brings forth a realm where fetching data feels like a *delightful adventure*. Whether you're seeking **[Moses](https://github.com/theSaintKappa/MosesBot)** quotes, pics or curious insights, embark on a journey through endpoints as enchanting as they are efficient. Unleash your imagination, for here, every request is a ticket to a realm where *fun* meets *functionality*!<br>*~ OpenAI (2024). ChatGPT (3.5) [LLM] https://chat.openai.com*",
                    license: { name: packageJson.license },
                },
            },
        }),
    )
    .use(html())
    .use(staticPlugin())
    .get("/", () => Bun.file("./public/index.html").text())
    .group("/moses", (app) => app.use(moses))
    .group("/albumCover", (app) => app.use(albumCover))
    .group("/johndoe", (app) => app.use(johndoe))
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
