import { t, type Elysia } from "elysia";
import type { PipelineStage } from "mongoose";
import type { IMosesPic, IMosesQuote } from "../db";
import MosesPic from "../models/pic.schema";
import MosesQuote from "../models/quote.schema";

const tags = ["Ⓜ️ Moses"];
const querySchema = t.Object({
    id: t.Optional(t.Numeric()),
    sort: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
    limit: t.Optional(t.Numeric()),
});
const excludeFields: PipelineStage = { $project: { _id: 0 } };

const moses = (app: Elysia) =>
    app
        .get(
            "/quotes",
            async ({ query }) => {
                const pipeline: PipelineStage[] = [excludeFields];

                if (query.id) pipeline.push({ $match: { id: query.id } });

                if (query.sort) pipeline.push({ $sort: { id: query.sort === "asc" ? 1 : -1 } });
                else pipeline.push({ $sample: { size: await MosesQuote.estimatedDocumentCount() } });

                if (query.limit) pipeline.push({ $limit: query.limit });

                const quotes = await MosesQuote.aggregate<IMosesQuote>(pipeline);
                return quotes;
            },
            {
                query: querySchema,
                detail: { tags, summary: "Get all the Moses quotes." },
            },
        )
        .get(
            "/quotes/random",
            async () => {
                const pipeline: PipelineStage[] = [excludeFields];
                pipeline.push({ $sample: { size: 1 } });

                const quote = await MosesQuote.aggregate<IMosesQuote>(pipeline);
                return quote[0];
            },
            { detail: { tags, summary: "Get a random Moses quote." } },
        )

        .get(
            "/pics",
            async ({ query }) => {
                const pipeline: PipelineStage[] = [excludeFields, { $sample: { size: await MosesPic.estimatedDocumentCount() } }];

                if (query.id) pipeline.push({ $match: { id: query.id } });

                if (query.sort) pipeline.push({ $sort: { createdAt: query.sort === "asc" ? 1 : -1 } });

                if (query.limit) pipeline.push({ $limit: query.limit });

                const pics = await MosesPic.aggregate<IMosesPic>(pipeline);
                return pics;
            },
            {
                query: querySchema,
                detail: { tags, summary: "Get all the Moses pics." },
            },
        )
        .get(
            "/pics/random",
            async () => {
                const pipeline: PipelineStage[] = [excludeFields];
                pipeline.push({ $sample: { size: 1 } });

                const pic = await MosesPic.aggregate<IMosesPic>(pipeline);
                return pic[0];
            },
            { detail: { tags, summary: "Get a random Moses pic." } },
        );

export default moses;
