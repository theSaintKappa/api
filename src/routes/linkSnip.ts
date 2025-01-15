import { client } from "@/db/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";

const redirectUrl = process.env.LINKSNIP_REDIRECT_URL;

export const linkSnip = new Elysia().post(
    "/",
    async ({ body: { url, id }, error }) => {
        // biome-ignore format:
        const urlPattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
        if (!urlPattern.test(url)) return error(400, { message: "Invalid URL" });

        // Add http:// if no protocol is provided
        url = !/https?:\/\//i.test(url) ? `http://${url}` : url;

        if (/(https?:\/\/)?([a-zA-Z0-9-]+\.)?saintkappa\.dev(\/.*)?/i.test(url)) return error(400, { message: "You can't do that" });

        if (!id) {
            const existingKey = await client.get(`url:${url}`);
            if (existingKey) return { id: existingKey, url: redirectUrl + existingKey, redirectTo: url, alreadyStored: true };

            const newId = nanoid(4);
            await client.set(`id:${newId}`, url);
            await client.set(`url:${url}`, newId);
            return { id: newId, url: redirectUrl + newId, redirectTo: url, alreadyStored: false };
        }

        if (/[^\w-]/.test(id) || id.length > 64) return error(400, { message: "ID only accepts alphanumeric characters, underscores, hyphens, and must be less than 64 characters" });

        const existingUrl = await client.get(`id:${id}`);
        if (existingUrl) {
            if (existingUrl === url) return { id, url: redirectUrl + id, redirectTo: url, alreadyStored: true };
            return error(400, { message: "Custom ID already in use for a different URL" });
        }

        await client.set(`id:${id}`, url);
        await client.set(`url:${url}`, id);
        return { id, url: redirectUrl + id, redirectTo: url, alreadyStored: false };
    },
    {
        body: t.Object({ url: t.String(), id: t.Optional(t.String()) }),
        response: { 200: t.Object({ id: t.String(), url: t.String(), redirectTo: t.String(), alreadyStored: t.Boolean() }), 400: t.Object({ message: t.String() }) },
        detail: { tags: ["🔗 URL Shortener"], summary: "Shorten a URL", description: "Shorten a URL using the link shortener" },
    },
);
