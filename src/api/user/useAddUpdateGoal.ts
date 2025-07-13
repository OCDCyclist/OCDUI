import { useState } from "react";
import { Goal } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useAddUpdateGoal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUpdateGoal = async (goal: Goal): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/user/addUpdateGoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goal),
      });

      if (!res.ok) throw new Error("Failed to add or update goal.");
      setLoading(false);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error adding or updating goal.");
      }
      setLoading(false);
      return false;
    }
  };

  return { addUpdateGoal, loading, error };
}
