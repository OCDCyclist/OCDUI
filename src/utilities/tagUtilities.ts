import { Tagable } from "../types/types";

export const getUniqueTags = (segments: Tagable[]): string[] => {
    const tagSet = new Set<string>();

    segments.forEach(segment => {
      if (segment.tags && segment.tags.trim().length > 0) {
        segment.tags.split(',').forEach(tag => tagSet.add(tag));
      }
    });

    return Array.from(tagSet);
  };
