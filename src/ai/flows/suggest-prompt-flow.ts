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
  prompt: `You are a creative assistant for an AI image generator called Imagen Max BrainAi.
Your task is to take a user's simple idea and expand it into 3 diverse, detailed, and visually rich prompts.
The prompts should be descriptive and imaginative to help the user generate stunning and unique images.
Each suggestion should be a complete, self-contained prompt.

User's idea: {{{idea}}}

Provide your suggestions in the required output format.`,
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
