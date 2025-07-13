import { FetchRideSegmentEffortResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRideSegmentEfforts = async (token: string, rideid: number): Promise<FetchRideSegmentEffortResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ride/segments/${rideid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const segmentEfforts = await response.json();
      return { segmentEfforts, error: null };
    } else {
      return { segmentEfforts: [], error: 'Failed to fetch segment efforts' };
    }
  } catch (error) {
    return { segmentEfforts: [], error: 'Error fetching ride segment efforts: ' + (error instanceof Error ? error.message : error) };
  }
};
