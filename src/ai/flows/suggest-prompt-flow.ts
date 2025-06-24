'use server';
/**
 * @fileOverview An AI-powered prompt suggestion generator.
 *
 * - suggestPrompts - A function that handles the prompt suggestion process.
 * - SuggestPromptsInput - The input type for the suggestPrompts function.
 * - SuggestPromptsOutput - The return type for the suggestPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPromptsInputSchema = z.object({
  idea: z.string().describe('A simple idea or keyword from the user.'),
});
export type SuggestPromptsInput = z.infer<typeof SuggestPromptsInputSchema>;

const SuggestPromptsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of 3 detailed and creative prompt suggestions.'),
});
export type SuggestPromptsOutput = z.infer<typeof SuggestPromptsOutputSchema>;

export async function suggestPrompts(
  input: SuggestPromptsInput
): Promise<SuggestPromptsOutput> {
  return suggestPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptsPrompt',
  input: {schema: SuggestPromptsInputSchema},
  output: {schema: SuggestPromptsOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert creative assistant for an advanced AI image generator. Your task is to take a user's simple idea or keyword and transform it into 3 distinct, highly detailed, and visually inspiring prompts.

Each prompt should be a complete paragraph, rich with descriptive language covering subjects, scenery, art style, mood, and lighting to help the user generate incredible images.

User's idea: {{{idea}}}

Based on the idea, generate 3 prompt suggestions.`,
});

const suggestPromptsFlow = ai.defineFlow(
  {
    name: 'suggestPromptsFlow',
    inputSchema: SuggestPromptsInputSchema,
    outputSchema: SuggestPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
