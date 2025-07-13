import { FetchPowerCurveResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRiderPowerCurve = async (token: string): Promise<FetchPowerCurveResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rider/powercurve`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const powerCurve = await response.json();
      return { powerCurve, error: null };
    } else {
      return { powerCurve: [], error: 'Failed to fetch rider power curve' };
    }
  } catch (error) {
    return { powerCurve: [], error: 'Error fetching rider power curve: ' + (error instanceof Error ? error.message : error) };
  }
};
