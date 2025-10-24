import { createContext, useState, useEffect, useContext } from "react";
import authApi from "../utils/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await authApi.get("/check-auth");
      setIsLoggedIn(res.data.isAuthenticated);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Check login status on app start

    checkAuth();
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
