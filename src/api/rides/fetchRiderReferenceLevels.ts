import { FetchRiderReferenceLevelResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRiderReferenceLevels = async (token: string): Promise<FetchRiderReferenceLevelResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reference/categoryLevels`, {
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
