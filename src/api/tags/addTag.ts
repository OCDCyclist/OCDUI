import { FetchTagsResult } from "../../types/types";

export const addTag = async (token: string, name: string, description: string ): Promise<FetchTagsResult> => {
  try {
    const response = await fetch('http://localhost:3000/user/addTag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 'name': name, 'description': description }),
    });

    if (response.ok) {
      const tags = await response.json();
      return { tags, error: null };
    } else {
      return { tags: [], error: 'Failed to add tag' };
    }
  } catch (error) {
    return { tags: [], error: 'Error adding tag: ' + (error instanceof Error ? error.message : error) };
  }
};
