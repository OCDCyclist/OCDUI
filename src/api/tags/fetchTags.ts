import { FetchTagsResult } from "../../types/types";

export const fetchTags = async (token: string): Promise<FetchTagsResult> => {
  try {
    const response = await fetch('http://localhost:3000/user/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      },
    });

    if (response.ok) {
      const tags = await response.json();
      return { tags, error: null };
    } else {
      return { tags: [], error: 'Failed to fetch tags' };
    }
  } catch (error) {
    return { tags: [], error: 'Error fetching tags: ' + (error instanceof Error ? error.message : error) };
  }
};
