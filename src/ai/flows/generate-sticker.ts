// src/ai/flows/generate-sticker.ts
'use server';
/**
 * @fileOverview A flow to generate a sticker from a text prompt.
 *
 * - generateSticker - A function that generates a sticker from a text prompt.
 * - GenerateStickerInput - The input type for the generateSticker function.
 * - GenerateStickerOutput - The return type for the generateSticker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStickerInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate the sticker from.'),
});
export type GenerateStickerInput = z.infer<typeof GenerateStickerInputSchema>;

const GenerateStickerOutputSchema = z.object({
  stickerDataUri: z
    .string()
    .describe(
      'The generated sticker as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateStickerOutput = z.infer<typeof GenerateStickerOutputSchema>;

export async function generateSticker(input: GenerateStickerInput): Promise<GenerateStickerOutput> {
  return generateStickerFlow(input);
}

const generateStickerFlow = ai.defineFlow(
  {
    name: 'generateStickerFlow',
    inputSchema: GenerateStickerInputSchema,
    outputSchema: GenerateStickerOutputSchema,
  },
  async (input) => {
    // Enhance prompt for better sticker-like results
    const enhancedPrompt = `A die-cut sticker of ${input.prompt}, vector art, vibrant colors, with a thick white border, on a clean white background.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: enhancedPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_ONLY_HIGH',
            },
        ],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return a data URI.');
    }

    return {stickerDataUri: media.url};
  }
);
