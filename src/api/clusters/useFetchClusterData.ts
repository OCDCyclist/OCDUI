import { useState, useCallback } from "react";
import { CentroidSelectorData, RideDataWithTagsClusters } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFetchClusterData = () => {
  const [data, setData] = useState<RideDataWithTagsClusters[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClusterData = useCallback(async (token: string, centroid: CentroidSelectorData) => {
    if (!centroid) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/cluster/getRidesByCentroid?clusterId=${centroid.clusterid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        setError("Failed to fetch cluster data");
      }
    } catch {
      setError("Failed to fetch cluster data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchClusterData };
};
