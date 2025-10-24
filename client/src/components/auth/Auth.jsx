import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import Loader from "../ui/Loader"; // <-- 1. Import the Loader

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- 2. Add loading state

  const { login, register } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showToast("Please fill all fields", "error");

    setIsLoading(true); // <-- 3. Set loading true
    try {
      await login(email, password);
      showToast("Login Successful!");
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed", "error");
    } finally {
      setIsLoading(false); // <-- 4. Set loading false in 'finally'
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password)
      return showToast("Please fill all fields", "error");

    setIsLoading(true); // <-- 5. Set loading true
    try {
      await register(username, email, password);
      showToast("Register Successful!");
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setIsLoading(false); // <-- 6. Set loading false in 'finally'
    }
  };

  // 7. Add a conditional render for the loader
  if (isLoading) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center p-4">
        <Loader />
      </section>
    );
  }

  return (
    <section className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="flex flex-col gap-4"
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-zinc-800 text-zinc-100 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 text-zinc-100 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 text-zinc-100 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <button
            type="submit"
            className="bg-zinc-100 text-zinc-900 font-bold p-3 rounded-lg hover:bg-zinc-300 transition-colors"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-100 font-bold ml-2 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </section>
  );
}

export default Auth;