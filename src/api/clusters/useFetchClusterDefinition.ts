import { useEffect, useState } from "react";
import { ClusterDefinition } from "../../types/types";

export const useFetchClusterDefinition = (token: string, clusterId: number) => {
  const [data, setData] = useState<ClusterDefinition>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if( clusterId === -1){
          const newClusterDefinition: ClusterDefinition = {
            clusterid: -1,
            startyear: 2025,
            endyear: 2025,
            clustercount: 4,
            fields: "distance,speedavg,elevationgain,hravg,powernormalized",
            active: false,
          }
          setData(newClusterDefinition);
          setLoading(false);
          return;
        }
        const response = await fetch(`http://localhost:3000/cluster/clusterDefinition?clusterId=${clusterId}`, {
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
          setError("Failed to make cluster definition request");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch ( _error) {
        setError('Failed to read cluster centroids');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
