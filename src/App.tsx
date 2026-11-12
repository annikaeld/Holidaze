import { useEffect } from "react";
import { AppRoutes } from "@/routes/AppRoutes";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

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

  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;
