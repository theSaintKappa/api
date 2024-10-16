import { type IMosesPic, MosesPic } from "@/models/MosesPic";
import { type IMosesQuote, MosesQuote } from "@/models/MosesQuote";
import { type Elysia, t } from "elysia";
import type { PipelineStage } from "mongoose";

const tags = ["Ⓜ️ Moses"];

const quotesQuery = t.Object({
    id: t.Optional(t.Numeric()),
    sort: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
    sample: t.Optional(t.Union([t.Numeric(), t.Literal("all")])),
    limit: t.Optional(t.Numeric()),
});

const imagesQuery = t.Object({
    id: t.Optional(t.String()),
    sample: t.Optional(t.Union([t.Numeric(), t.Literal("all")])),
    limit: t.Optional(t.Numeric()),
    excludeTypes: t.Optional(t.String()),
});

const excludeStage: PipelineStage = { $project: { _id: 0 } };

const moses = (app: Elysia) =>
    app
        .get(
            "/quotes",
            async ({ query }) => {
                const pipeline: PipelineStage[] = [excludeStage];

                if (query.id) pipeline.push({ $match: { id: query.id } });
                if (query.sort) pipeline.push({ $sort: { id: query.sort === "asc" ? 1 : -1 } });
                if (query.sample) pipeline.push({ $sample: { size: query.sample === "all" ? Number.MAX_SAFE_INTEGER : query.sample } });
                if (query.limit) pipeline.push({ $limit: query.limit });

                const quotes = await MosesQuote.aggregate<IMosesQuote>(pipeline);
                return quotes;
            },
            { query: quotesQuery, detail: { tags, summary: "Get all the Moses quotes" } },
        )
        .get(
            "/quotes/random",
            async () => {
                const pipeline: PipelineStage[] = [excludeStage, { $sample: { size: 1 } }];

                const quote = await MosesQuote.aggregate<IMosesQuote>(pipeline);
                return quote[0];
            },
            { detail: { tags, summary: "Get a random Moses quote" } },
        )

        .get(
            "/pics",
            async ({ query }) => {
                const pipeline: PipelineStage[] = [excludeStage];

                if (query.excludeTypes) pipeline.push({ $match: { contentType: { $nin: query.excludeTypes.split(",") } } });
                if (query.id) pipeline.push({ $match: { id: query.id } });
                if (query.sample) pipeline.push({ $sample: { size: query.sample === "all" ? Number.MAX_SAFE_INTEGER : query.sample } });
                if (query.limit) pipeline.push({ $limit: query.limit });

                const pics = await MosesPic.aggregate<IMosesPic>(pipeline);
                return pics;
            },
            { query: imagesQuery, detail: { tags, summary: "Get all the Moses pics" } },
        )
        .get(
            "/pics/random",
            async ({ query, redirect }) => {
                const pipeline: PipelineStage[] = [excludeStage, { $sample: { size: 1 } }];

                const pic = await MosesPic.aggregate<IMosesPic>(pipeline);
                return query.redirect ? redirect(pic[0].url) : pic[0];
            },
            { query: t.Object({ redirect: t.Optional(t.BooleanString()) }), detail: { tags, summary: "Get a random Moses pic" } },
        );

export default moses;
