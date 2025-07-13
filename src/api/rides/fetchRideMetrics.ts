import { FetchRideMetricsResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRideMetrics = async (token: string, rideid: number): Promise<FetchRideMetricsResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ride/metrics/${rideid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      },
    });

    if (response.ok) {
      const rideMetrics = await response.json();
      return { rideMetrics, error: null };
    } else {
      return { rideMetrics: [], error: 'Failed to fetch ride metrics' };
    }
  } catch (error) {
    return { rideMetrics: [], error: 'Error fetching ride metrics: ' + (error instanceof Error ? error.message : error) };
  }
};
