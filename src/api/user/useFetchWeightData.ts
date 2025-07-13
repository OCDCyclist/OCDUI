import { useState, useEffect } from "react";
import { FetchWeightDataResult } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFetchWeightData = (token: string, period: string): FetchWeightDataResult => {
  const [weightData, setWeightData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/weight/${period}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rider weight data");
        }

        const weightData = await response.json();
        setWeightData(weightData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        setWeightData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, period]);

  return { weightData, error, loading };
};