import { useState } from 'react';
import { ClusterDefinition } from '../../types/types';

export const useClusterDefinitionUpdates = (token: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postAction = async (payload: object) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3000/cluster/update`, {
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
