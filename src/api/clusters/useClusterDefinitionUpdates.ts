import { useState } from 'react';
import { ClusterDefinition } from '../../types/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useClusterDefinitionUpdates = (token: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postAction = async (payload: object) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/cluster/update`, {
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

  const setClusterDefinition = (payload: ClusterDefinition) => postAction(payload);

  return { setClusterDefinition, loading, error };
};
