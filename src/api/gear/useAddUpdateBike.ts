import { useState } from "react";
import { Bike } from "../../types/types";

export function useAddUpdateBike() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUpdateBike = async (bike: Bike): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/gear/addUpdateBike", {
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
