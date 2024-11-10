import { FetchTagsResult } from "../../types/types";

export const saveTagAssignments = async (token: string, locationId: number, assignmentid: number, tags: string[]): Promise<FetchTagsResult> => {
  try {
    const response = await fetch('http://localhost:3000/user/saveTagAssignments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ locationId, assignmentid, tags}),
    });

    if (response.ok) {
      const tags = await response.json();
      return { tags, error: null };
    } else {
      return { tags: [], error: 'Failed to save tag assignments' };
    }
  } catch (error) {
    return { tags: [], error: 'Error saving tag assignments: ' + (error instanceof Error ? error.message : error) };
  }
};
