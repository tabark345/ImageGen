
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { GalleryImage } from '@/types/image-types';

const GALLERY_STORAGE_KEY = 'imagiGenGallery';

export function useImageGallery() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isGalleryLoaded, setIsGalleryLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedGallery = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (storedGallery) {
        setGallery(JSON.parse(storedGallery));
      }
    } catch (error) {
      console.error("Failed to load gallery from localStorage:", error);
      // Optionally clear corrupted storage
      // localStorage.removeItem(GALLERY_STORAGE_KEY);
    }
    setIsGalleryLoaded(true);
  }, []);

  const saveGallery = useCallback((updatedGallery: GalleryImage[]) => {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedGallery));
    } catch (error) {
      console.error("Failed to save gallery to localStorage:", error);
    }
  }, []);

  const addImageToGallery = useCallback((image: Omit<GalleryImage, 'id' | 'createdAt'>) => {
    setGallery(prevGallery => {
      const newImage: GalleryImage = {
        ...image,
        id: Date.now().toString() + Math.random().toString(36).substring(2,9), // Simple unique ID
        createdAt: new Date().toISOString(),
      };
      const updatedGallery = [newImage, ...prevGallery];
      saveGallery(updatedGallery);
      return updatedGallery;
    });
  }, [saveGallery]);

  const removeImageFromGallery = useCallback((imageId: string) => {
    setGallery(prevGallery => {
      const updatedGallery = prevGallery.filter(img => img.id !== imageId);
      saveGallery(updatedGallery);
      return updatedGallery;
    });
  }, [saveGallery]);

  return { gallery, addImageToGallery, removeImageFromGallery, isGalleryLoaded };
}
