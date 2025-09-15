import { useState, useEffect, useRef } from 'react';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface ItemData {
  [key: string]: any; // Generic JSON data structure
}

interface UseItemDataPreloaderReturn {
  data: ItemData | null;
  loading: boolean;
  error: string | null;
  loadingState: LoadingState;
}

// Cache to store loaded data
const dataCache = new Map<string, ItemData>();

export const useItemDataPreloader = (itemId: string | null): UseItemDataPreloaderReturn => {
  const [data, setData] = useState<ItemData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!itemId) {
      setData(null);
      setLoadingState('idle');
      setError(null);
      return;
    }

    // Check cache first
    const cachedData = dataCache.get(itemId);
    if (cachedData) {
      setData(cachedData);
      setLoadingState('success');
      setError(null);
      return;
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const loadItemData = async () => {
      setLoadingState('loading');
      setError(null);

      try {
        // Construct the data path based on itemId
        const dataPath = `/data/${itemId}.json`;

        const response = await fetch(dataPath, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load data for ${itemId}: ${response.statusText}`);
        }

        const jsonData = await response.json();

        // Cache the loaded data
        dataCache.set(itemId, jsonData);

        if (!controller.signal.aborted) {
          setData(jsonData);
          setLoadingState('success');
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          setError(errorMessage);
          setLoadingState('error');
          setData(null);
        }
      }
    };

    loadItemData();

    return () => {
      controller.abort();
    };
  }, [itemId]);

  return {
    data,
    loading: loadingState === 'loading',
    error,
    loadingState,
  };
};
