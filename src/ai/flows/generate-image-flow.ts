'use server';
/**
 * @fileOverview An AI image generator.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The main text prompt for the image.'),
  style: z.string().optional().describe('The artistic style of the image.'),
  ratio: z.string().optional().describe('The aspect ratio of the image.'),
  mood: z.string().optional().describe('The mood or atmosphere of the image.'),
  lighting: z.string().optional().describe('The lighting conditions of the image.'),
  colors: z.string().optional().describe('The color palette of the image.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUris: z
    .array(z.string())
    .describe('The generated images as data URIs.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const fullPrompt = [
        input.prompt,
        input.style && `Style: ${input.style}`,
        input.mood && `Mood: ${input.mood}`,
        input.lighting && `Lighting: ${input.lighting}`,
        input.colors && `Colors: ${input.colors}`,
    ].filter(Boolean).join('. ');

    const generationRequest: any = {
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: fullPrompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    };

    if (input.ratio) {
        generationRequest.aspectRatio = input.ratio;
    }

    // Create 4 parallel generation requests
    const imagePromises = Array(4).fill(null).map(() => ai.generate(generationRequest));

    const results = await Promise.all(imagePromises);

    const imageDataUris = results.map(result => {
        if (!result.media?.url) {
            const errorMessage = result.candidates[0]?.finishReasonMessage || 'An unknown error occurred.';
            throw new Error(`An image generation request failed to return an image. Reason: ${errorMessage}`);
        }
        return result.media.url;
    });

    return { imageDataUris };
  }
);
