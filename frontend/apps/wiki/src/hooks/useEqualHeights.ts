import { useEffect } from "react";

export function useEqualHeights(selector: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;

    const apply = () => {
      els.forEach((el) => (el.style.minHeight = ""));
      const max = Math.max(...els.map((el) => el.offsetHeight));
      els.forEach((el) => (el.style.minHeight = `${max}px`));
    };

    const ro = new ResizeObserver(apply);
    els.forEach((el) => ro.observe(el));
    window.addEventListener("resize", apply);

    apply();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      els.forEach((el) => (el.style.minHeight = ""));
    };
  }, [selector]);
}
