import { useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useClusterCentroidUpdates = (token: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postAction = async (endpoint: string, payload: object) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/cluster/centroid/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText} status: ${response.status}`);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const setName = (payload: {clusterId: string | number, cluster: number, name: string}) => postAction('name', payload);
  const setColor = (payload: {clusterId: string | number, cluster: number, color: string}) => postAction('color', payload);

  return { setName, setColor, loading, error };
};
