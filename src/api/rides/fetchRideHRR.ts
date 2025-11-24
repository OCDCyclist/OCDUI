import { FetchRideHRRsResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRideHRR = async (token: string, rideid: number): Promise<FetchRideHRRsResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ride/hrr/${rideid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const rideHRR = await response.json();
      return { rideHRR, error: null };
    } else {
      return { rideHRR: [], error: 'Failed to fetch ride HRR data' };
    }
  } catch (error) {
    return { rideHRR: [], error: 'Error fetching ride HRR data: ' + (error instanceof Error ? error.message : error) };
  }
};
