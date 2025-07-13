import { useEffect, useState, useCallback } from "react";
import { Bike } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFetchBikes(token: string) {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gear/bikes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBikes(data);
        setError(null);
      } else {
        setBikes([]);
        setError('Failed to fetch bikes');
      }
    } catch (err) {
      setBikes([]);
      setError('Error fetching bikes: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { bikes, error, loading, refetch: fetchData };
}
