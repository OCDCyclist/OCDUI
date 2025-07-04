import { useState } from 'react';
import { RideData } from '../../types/types';

interface UseRideFieldUpdateResult {
  rideData: RideData | null;
  loading: boolean;
  error: string | null;
  updateRideField: (field: string, value: string | number) => Promise<void>;
}

export function useRideFieldUpdate(rideid: number): UseRideFieldUpdateResult {
  const [rideData, setRideData] = useState<RideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRideField = async (field: string, value: string | number) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    const payload = { [field]: value.toString() };

    try {
      const response = await fetch(`http://localhost:3000/ride/${rideid}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update ride');
      }

      const data = await response.json();
      setRideData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { rideData, loading, error, updateRideField };
}
