import { useState, useCallback } from "react";
import { SimilarRidesSelectorData, FetchSimilarRidesResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFetchSimilarRides = () => {
  const [data, setData] = useState<FetchSimilarRidesResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilarRides = useCallback(async (token: string, rideid: SimilarRidesSelectorData) => {
    if (!rideid) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/cluster/getRidesByCentroid?clusterId=${rideid.rideid}`,
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
        setError("Failed to fetch similar rides data");
      }
    } catch {
      setError("Failed to fetch similar rides data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchClusterData: fetchSimilarRides };
};
