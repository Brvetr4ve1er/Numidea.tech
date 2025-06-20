'use server';

/**
 * @fileOverview Provides AI-powered sticker suggestions based on user activity or profile.
 *
 * - aiStickerSuggestions - A function that returns sticker suggestions.
 * - AiStickerSuggestionsInput - The input type for the aiStickerSuggestions function.
 * - AiStickerSuggestionsOutput - The return type for the aiStickerSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiStickerSuggestionsInputSchema = z.object({
  userActivity: z
    .string()
    .describe(
      'A description of the user\'s current activity, interests, or profile information.'
    ),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('The number of sticker suggestions to return.'),
});
export type AiStickerSuggestionsInput = z.infer<typeof AiStickerSuggestionsInputSchema>;

const AiStickerSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of sticker suggestions based on the user activity.'),
});
export type AiStickerSuggestionsOutput = z.infer<typeof AiStickerSuggestionsOutputSchema>;

export async function aiStickerSuggestions(input: AiStickerSuggestionsInput): Promise<AiStickerSuggestionsOutput> {
  return aiStickerSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStickerSuggestionsPrompt',
  input: {schema: AiStickerSuggestionsInputSchema},
  output: {schema: AiStickerSuggestionsOutputSchema},
  prompt: `Based on the user's current activity and interests: {{{userActivity}}}, suggest {{{numberOfSuggestions}}} stickers that they might like. Return the suggestions as a JSON array of strings.

For example:
{
  "suggestions": ["cool cat", "happy dog", "laughing seal"]
}
`,
});

const aiStickerSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiStickerSuggestionsFlow',
    inputSchema: AiStickerSuggestionsInputSchema,
    outputSchema: AiStickerSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
