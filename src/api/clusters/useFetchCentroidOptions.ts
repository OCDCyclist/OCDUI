import { useEffect, useState } from "react";
import { CentroidSelectorData } from "../../types/types";

export const useFetchCentroidOptions = (token: string) => {
  const [data, setData] = useState<CentroidSelectorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3000/cluster/distinctClusterCentroids', {
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
          setError("Failed to make cluster centroid option request");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch ( _error) {
        setError('Failed to read cluster centroid options');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};