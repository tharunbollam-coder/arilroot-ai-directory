import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const modelsCollection = defineCollection({
    // This tells Astro exactly where to look for your markdown files
    loader: glob({ pattern: "**/*.md", base: "./src/content/models" }),
    schema: z.object({
        // Core Identity Fields (Strictly Required)
        title: z.string(),
        category: z.string(),
        description: z.string(),
        creator: z.string(),

        // Media & Assets (Optional to support open-source models without logos or sites)
        logo: z.string().url().optional().nullable(),
        officialLink: z.string().url().optional().nullable(),

        // ==========================================
        // NEW ADDITION: EDITOR'S REVIEW (OPTIONAL)
        // ==========================================
        editorsReview: z.object({
            rating: z.string(),
            verdict: z.string(),
            handsOnNotes: z.string(),
        }).optional(),

        // ==========================================
        // NEW ADDITION: PROMPT TECHNIQUES (DEFAULTS TO EMPTY ARRAY)
        // ==========================================
        promptTechniques: z.array(z.object({
            title: z.string(),
            concept: z.string(),
            workflow: z.string(),
        })).default([]),

        // Narrative Copy (Optional)
        introduction: z.string().optional(),
        howItWorks: z.string().optional(),

        // Core Metrics (Optional wrappers to prevent build crashes)
        pricing: z.object({
            startingPrice: z.string().optional(),
            pricingUrl: z.string().url().optional(),
            free: z.string(),
            paid: z.string(),
        }).optional(),

        // Complex Datasets (Defaulted to empty arrays if missing from markdown files)
        modelVariants: z.array(z.object({
            name: z.string(),
            details: z.string(),
            freeTier: z.boolean(),
        })).default([]),

        bestFor: z.object({
            who: z.string(),
            what: z.string(),
        }).optional(),

        topFeatures: z.array(z.object({
            title: z.string(),
            details: z.string(),
        })).default([]),

        accessPlatforms: z.array(z.object({
            name: z.string(),
            details: z.string(),
        })).default([]),

        useCases: z.array(z.object({
            title: z.string(),
            details: z.string(),
        })).default([]),

        quickIdeas: z.array(z.string()).default([]),
        pros: z.array(z.string()).default([]),
        cons: z.array(z.string()).default([]),

        latestUpdates: z.array(z.object({
            title: z.string(),
            details: z.string(),
        })).default([]),

        alternatives: z.array(z.object({
            name: z.string(),
            value: z.string(),
            link: z.string().optional(),
        })).default([]),
    }),
});

export const collections = {
    'models': modelsCollection,
};