import { useEffect, useState, useCallback } from "react";
import { Goal } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFetchGoals(token: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/goals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
        setError(null);
      } else {
        setGoals([]);
        setError('Failed to fetch goals');
      }
    } catch (err) {
      setGoals([]);
      setError('Error fetching goals: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { goals, error, loading, refetch: fetchData };
}
