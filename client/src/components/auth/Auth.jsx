import { useState } from "react";
import ButtonPrimary from "../ui/ButtonPrimary";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../utils/authApi"; // ✅ MISSING IMPORT ADDED

function Auth() {
  const { login } = useAuth(); // ✅ from context
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleToggle = (type) => {
    setIsLogin(type === "login");
    setMessage("");
    setFormData({ username: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isLogin) {
        res = await authApi.post(
          "/login",
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );
      } else {
        res = await authApi.post(
          "/register",
          {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );
      }

      // ✅ update context instantly
      login();
      setMessage(res.data.message || (isLogin ? "Login successful!" : "Signup successful!"));
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[80vh] bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg">
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <ButtonPrimary
            handleClick={() => handleToggle("login")}
            selectionStyle={
              isLogin ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-300"
            }
          >
            Login
          </ButtonPrimary>
          <ButtonPrimary
            handleClick={() => handleToggle("signup")}
            selectionStyle={
              !isLogin ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-300"
            }
          >
            Signup
          </ButtonPrimary>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-300">
          <h2 className="text-xl font-semibold text-center">
            {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <ButtonPrimary
            selectionStyle="w-full py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </ButtonPrimary>

          {message && (
            <p className="text-center text-sm mt-2 text-green-400">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Auth;
