import { useEffect, useState } from "react";
import { CentroidSelectorData, RideDataWithTagsClusters } from "../../types/types";

export const useFetchClusterData = (token: string, centroid: CentroidSelectorData) => {
  const [data, setData] = useState<RideDataWithTagsClusters[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if(!centroid){
        setLoading(false);
      }
      try {
        const response = await fetch(`http://localhost:3000/cluster/getRidesByCentroid?startYear=${centroid.clusterid}`, {
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
  }, [centroid]);

  return { data, loading, error };
};
