import { FetchRideMetricsResult } from "../../types/types";

export const fetchRideMetrics = async (token: string, rideid: number): Promise<FetchRideMetricsResult> => {
  try {
    const response = await fetch(`http://localhost:3000/ride/metrics/${rideid}`, {
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
