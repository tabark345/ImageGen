
"use server";

import { refineImagePrompt as refineImagePromptAI, type RefineImagePromptInput, type RefineImagePromptOutput } from "@/ai/flows/refine-image-prompt";
import { proposeImageVariations as proposeImageVariationsAI, type ProposeImageVariationsInput, type ProposeImageVariationsOutput } from "@/ai/flows/propose-image-variations";

export async function refinePromptAction(input: RefineImagePromptInput): Promise<RefineImagePromptOutput> {
  try {
    const result = await refineImagePromptAI(input);
    return result;
  } catch (error) {
    console.error("Error refining prompt:", error);
    // It's good practice to not expose raw error messages to the client
    // For a production app, you might log the error and return a generic message
    if (error instanceof Error) {
      throw new Error(`Failed to refine prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while refining the prompt.");
  }
}

export async function proposeImageVariationsAction(input: ProposeImageVariationsInput): Promise<ProposeImageVariationsOutput> {
  try {
    const result = await proposeImageVariationsAI(input);
    return result;
  } catch (error) {
    console.error("Error proposing image variations:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to propose image variations: ${error.message}`);
    }
    throw new Error("An unknown error occurred while proposing image variations.");
  }
}
