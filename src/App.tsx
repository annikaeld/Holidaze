import { useEffect } from "react";
import { AppRoutes } from "@/routes/AppRoutes";

function App() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    };

    updateTheme();

    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, []);

  return <AppRoutes />;
}

export default App;
