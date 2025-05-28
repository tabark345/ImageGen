
"use client";

import { useImageGallery } from '@/hooks/use-image-gallery';
import { ImageCard } from '@/components/image-card'; // Reusing ImageCard for consistency, download will work.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function GalleryClient() {
  const { gallery, removeImageFromGallery, isGalleryLoaded } = useImageGallery();
  const { toast } = useToast();

  const handleRemoveImage = (imageId: string) => {
    removeImageFromGallery(imageId);
    toast({ title: "Image removed", description: "The image has been removed from your gallery." });
  };

  if (!isGalleryLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.Spinner className="h-12 w-12 text-primary" />
        <p className="ml-4 text-lg">Loading your gallery...</p>
      </div>
    );
  }

  if (gallery.length === 0) {
    return (
      <Card className="text-center py-12 shadow-lg">
        <CardHeader>
          <Icons.Gallery className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="text-2xl text-primary">Your Gallery is Empty</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg">
            Start creating some amazing images with our AI generator, and they&apos;ll appear here!
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Your Creations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {gallery.map((image) => (
          <div key={image.id} className="relative group">
            <ImageCard
              url={image.url}
              aspectRatio={image.aspectRatio}
              resolution={image.resolution}
              prompt={image.prompt}
              refinedPrompt={image.refinedPrompt}
              // No onSaveToGallery needed here as it's already saved
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Remove image from gallery"
                >
                  <Icons.Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete this image from your gallery. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleRemoveImage(image.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
}
