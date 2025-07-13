// src/hooks/useAddUserSettingValue.ts
import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useAddUserSettingValue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addValue = async (property: string, value: string | number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/user/addUserSettingValue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ property, value }),
      });

      if (!res.ok) throw new Error("Failed to add user setting value.");
      setLoading(false);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error adding user setting value.");
      }
      setLoading(false);
      return false;
    }
  };

  return { addValue, loading, error };
}
