import { Elysia, t } from "elysia";
import Jimp from "jimp";

const tags = ["✨ Fun"];

const albumCover = (app: Elysia) =>
    app.post(
        "/",
        async ({ body }) => {
            const buffer = await body.image.arrayBuffer();
            const image = await Jimp.read(Buffer.from(buffer));
            const overlay = await Jimp.read("https://raw.githubusercontent.com/theSaintKappa/api-legacy/master/public/overlay.png");

            image.cover(1024, 1024);
            image.brightness(-0.25);
            image.contrast(0.15);
            image.composite(overlay, 0, 0);

            const compositedImage = await image.getBufferAsync(Jimp.MIME_PNG);

            return new Response(Buffer.from(compositedImage), { headers: { "Content-Type": Jimp.MIME_PNG } });
        },
        {
            body: t.Object({
                image: t.File({ type: "image" }),
            }),
            detail: { tags, summary: "Everything can be an album cover" },
        }
    );

export default albumCover;
