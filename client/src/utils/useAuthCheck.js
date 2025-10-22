import { useState } from "react";
import authApi from "./authApi";
import { useEffect } from "react";

function useAuthCheck() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const check = async () => {
      try {
        await authApi.get("/check-auth");
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    check();
  }, []);
  return isLoggedIn;
}

export default useAuthCheck;
