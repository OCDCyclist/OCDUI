import { useEffect, useState } from "react";
import { RideDataWithTagsClusters } from "../../types/types";

export const useFetchClusterData = (token: string, startYear: number, endYear:number) => {
  const [data, setData] = useState<RideDataWithTagsClusters[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/getRidesByCentroid?startYear=${startYear}&endYear=${endYear}`, {
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
          setError("Failed to fetch cluster data");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch ( _erroe) {
        setError('Failed to fetch cluster data');
      } finally {
        setLoading(false); // Always stop the loading state
      }
    };

    fetchData();
  }, [startYear, endYear]);

  return { data, loading, error };
};
