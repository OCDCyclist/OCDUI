import { useState, useEffect, useCallback } from "react";
import { ClusterDefinition } from "../../types/types";

export const useFetchAllClusterDefinitions = (token: string) => {
  const [data, setData] = useState<ClusterDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define the fetch logic
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/cluster/getAllClusterDefinitions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        setError("Failed to make all cluster definition request");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Failed to read all cluster definitions');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return the refetch function along with the other states
  return { data, loading, error, refetch: fetchData };
};
