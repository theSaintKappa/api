import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import packageJson from "../package.json";
import "./db.setup";

import moses from "./routes/moses";

const app = new Elysia()
    .use(cors())
    .use(
        rateLimit({
            duration: 60000,
            max: 100,
            responseMessage: "Whoa there, slow down. You can only make 100 requests per minute.",
        })
    )
    .use(
        swagger({
            path: "/docs",
            exclude: ["/", "/docs", "/docs/json"],
            documentation: {
                info: {
                    title: packageJson.name,
                    version: packageJson.version,
                    description: packageJson.description,
                },
                tags: [
                    // { name: "App", description: "General endpoints" },
                    { name: "Moses", description: "Vulcan" },
                    { name: "Vulcan", description: "Vulcan" },
                ],
            },
        })
    )
    .use(html())
    .use(staticPlugin())
    .get("/", () => Bun.file("index.html").text(), { detail: { tags: ["App"] } })
    .group("/moses", (app) => app.use(moses))
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
