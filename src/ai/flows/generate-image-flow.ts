
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
  error: z.string().optional().describe('An error message if image generation failed.'),
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
    const promptParts = [
        `Primary Subject: ${input.prompt}.`,
        `You are a master digital artist. Create a visually stunning image based *strictly* on the following creative controls.`
    ];

    if (input.style) {
        promptParts.push(`Artistic Style: This is the most critical instruction. The image must be in a '${input.style}' style.`);
    }
    if (input.mood) {
        promptParts.push(`Overall Mood: The entire scene must evoke a '${input.mood}' feeling. This should influence the colors, lighting, and composition.`);
    }
    if (input.lighting) {
        promptParts.push(`Lighting: The lighting is a dominant feature. It must be '${input.lighting}' lighting.`);
    }
    if (input.colorPalette && input.colorPalette !== 'Default') {
        promptParts.push(`Color Palette: The color scheme must be strictly based on a '${input.colorPalette}' palette.`);
    }
    if (input.aspectRatio) {
        const ratio = input.aspectRatio.match(/\((.*?)\)/)?.[1] || input.aspectRatio;
        promptParts.push(`The final image must have an aspect ratio of ${ratio}.`);
    }

    if (input.quality === '4K Quality') {
        promptParts.push('Final Output Requirements: 4K, ultra-high resolution, photorealistic detail, professional photography quality, extremely detailed, intricate, sharp focus.');
    } else {
        promptParts.push('Final Output Requirements: High quality, professional, detailed, clear focus.');
    }
    
    const fullPrompt = promptParts.join(' ');


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
                    threshold: 'BLOCK_NONE',
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
        const finalErrorMessage = errorMessages.join(' ') || 'Image generation failed. This might be due to a connection issue, an invalid API key, or a prompt that violates safety policies. Please try again.';
        console.error('Image Generation Flow Error:', finalErrorMessage);
        return { imageDataUris: [], error: finalErrorMessage };
    }

    return { imageDataUris, error: undefined };
  }
);
