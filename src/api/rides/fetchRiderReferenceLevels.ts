import { FetchRiderReferenceLevelResult } from "../../types/types";

export const fetchRiderReferenceLevels = async (token: string): Promise<FetchRiderReferenceLevelResult> => {
  try {
    const response = await fetch(`http://localhost:3000/reference/categoryLevels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const referenceLevels = await response.json();
      return { referenceLevels, error: null };
    } else {
      return { referenceLevels: [], error: 'Failed to fetch rider reference levels' };
    }
  } catch (error) {
    return { referenceLevels: [], error: 'Error fetching rider referenceLevels: ' + (error instanceof Error ? error.message : error) };
  }
};
