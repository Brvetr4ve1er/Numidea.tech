'use server';
/**
 * @fileOverview AI-assisted sticker template creation flow for admin users.
 *
 * - generateStickerTemplates - A function that generates sticker templates based on admin-provided themes and trends.
 * - GenerateStickerTemplatesInput - The input type for the generateStickerTemplates function.
 * - GenerateStickerTemplatesOutput - The return type for the generateStickerTemplates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStickerTemplatesInputSchema = z.object({
  theme: z.string().describe('The theme for the sticker templates (e.g., cyberpunk, fantasy, animals).'),
  trend: z.string().describe('The current trend to incorporate into the sticker templates (e.g., pastel colors, 3D effects).'),
  quantity: z.number().describe('The number of sticker templates to generate.'),
});
export type GenerateStickerTemplatesInput = z.infer<typeof GenerateStickerTemplatesInputSchema>;

const StickerTemplateSchema = z.object({
  prompt: z.string().describe('The AI prompt used to generate the sticker template.'),
  imageDataUri: z.string().describe('The data URI of the generated sticker image.'),
});

const GenerateStickerTemplatesOutputSchema = z.object({
  stickerTemplates: z.array(StickerTemplateSchema).describe('An array of generated sticker templates.'),
});
export type GenerateStickerTemplatesOutput = z.infer<typeof GenerateStickerTemplatesOutputSchema>;

export async function generateStickerTemplates(input: GenerateStickerTemplatesInput): Promise<GenerateStickerTemplatesOutput> {
  return generateStickerTemplatesFlow(input);
}

const detailedPromptGenerator = ai.definePrompt({
  name: 'detailedPromptGenerator',
  input: {schema: z.object({ theme: z.string(), trend: z.string() })},
  output: {schema: z.object({ prompt: z.string() })},
  prompt: `You are an AI assistant specialized in creating prompts for image generation.
  Based on the provided theme and trend, create a single, detailed prompt for generating a sticker.
  The sticker should be visually appealing and suitable for a sticker shop.
  Ensure the prompt is descriptive and provides clear artistic direction.
  For example, if theme is "cat" and trend is "cyberpunk", a good prompt would be "A portrait of a cool cyberpunk cat wearing glowing neon sunglasses, with a futuristic city skyline in the background, digital art, vibrant colors".

  Theme: {{{theme}}}
  Trend: {{{trend}}}
  `,
});

const generateStickerTemplatesFlow = ai.defineFlow(
  {
    name: 'generateStickerTemplatesFlow',
    inputSchema: GenerateStickerTemplatesInputSchema,
    outputSchema: GenerateStickerTemplatesOutputSchema,
  },
  async (input) => {
    const generationPromises = [];

    for (let i = 0; i < input.quantity; i++) {
      const promise = (async () => {
        // Step 1: Generate a detailed prompt
        const { output } = await detailedPromptGenerator({ theme: input.theme, trend: input.trend });
        const imagePrompt = output?.prompt;

        if (!imagePrompt) {
          throw new Error('Failed to generate a detailed prompt.');
        }

        // Step 2: Generate an image using the detailed prompt
        const { media } = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: imagePrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });

        if (!media?.url) {
          throw new Error('Image generation failed to return a data URI.');
        }

        return {
          prompt: imagePrompt,
          imageDataUri: media.url,
        };
      })();
      generationPromises.push(promise);
    }

    const stickerTemplates = await Promise.all(generationPromises);
    return { stickerTemplates };
  }
);
