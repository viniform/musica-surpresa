

import { useEffect } from "react";

export default function useScrollToHash(pathname) {
  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash;
    if (!hash) return;

    const element = document.querySelector(hash);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname]);
}