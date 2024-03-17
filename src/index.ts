import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import packageJson from "../package.json";
import "./db";
import albumCover from "./routes/albumCover";
import moses from "./routes/moses";
// import vulcan from "./routes/vulcan";

const app = new Elysia()
    .use(cors())
    .use(
        rateLimit({
            duration: 60000,
            max: 100,
            responseMessage: "Whoa there, slow down. You can only make 100 requests per minute.",
        }),
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
                    license: { name: packageJson.license },
                },
            },
        }),
    )
    .use(html())
    .use(staticPlugin())
    .get("/", () => Bun.file("./public/index.html").text())
    .group("/moses", (app) => app.use(moses))
    // .group("/vulcan", (app) => app.use(vulcan))
    .group("/albumCover", (app) => app.use(albumCover))
    .onError(({ code, set }) => {
        if (code === "NOT_FOUND") {
            set.status = 404;
            return "404 Not Found";
        }
    })
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
