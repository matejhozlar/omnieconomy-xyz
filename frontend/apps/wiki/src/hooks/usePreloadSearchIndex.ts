import { useEffect } from "react";
import { preloadContentIndex } from "../utils/searchIndexer";

/**
 * Hook to preload the content search index on app initialization
 * This improves search performance by building the index in the background
 */
export function usePreloadSearchIndex() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      preloadContentIndex();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
}
