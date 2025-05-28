'use server';

/**
 * @fileOverview Image variations proposal flow.
 *
 * This file defines a Genkit flow that takes a text prompt and generates
 * multiple image variations with different aspect ratios and resolutions.
 *
 * @remarks
 * - proposeImageVariations - A function that handles the image variations proposal process.
 * - ProposeImageVariationsInput - The input type for the proposeImageVariations function.
 * - ProposeImageVariationsOutput - The return type for the proposeImageVariations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProposeImageVariationsInputSchema = z.object({
  prompt: z.string().describe('The text prompt to use for generating image variations.'),
});
export type ProposeImageVariationsInput = z.infer<typeof ProposeImageVariationsInputSchema>;

const ImageVariationSchema = z.object({
  url: z.string().describe('The data URI of the generated image.'),
  aspectRatio: z.string().describe('The aspect ratio of the generated image (e.g., "16:9").'),
  resolution: z.string().describe('The resolution of the generated image (e.g., "1920x1080").'),
});

const ProposeImageVariationsOutputSchema = z.array(ImageVariationSchema).describe('An array of image variations.');
export type ProposeImageVariationsOutput = z.infer<typeof ProposeImageVariationsOutputSchema>;

export async function proposeImageVariations(input: ProposeImageVariationsInput): Promise<ProposeImageVariationsOutput> {
  return proposeImageVariationsFlow(input);
}

const proposeImageVariationsFlow = ai.defineFlow(
  {
    name: 'proposeImageVariationsFlow',
    inputSchema: ProposeImageVariationsInputSchema,
    outputSchema: ProposeImageVariationsOutputSchema,
  },
  async input => {
    const variations = await Promise.all([
      generateImageVariation(input.prompt, '1:1', '512x512'),
      generateImageVariation(input.prompt, '16:9', '1920x1080'),
      generateImageVariation(input.prompt, '9:16', '1080x1920'),
    ]);

    return variations;
  }
);

async function generateImageVariation(
  prompt: string,
  aspectRatio: string,
  resolution: string
): Promise<{url: string; aspectRatio: string; resolution: string}> {
  const {media} = await ai.generate({
    model: 'googleai/gemini-2.0-flash-exp',
    prompt: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  return {url: media.url, aspectRatio, resolution};
}
