import { type Elysia, t } from "elysia";
import { Jimp, JimpMime } from "jimp";

const tags = ["✨ Fun"];

const albumCover = (app: Elysia) =>
    app.post(
        "/",
        async ({ body }) => {
            const buffer = await body.image.arrayBuffer();
            const image = await Jimp.fromBuffer(Buffer.from(buffer));
            const overlay = await Jimp.read("public/overlay.png");

            image.cover({ w: 1024, h: 1024 });
            image.brightness(0.75);
            image.contrast(0.15);
            image.composite(overlay, 0, 0);

            const compositedImage = await image.getBuffer(JimpMime.png);

            return new Response(compositedImage, { headers: { "Content-Type": JimpMime.png } });
        },
        {
            body: t.Object({
                image: t.File({ type: "image" }),
            }),
            detail: { tags, summary: "Everything can be an album cover" },
        },
    );

export default albumCover;
