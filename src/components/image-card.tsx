
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import type { GeneratedImage } from '@/types/image-types';

interface ImageCardProps extends GeneratedImage {
  prompt: string;
  refinedPrompt?: string | null;
  onSaveToGallery?: () => void;
  isSavingToGallery?: boolean;
}

export function ImageCard({ url, aspectRatio, resolution, prompt, refinedPrompt, onSaveToGallery, isSavingToGallery }: ImageCardProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    // Extract file extension from data URI if possible, default to png
    const mimeTypeMatch = url.match(/^data:(image\/([a-zA-Z]+));base64,/);
    const extension = mimeTypeMatch && mimeTypeMatch[2] ? mimeTypeMatch[2] : 'png';
    link.download = `imagigen_${prompt.substring(0, 20).replace(/\s+/g, '_') || 'image'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [width, height] = resolution.split('x').map(Number);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Aspect: {aspectRatio}</CardTitle>
        <CardDescription>Resolution: {resolution}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-0 bg-muted/50">
        {url ? (
          <Image
            src={url}
            alt={refinedPrompt || prompt || `Generated image ${aspectRatio} ${resolution}`}
            width={width || 400} // Provide default if parsing fails
            height={height || (width ? (width * (aspectRatio === '16:9' ? 9/16 : aspectRatio === '9:16' ? 16/9 : 1)) : 400) }
            className="object-contain max-w-full max-h-96"
            data-ai-hint="generated art"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-muted-foreground">
            <Icons.Image className="w-12 h-12" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4">
        <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
          <Icons.Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        {onSaveToGallery && (
          <Button onClick={onSaveToGallery} disabled={isSavingToGallery} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            {isSavingToGallery ? <Icons.Spinner className="mr-2 h-4 w-4" /> : <Icons.Gallery className="mr-2 h-4 w-4" />}
            Save to Gallery
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
