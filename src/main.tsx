import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Keep app theme in sync with system preference
function subscribeToSystemThemeChanges() {
  if (typeof window === "undefined" || !window.matchMedia) return;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const apply = (e: MediaQueryList | MediaQueryListEvent) => {
    const prefersDark = "matches" in e ? e.matches : media.matches;
    const root = document.documentElement;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
  };
  // Apply once on load in case HTML script didn't run (SSR or other env)
  apply(media);
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  } else if (typeof (media as any).addListener === "function") {
    (media as any).addListener(apply);
    return () => (media as any).removeListener(apply);
  }
  return () => {};
}

subscribeToSystemThemeChanges();
createRoot(document.getElementById("root")!).render(<App />);
