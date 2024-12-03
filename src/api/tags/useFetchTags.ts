import { useEffect, useState } from "react";
import { FetchTagsResult } from "../../types/types";

export const useFetchTagAssignments = (token: string) => {
  const [data, setData] = useState<FetchTagsResult | null>((null));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3000/user/tags', {
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
          setError("Failed to make tag assignment request");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch ( _error) {
        setError('Failed to read tag assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};