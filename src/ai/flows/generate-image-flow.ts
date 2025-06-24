
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
  quality: z.string().optional().describe('The desired image quality.'),
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

    if (input.quality === '4K Quality') {
        fullPrompt += ', 4K, ultra-high resolution, photorealistic, ultra-detailed, professional photography.';
    } else {
        fullPrompt += '. Highly detailed, professional quality.';
    }

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

    const results = await Promise.allSettled(generationPromises);
    const imageDataUris: string[] = [];
    const errorMessages: string[] = [];

    for (const result of results) {
        if (result.status === 'fulfilled') {
            const generationResult = result.value;
            const { media } = generationResult;
            if (media?.url) {
                imageDataUris.push(media.url);
            } else {
                const finishReason = generationResult.candidates[0]?.finishReason;
                let errorMessage = generationResult.candidates[0]?.finishReasonMessage || 'An unknown error occurred during image generation.';
                if (finishReason === 'SAFETY') {
                  errorMessage = 'One or more images were blocked due to safety settings.';
                } else if (finishReason === 'RECITATION') {
                  errorMessage = 'One or more prompts were blocked for containing recited content.';
                }
                if (!errorMessages.includes(errorMessage)) {
                    errorMessages.push(errorMessage);
                }
            }
        } else {
            const errorMessage = result.reason instanceof Error ? result.reason.message : String(result.reason);
            if (!errorMessages.includes(errorMessage)) {
                errorMessages.push(`Image generation failed: ${errorMessage}`);
            }
        }
    }
    
    if (imageDataUris.length === 0) {
        throw new Error(errorMessages.join(' ') || 'Image generation failed. This might be due to a connection issue, an invalid API key, or a prompt that violates safety policies. Please try again.');
    }

    return { imageDataUris };
  }
);
