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
        input.mood && `with a ${input.mood} mood`,
        input.lighting && `using ${input.lighting} lighting`,
        input.colors && `with a ${input.colors} color palette`,
    ].filter(Boolean).join(', ');
    
    // Using a powerful Imagen model available through Vertex AI to ensure high-quality results.
    const imageModel = 'imagegeneration@006';

    const generationRequest: any = {
        model: imageModel,
        prompt: fullPrompt,
        // Request 4 images to be generated in a single batch call for efficiency.
        candidates: 4,
    };

    if (input.ratio) {
        // Genkit normalizes aspect ratio formats for the underlying model.
        generationRequest.aspectRatio = input.ratio;
    }

    const result = await ai.generate(generationRequest);
    const imageDataUris = result.candidates.map(candidate => {
        if (!candidate.media?.url) {
            const errorMessage = candidate.finishReasonMessage || 'An unknown error occurred.';
            throw new Error(`An image generation request failed to return an image. Reason: ${errorMessage}`);
        }
        return candidate.media.url;
    });
    
    return { imageDataUris };
  }
);
