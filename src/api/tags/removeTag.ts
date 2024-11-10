import { FetchTagsResult } from "../../types/types";

export const removeTag = async (token: string): Promise<FetchTagsResult> => {
  try {
    const response = await fetch('http://localhost:3000/user/removeTag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const tags = await response.json();
      return { tags, error: null };
    } else {
      return { tags: [], error: 'Failed to remove tag' };
    }
  } catch (error) {
    return { tags: [], error: 'Error removing tag: ' + (error instanceof Error ? error.message : error) };
  }
};
