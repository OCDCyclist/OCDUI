import { FetchTagsResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTags = async (token: string): Promise<FetchTagsResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/tags`, {
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
