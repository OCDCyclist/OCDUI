import { FetchRideSegmentEffortResult } from "../../types/types";

export const fetchRideSegmentEfforts = async (token: string, rideid: number): Promise<FetchRideSegmentEffortResult> => {
  try {
    const response = await fetch(`http://localhost:3000/ride/segments/${rideid}`, {
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
