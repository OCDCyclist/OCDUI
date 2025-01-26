import { FetchUserZoneResult } from "../../types/types";

export const fetchUserZones = async (token: string): Promise<FetchUserZoneResult> => {
  try {
    const response = await fetch('http://localhost:3000/user/zones', {
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
