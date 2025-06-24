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
        input.style && `in a ${input.style} style`,
        input.ratio && `with a ${input.ratio} aspect ratio`,
        input.mood && `with a ${input.mood} mood`,
        input.lighting && `using ${input.lighting} lighting`,
        input.colors && `with a ${input.colors} color palette`,
    ].filter(Boolean).join(', ');

    const imageDataUris: string[] = [];

    // Generate 4 images sequentially to avoid rate-limiting issues.
    for (let i = 0; i < 4; i++) {
        const result = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: fullPrompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        const { media } = result;
        if (!media?.url) {
            const errorMessage = result.candidates[0]?.finishReasonMessage || 'An unknown error occurred during image generation.';
            throw new Error(`Image generation failed: ${errorMessage}`);
        }
        imageDataUris.push(media.url);
    }
    
    return { imageDataUris };
  }
);