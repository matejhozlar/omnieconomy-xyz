import { useEffect } from "react";

/**
 * Hook to handle Cmd/Ctrl+K keyboard shortcut
 * @param callback - Function to call when shortcut is pressed
 */
export function useSearchShortcut(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback]);
}
