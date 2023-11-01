import { Elysia, t } from "elysia";
import { PipelineStage } from "mongoose";
import Pic, { IPic } from "../models/pic.schema";
import Quote, { IQuote } from "../models/quote.schema";

const tags = ["Ⓜ️ Moses"];
const querySchema = t.Object({
    id: t.Optional(t.Numeric()),
    sort: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
    limit: t.Optional(t.Numeric()),
});
const excludeFields: PipelineStage = { $project: { _id: 0 } };

const moses = (app: Elysia) => {
    return app
        .get(
            "/quotes",
            async ({ query }) => {
                const pipeline: PipelineStage[] = [excludeFields, { $sample: { size: await Quote.estimatedDocumentCount() } }];
                if (query.id) pipeline.push({ $match: { id: query.id } });
                if (query.sort) pipeline.push({ $sort: { id: query.sort === "asc" ? 1 : -1 } });
                if (query.limit) pipeline.push({ $limit: query.limit });

                const quotes = await Quote.aggregate<IQuote>(pipeline);
                return quotes;
            },
            {
                query: querySchema,
                detail: { tags, summary: "Get all the Moses quotes." },
            }
        )
        .get(
            "/quotes/random",
            async () => {
                const pipeline: PipelineStage[] = [excludeFields];
                pipeline.push({ $sample: { size: 1 } });

                const quote = await Quote.aggregate<IQuote>(pipeline);
                return quote[0];
            },
            { detail: { tags, summary: "Get a random Moses quote." } }
        )

        .get(
            "/pics",
            async ({ query }) => {
                const pipeline: PipelineStage[] = [excludeFields, { $sample: { size: await Pic.estimatedDocumentCount() } }];
                if (query.id) pipeline.push({ $match: { id: query.id } });
                if (query.sort) pipeline.push({ $sort: { createdAt: query.sort === "asc" ? 1 : -1 } });
                if (query.limit) pipeline.push({ $limit: query.limit });

                const pics = await Pic.aggregate<IPic>(pipeline);
                return pics;
            },
            {
                query: querySchema,
                detail: { tags, summary: "Get all the Moses pics." },
            }
        )
        .get(
            "/pics/random",
            async () => {
                const pipeline: PipelineStage[] = [excludeFields];
                pipeline.push({ $sample: { size: 1 } });

                const pic = await Pic.aggregate<IPic>(pipeline);
                return pic[0];
            },
            { detail: { tags, summary: "Get a random Moses pic." } }
        );
};

export default moses;
