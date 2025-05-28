
"use client";

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { refinePromptAction, proposeImageVariationsAction } from '@/lib/actions';
import type { GeneratedImage } from '@/types/image-types';
import type { ProposeImageVariationsOutput } from '@/ai/flows/propose-image-variations';

export function useImageGeneration() {
  const [prompt, setPrompt] = useState<string>("");
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<ProposeImageVariationsOutput>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateImages = async (currentPrompt: string) => {
    if (!currentPrompt.trim()) {
      toast({ title: "Prompt is empty", description: "Please enter a prompt to generate images.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setRefinedPrompt(null);
    setGeneratedImages([]);

    try {
      // Step 1: Refine the prompt
      toast({ title: "Refining prompt...", description: "Our AI is working on making your prompt even better." });
      const refineResult = await refinePromptAction({ prompt: currentPrompt });
      setRefinedPrompt(refineResult.refinedPrompt);
      toast({ title: "Prompt refined!", description: "Generating image variations..." });
      
      // Step 2: Propose image variations using the refined prompt
      const variationsResult = await proposeImageVariationsAction({ prompt: refineResult.refinedPrompt });
      setGeneratedImages(variationsResult);
      if (variationsResult.length === 0) {
        toast({ title: "No images generated", description: "The AI couldn't generate images for this prompt. Try a different one.", variant: "default" });
      } else {
         toast({ title: "Images generated!", description: "Your masterpieces are ready." });
      }

    } catch (err) {
      console.error("Image generation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    refinedPrompt,
    generatedImages,
    isLoading,
    error,
    handleGenerateImages,
  };
}
