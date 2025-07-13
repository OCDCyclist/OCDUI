import { FetchUserZoneResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserZones = async (token: string): Promise<FetchUserZoneResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/zones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      },
    });

    if (response.ok) {
      const zones = await response.json();
      return { zones, error: null };
    } else {
      return { zones: [], error: 'Failed to fetch zones' };
    }
  } catch (error) {
    return { zones: [], error: 'Error fetching zones: ' + (error instanceof Error ? error.message : error) };
  }
};
