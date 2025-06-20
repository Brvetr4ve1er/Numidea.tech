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
      'The generated sticker as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the typo here
    ),
});
export type GenerateStickerOutput = z.infer<typeof GenerateStickerOutputSchema>;

export async function generateSticker(input: GenerateStickerInput): Promise<GenerateStickerOutput> {
  return generateStickerFlow(input);
}

const generateStickerPrompt = ai.definePrompt({
  name: 'generateStickerPrompt',
  input: {schema: GenerateStickerInputSchema},
  output: {schema: GenerateStickerOutputSchema},
  prompt: `Generate a sticker based on the following prompt: {{{prompt}}}. The sticker should be a PNG image encoded as a data URI.`, // Added prompt instructions.
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateStickerFlow = ai.defineFlow(
  {
    name: 'generateStickerFlow',
    inputSchema: GenerateStickerInputSchema,
    outputSchema: GenerateStickerOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {stickerDataUri: media.url!};
  }
);
