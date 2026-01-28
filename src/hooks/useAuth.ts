import { useAuthContext } from "@/context/AuthContext";
import type { Role } from "@/config/roles";

export function useAuth() {
  const { user, login, logout } = useAuthContext();

  // ✅ TEMP role logic (acceptable for assignment & demo)
  const role: Role =
    user === "admin" ? "admin" :
    user === "editor" ? "editor" :
    "viewer";

  return {
    user,
    role, // ✅ NOW EXISTS
    isAuthenticated: !!user,
    login,
    logout,
  };
}
