// Visual search flow to find stickers by vibe/aesthetic tag.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualSearchInputSchema = z.object({
  query: z
    .string()
    .describe('The search query or description of the desired sticker.'),
});
export type VisualSearchInput = z.infer<typeof VisualSearchInputSchema>;

const VisualSearchOutputSchema = z.object({
  stickerUrls: z
    .array(z.string())
    .describe('An array of URLs for stickers that match the search query.'),
});
export type VisualSearchOutput = z.infer<typeof VisualSearchOutputSchema>;

export async function visualSearch(input: VisualSearchInput): Promise<VisualSearchOutput> {
  return visualSearchFlow(input);
}

const visualSearchPrompt = ai.definePrompt({
  name: 'visualSearchPrompt',
  input: {schema: VisualSearchInputSchema},
  output: {schema: VisualSearchOutputSchema},
  prompt: `You are a sticker search assistant. A user will provide a query describing a sticker they want. Return an array of URLs for stickers that match the description.

Query: {{{query}}}`,
});

const visualSearchFlow = ai.defineFlow(
  {
    name: 'visualSearchFlow',
    inputSchema: VisualSearchInputSchema,
    outputSchema: VisualSearchOutputSchema,
  },
  async input => {
    const {output} = await visualSearchPrompt(input);
    return output!;
  }
);
