import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as User;
        setUser(decoded);
      } catch {
        setUser(null);
        Cookies.remove("token");
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return { user, loading, logout, isAuthenticated: !!user };
}
