import { FetchUserSettingResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserSettings = async (token: string): Promise<FetchUserSettingResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      },
    });

    if (response.ok) {
      const settings = await response.json();
      return { settings, error: null };
    } else {
      return { settings: [], error: 'Failed to fetch user settings' };
    }
  } catch (error) {
    return { settings: [], error: 'Error fetching user settings: ' + (error instanceof Error ? error.message : error) };
  }
};
