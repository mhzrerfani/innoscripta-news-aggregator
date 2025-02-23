import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"
import "dotenv/config"

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
        NEWSAPI_KEY: z.string({
            required_error: "NewsAPI key is required",
        }),
        GUARDIAN_API_KEY: z.string({
            required_error: "Guardian API key is required",
        }),
        NEWSAPI_BASE_URL: z.string().default("https://newsapi.org/v2"),
        GUARDIAN_BASE_URL: z.string().default("https://content.guardianapis.com"),
        BBC_RSS_URL: z.string().default("https://feeds.bbci.co.uk"),
    },
    client: {
        // No client-side environment variables needed
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        NEWSAPI_KEY: process.env.NEWSAPI_KEY,
        GUARDIAN_API_KEY: process.env.GUARDIAN_API_KEY,
        NEWSAPI_BASE_URL: process.env.NEWSAPI_BASE_URL,
        GUARDIAN_BASE_URL: process.env.GUARDIAN_BASE_URL,
        BBC_RSS_URL: process.env.BBC_RSS_URL,
    },
})
