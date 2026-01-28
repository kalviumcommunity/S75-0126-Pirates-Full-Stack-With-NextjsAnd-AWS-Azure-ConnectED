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
    let isMounted = true;
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as User;
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              setUser(decoded);
              setLoading(false);
            }
          }, 0);
        }
      } catch {
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              setUser(null);
              Cookies.remove("token");
              setLoading(false);
            }
          }, 0);
        }
      }
    } else {
      if (isMounted) {
        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 0);
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return { user, loading, logout, isAuthenticated: !!user };
}
