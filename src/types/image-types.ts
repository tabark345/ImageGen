
export interface GeneratedImage {
  url: string;
  aspectRatio: string;
  resolution: string;
}

export interface GalleryImage extends GeneratedImage {
  id: string;
  prompt: string;
  refinedPrompt?: string;
  createdAt: string;
}
