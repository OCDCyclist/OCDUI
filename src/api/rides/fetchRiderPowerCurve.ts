import { FetchRiderPowerCurveResult } from "../../types/types";

export const fetchRiderPowerCurve = async (token: string): Promise<FetchRiderPowerCurveResult> => {
  try {
    const response = await fetch(`http://localhost:3000/rider/powercurve`, {
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
