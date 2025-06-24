
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
  aspectRatio: z.string().optional().describe('The aspect ratio of the image.'),
  mood: z.string().optional().describe('The emotional mood of the image.'),
  lighting: z.string().optional().describe('The lighting style of the image.'),
  colorPalette: z.string().optional().describe('A predefined color palette for the image.'),
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
    let fullPrompt = `${input.prompt}`;

    if (input.style) {
      fullPrompt += `, in the style of ${input.style}`;
    }
    if (input.mood) {
      fullPrompt += `, with a ${input.mood} mood`;
    }
    if (input.lighting) {
      fullPrompt += `, using ${input.lighting} lighting`;
    }
    if (input.aspectRatio) {
      fullPrompt += `, aspect ratio ${input.aspectRatio.match(/\((.*?)\)/)?.[1] || input.aspectRatio}`;
    }
    if (input.colorPalette) {
      fullPrompt += `, with a ${input.colorPalette} color palette`;
    }

    fullPrompt += '. Highly detailed, 8k, professional quality.'

    const imageDataUris: string[] = [];
    const generationPromises = Array(4).fill(null).map(() => 
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: fullPrompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
                 safetySettings: [
                  {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_ONLY_HIGH',
                  },
                  {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_ONLY_HIGH',
                  },
                  {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_ONLY_HIGH',
                  },
                  {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_ONLY_HIGH',
                  },
                ]
            },
        })
    );

    const results = await Promise.all(generationPromises);

    for (const result of results) {
        const { media } = result;
        if (!media?.url) {
            const finishReason = result.candidates[0]?.finishReason;
            let errorMessage = result.candidates[0]?.finishReasonMessage || 'An unknown error occurred during image generation.';
            if (finishReason === 'SAFETY') {
              errorMessage = 'The generated content was blocked due to safety settings. Please try a different prompt.';
            }
            throw new Error(`Image generation failed: ${errorMessage}`);
        }
        imageDataUris.push(media.url);
    }
    
    return { imageDataUris };
  }
);
