// hooks/useMutation.ts
import { useState } from 'react';
import { ApiResponse } from '../services/api/types';

export function useMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: V): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Mutation failed');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
