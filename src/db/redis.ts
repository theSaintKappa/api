import { createClient } from "redis";

export const client = createClient({ url: process.env.REDIS_URL });

client.on("connect", () => console.log("🔺 Connected to Redis!"));
client.on("error", (err) => console.error("❌ Failed to connect to Redis: ", err));

export const connectRedis = async () => await client.connect();
