import { useState } from "react";
import ButtonPrimary from "../ui/ButtonPrimary";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = (type) => {
    setIsLogin(type === "login");
  };

  return (
    <section className="flex justify-center items-center min-h-[80vh] bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg">
        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <ButtonPrimary handleClick={() => handleToggle("login")}>
            Login
          </ButtonPrimary>
          <ButtonPrimary handleClick={() => handleToggle("signup")}>
            Signup
          </ButtonPrimary>
        </div>

        {/* Forms */}
        <div className="transition-all duration-300">
          {isLogin ? (
            <div className="login-form space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Welcome Back 👋
              </h2>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ButtonPrimary className="w-full py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 transition">
                Login
              </ButtonPrimary>
            </div>
          ) : (
            <div className="signup-form space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Create an Account 🚀
              </h2>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ButtonPrimary className="w-full py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 transition">
                Signup
              </ButtonPrimary>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Auth;
