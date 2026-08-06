import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const modelsCollection = defineCollection({
    // This tells Astro exactly where to look for your markdown files
    loader: glob({ pattern: "**/*.md", base: "src/content/models" }),
    schema: z.object({
        // Core Identity Fields (Strictly Required)
        title: z.string(),
        category: z.string(),
        description: z.string(),
        creator: z.string(),
        publishedDate: z.coerce.date(),
        lastUpdated: z.coerce.date().optional(),
        pricingTier: z.enum(['Free', 'Freemium', 'Paid']).default('Freemium'),
        listingStatus: z.enum(['main-stack', 'curated', 'watchlist']),

        // Media & Assets (Optional to support open-source models without logos or sites)
        logo: z.string().url().optional().nullable(),
        officialLink: z.string().url().optional().nullable(),

        // ==========================================
        // A listing may be explicitly unrated while it is still on the watchlist.
        // ==========================================
        editorsOpinion: z.object({
            rating: z.string().nullable(),
            opinion: z.string().trim().min(1).nullable(),
        }).refine(
            ({ rating, opinion }) => opinion !== null || rating === null,
            { message: 'A rating can only be set when an opinion is present.' },
        ),

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
            free: z.string().optional(),
            paid: z.string().optional(),
        }).optional(),

        // Complex Datasets (Defaulted to empty arrays if missing from markdown files)
        modelVariants: z.array(z.object({
            name: z.string(),
            details: z.string(),
            freeTier: z.boolean(),
        })).default([]),

        bestFor: z.object({
            who: z.string().optional(),
            what: z.string().optional(),
        }).optional(),

        topFeatures: z.array(z.object({
            title: z.string(),
            details: z.string(),
        })).default([]),

        officialAccessText: z.string(),
        alsoAvailableViaText: z.string().optional(),

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

        faqs: z.array(z.object({
            question: z.string(),
            answer: z.string(),
        })).default([]),
    }).superRefine((model, context) => {
        if (model.listingStatus === 'watchlist' && (model.editorsOpinion.opinion !== null || model.editorsOpinion.rating !== null)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Watchlist listings cannot have an opinion or rating.',
                path: ['editorsOpinion'],
            });
        }
    }),
});

const blogCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "src/content/blog" }),
    schema: z.object({
        title: z.string(),
        cardDescription: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        postType: z.enum(['listicle', 'deep-dive', 'comparison', 'opinion']),
        tags: z.array(z.string()).default([]),
        relatedTools: z.array(z.object({
            name: z.string(),
            link: z.string(),
        })).default([]),
    }),
});

const newsCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "src/content/news" }),
    schema: z.object({
        title: z.string(),
        cardDescription: z.string(),
        pubDate: z.coerce.date(),
        lastUpdated: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        relatedTools: z.array(z.object({
            name: z.string(),
            link: z.string(),
        })).default([]),
        sourceUrl: z.string().url().optional(),
    }),
});

export const collections = {
    'models': modelsCollection,
    'blog': blogCollection,
    'news': newsCollection,
};
