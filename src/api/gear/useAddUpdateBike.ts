import { useState } from "react";
import { Bike } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useAddUpdateBike() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUpdateBike = async (bike: Bike): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/gear/addUpdateBike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bike),
      });

      if (!res.ok) throw new Error("Failed to add or update bike.");
      setLoading(false);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error adding or updating bike.");
      }
      setLoading(false);
      return false;
    }
  };

  return { addUpdateBike, loading, error };
}
