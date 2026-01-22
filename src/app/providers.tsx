"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UIProvider, useUIContext } from "@/context/UIContext";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useUIContext();

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      {children}
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <ThemeWrapper>{children}</ThemeWrapper>
      </UIProvider>
    </AuthProvider>
  );
}
