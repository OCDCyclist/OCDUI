import { FetchRideMatchesResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRideMatches = async (token: string, rideid: number): Promise<FetchRideMatchesResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ride/matches/${rideid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      },
    });

    if (response.ok) {
      const rideMatches = await response.json();
      return { rideMatches, error: null };
    } else {
      return { rideMatches: [], error: 'Failed to fetch ride matches' };
    }
  } catch (error) {
    return { rideMatches: [], error: 'Error fetching ride matches: ' + (error instanceof Error ? error.message : error) };
  }
};
