import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { user, login, logout } = useAuthContext();

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
