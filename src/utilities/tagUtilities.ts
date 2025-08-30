import { Tagable } from "../types/types";

export const getUniqueTags = (tagables: Tagable[]): string[] => {
  const tagSet = new Set<string>();

  tagables.forEach(tagable => {
    if (tagable?.tags && tagable.tags.trim().length > 0) {
      tagable.tags.split(',').forEach(tag => tagSet.add(tag));
    }
    if (tagable?.cluster && tagable.cluster.trim().length > 0) {
      tagable.cluster.split(',').forEach(tag => tagSet.add(tag));
    }
  });

  return Array.from(tagSet);
};

export const filterByTag = <T extends Tagable>(
  tagables: T[],
  filterTags: string[]
): T[] => {
  if (filterTags.length === 0) return tagables;
  return tagables.filter(segment => {
    const segmentTags = segment.tags ? segment.tags.trim().split(",") : [];
    return filterTags.every(tag => segmentTags.includes(tag));
  });
};