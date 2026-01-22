import { useUIContext } from "@/context/UIContext";

export function useUI() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIContext();

  return {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
  };
}
