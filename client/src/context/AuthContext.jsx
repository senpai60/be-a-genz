import { createContext, useState, useEffect, useContext } from "react";
import authApi from "../utils/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // This function checks if a cookie already exists
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

  // vvvv YEH SAHI CODE HAI vvvv

  // This function handles registration AND sets login state
  const register = async (username, email, password) => {
    // This will throw an error if it fails, which Auth.jsx will catch
    await authApi.post("/register", { username, email, password });
    // After successful register, the server sets the cookie, so we are logged in.
    setIsLoggedIn(true);
  };

  // This function handles login AND sets login state
  const login = async (email, password) => {
    // This will throw an error if it fails, which Auth.jsx will catch
    await authApi.post("/login", { email, password });
    // After successful login, the server sets the cookie, so we are logged in.
    setIsLoggedIn(true);
  };

  // This function handles logout AND sets login state
  const logout = async () => {
    try {
      await authApi.post("/logout");
      setIsLoggedIn(false);
    } catch (err) {
      // Even if logout fails, log the user out on the client
      setIsLoggedIn(false);
      console.error("Logout failed", err);
    }
  };
  // ^^^^ YEH SAHI CODE HAI ^^^^

  useEffect(() => {
    // Check login status on app start
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loading,
        login,    // <-- Ab yeh server ko call karega
        register, // <-- Ab yeh server ko call karega
        logout,   // <-- Ab yeh server ko call karega
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

