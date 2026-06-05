import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { User, Lock, LogIn } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .eq("active", true)
      .single();

    if (error || !data) {
      alert("Invalid username or password");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("permissions", JSON.stringify(data.permissions || {}));

    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8 w-full max-w-md flex flex-col items-center">
        {/* Central Logo Graphic Branding */}
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          <img
            src="/logo.png"
            alt="Thudipp Logo"
            className="w-24 h-24 object-contain pointer-events-none"
          />
        </div>

        {/* Branding Titles */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#B3001B] tracking-tight">
            Thudipp
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
            Admin & Volunteer Portal
          </p>
        </div>

        {/* Input Interactive Form Area */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          {/* Username Input with Embedded Icon */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-200 transition-colors"
              required
            />
          </div>

          {/* Password Input with Embedded Icon */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-200 transition-colors"
              required
            />
          </div>

          {/* Premium Form Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[#B3001B] text-white py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
          >
            <LogIn size={16} />
            Secure Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
