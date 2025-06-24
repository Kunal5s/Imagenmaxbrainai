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
    
    // We will generate 4 images by calling the model 4 times in parallel.
    const imagePromises = Array(4).fill(null).map(async () => {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: fullPrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          // Aspect ratio is not directly supported by this model in this way.
          // The model will determine the best aspect ratio based on the prompt.
        },
      });

      if (!media?.url) {
        throw new Error('An image generation request failed to return an image.');
      }
      return media.url;
    });

    const imageDataUris = await Promise.all(imagePromises);
    
    return { imageDataUris };
  }
);
