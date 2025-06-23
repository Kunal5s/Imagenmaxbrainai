'use server';

/**
 * @fileOverview AI-powered content modification suggestions based on displayed images, user preferences, and industry best practices.
 *
 * - suggestModifications - A function that handles the process of suggesting modifications.
 * - SuggestModificationsInput - The input type for the suggestModifications function.
 * - SuggestModificationsOutput - The return type for the suggestModifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestModificationsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A data URI of the displayed image, including MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userPreferences: z.string().describe('A description of the user\u2019s aesthetic preferences.'),
  industryBestPractices: z.string().describe('Relevant industry best practices for visual content.'),
});
export type SuggestModificationsInput = z.infer<typeof SuggestModificationsInputSchema>;

const SuggestModificationsOutputSchema = z.object({
  suggestedModifications: z
    .string()
    .describe('AI-powered suggestions for visual content modifications.'),
});
export type SuggestModificationsOutput = z.infer<typeof SuggestModificationsOutputSchema>;

export async function suggestModifications(
  input: SuggestModificationsInput
): Promise<SuggestModificationsOutput> {
  return suggestModificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestModificationsPrompt',
  input: {schema: SuggestModificationsInputSchema},
  output: {schema: SuggestModificationsOutputSchema},
  prompt: `You are an AI assistant designed to provide visual content modification suggestions.

Analyze the displayed image, considering the user's stated preferences and industry best practices, to suggest improvements.

Image Data URI: {{media url=imageDataUri}}
User Preferences: {{{userPreferences}}}
Industry Best Practices: {{{industryBestPractices}}}

Based on this information, what visual content modifications would you suggest?`,
});

const suggestModificationsFlow = ai.defineFlow(
  {
    name: 'suggestModificationsFlow',
    inputSchema: SuggestModificationsInputSchema,
    outputSchema: SuggestModificationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
