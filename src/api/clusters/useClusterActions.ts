import { useState } from 'react';
import { useFetchAllClusterDefinitions } from './useFetchAllClusterDefinitions';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useClusterActions = (token: string) => {
  const { refetch } = useFetchAllClusterDefinitions(token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postAction = async (endpoint: string, id: string | number, payload?: object) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/cluster/${endpoint}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (endpoint === 'setActive') {
        // Re-fetch the data if needed
        await refetch();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const recalculate = (id: string | number) => postAction('recalculate', id);
  const setActive = (id: string | number) => postAction('setActive', id);

  return { recalculate, setActive, loading, error };
};
