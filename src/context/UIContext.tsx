"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      console.log("Theme changed to:", next);
      return next;
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      console.log(prev ? "Sidebar closed" : "Sidebar opened");
      return !prev;
    });
  };

  return (
    <UIContext.Provider
      value={{ theme, toggleTheme, sidebarOpen, toggleSidebar }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
}
