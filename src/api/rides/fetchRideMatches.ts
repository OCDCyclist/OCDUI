import { FetchRideMatchesResult } from "../../types/types";

export const fetchRideMatches = async (token: string, rideid: number): Promise<FetchRideMatchesResult> => {
  try {
    const response = await fetch(`http://localhost:3000/ride/matches/${rideid}`, {
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
