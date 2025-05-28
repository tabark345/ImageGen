
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { ImageCard } from '@/components/image-card';
import { useImageGeneration } from '@/hooks/use-image-generation';
import { useImageGallery } from '@/hooks/use-image-gallery';
import { useToast } from "@/hooks/use-toast";
import type { GeneratedImage } from '@/types/image-types';

export function ImageGeneratorClient() {
  const {
    prompt,
    setPrompt,
    refinedPrompt,
    generatedImages,
    isLoading,
    error,
    handleGenerateImages,
  } = useImageGeneration();
  const { addImageToGallery } = useImageGallery();
  const { toast } = useToast();
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGenerateImages(prompt);
  };

  const handleSaveToGallery = (image: GeneratedImage, originalPrompt: string, currentRefinedPrompt: string | null) => {
    const imageId = image.url; // Use URL as a temporary ID for saving state
    setSavingStates(prev => ({ ...prev, [imageId]: true }));
    try {
      addImageToGallery({ ...image, prompt: originalPrompt, refinedPrompt: currentRefinedPrompt || undefined });
      toast({ title: "Image saved!", description: "The image has been added to your gallery." });
    } catch (err) {
      toast({ title: "Save failed", description: "Could not save image to gallery.", variant: "destructive" });
    } finally {
      setSavingStates(prev => ({ ...prev, [imageId]: false }));
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary flex items-center justify-center gap-2">
            <Icons.Logo className="w-8 h-8" /> ImagiGen AI
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Turn your text prompts into stunning visuals. Describe your vision, and let our AI bring it to life!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A futuristic cityscape at sunset, synthwave style"
                className="min-h-[100px] text-base focus:ring-2 focus:ring-primary"
                disabled={isLoading}
                aria-label="Image generation prompt"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.Spinner className="mr-2 h-5 w-5" /> Generating...
                </>
              ) : (
                <>
                  <Icons.Bot className="mr-2 h-5 w-5" /> Generate Images
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center my-8">
          <Icons.Spinner className="h-12 w-12 mx-auto text-primary" />
          <p className="mt-2 text-lg text-muted-foreground">Hang tight, magic is happening...</p>
        </div>
      )}

      {error && (
        <Card className="my-8 border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Generation Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {refinedPrompt && !isLoading && (
        <Card className="my-8 bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-xl text-secondary-foreground">Refined Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="italic text-secondary-foreground/80">{refinedPrompt}</p>
          </CardContent>
        </Card>
      )}

      {generatedImages.length > 0 && !isLoading && (
        <div className="my-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-primary">Generated Masterpieces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((image, index) => (
              <ImageCard
                key={image.url + index} // Data URI can be long, index ensures uniqueness if URLs are somehow same (unlikely)
                {...image}
                prompt={prompt}
                refinedPrompt={refinedPrompt}
                onSaveToGallery={() => handleSaveToGallery(image, prompt, refinedPrompt)}
                isSavingToGallery={savingStates[image.url]}
              />
            ))}
          </div>
        </div>
      )}
       {!isLoading && !error && generatedImages.length === 0 && refinedPrompt && (
         <Card className="my-8">
           <CardHeader>
             <CardTitle className="text-xl text-center">Nothing to Show Yet</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-center text-muted-foreground">
                The AI tried its best but couldn&apos;t generate images for the refined prompt: <span className="italic">{refinedPrompt}</span>. 
                Please try a different initial prompt or adjust your current one.
             </p>
           </CardContent>
         </Card>
       )}
    </div>
  );
}
