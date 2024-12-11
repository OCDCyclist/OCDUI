import { useCallback, useEffect, useState } from "react";
import { CentroidDefinition } from "../../types/types";

export const useFetchAllClusterCentroids = (token: string) => {
  const [data, setData] = useState<CentroidDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/cluster/allClusterCentroids', {
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
        setError("Failed to make all cluster centroids request");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Failed to read all cluster centroids');
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
