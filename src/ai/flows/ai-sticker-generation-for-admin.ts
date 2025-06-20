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

const GenerateStickerTemplatesOutputSchema = z.object({
  stickerTemplates: z.array(
    z.object({
      prompt: z.string().describe('The AI prompt used to generate the sticker template.'),
      imageDataUri: z.string().describe('The data URI of the generated sticker image.'),
    })
  ).describe('An array of generated sticker templates.'),
});
export type GenerateStickerTemplatesOutput = z.infer<typeof GenerateStickerTemplatesOutputSchema>;

export async function generateStickerTemplates(input: GenerateStickerTemplatesInput): Promise<GenerateStickerTemplatesOutput> {
  return generateStickerTemplatesFlow(input);
}

const generateStickerTemplatePrompt = ai.definePrompt({
  name: 'generateStickerTemplatePrompt',
  input: {schema: GenerateStickerTemplatesInputSchema},
  output: {schema: z.object({prompt: z.string(), imageDataUri: z.string()})},
  prompt: `You are an AI assistant helping a sticker company admin generate new sticker templates.

  Based on the provided theme and trend, create a detailed AI prompt that can be used to generate a sticker image.
  Then, generate the sticker image using the generated prompt.

  Theme: {{{theme}}}
  Trend: {{{trend}}}

  Return the AI prompt and the data URI of the generated sticker image.
  Make sure the image data URI is a valid base64 encoded png image.
  Follow the format: data:<mimetype>;base64,<encoded_data>.
  `,
});

const generateStickerTemplatesFlow = ai.defineFlow(
  {
    name: 'generateStickerTemplatesFlow',
    inputSchema: GenerateStickerTemplatesInputSchema,
    outputSchema: GenerateStickerTemplatesOutputSchema,
  },
  async input => {
    const stickerTemplates = [];
    for (let i = 0; i < input.quantity; i++) {
      const {output} = await generateStickerTemplatePrompt(input);
      if (output) {
        stickerTemplates.push(output);
      }
    }
    return {stickerTemplates};
  }
);
