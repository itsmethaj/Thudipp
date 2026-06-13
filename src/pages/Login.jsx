import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import {
  User,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage(""); 

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .eq("active", true)
        .single();

      if (error || !data) {
        setErrorMessage(
          "Invalid username or password. Please check your credentials.",
        );
        setIsAuthenticating(false);
        return;
      }


      const browserAgent = navigator.userAgent;
      const isMobile = /Mobi|Android/i.test(browserAgent)
        ? "Mobile"
        : "Desktop";

      await supabase.from("activity_logs").insert([
        {
          actor_username: data.username,
          action: "LOGIN",
          details: `Authenticated successfully via ${isMobile} browser interface.`,
          target_admission_no: "N/A",
          created_at: new Date().toISOString(),
        },
      ]);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem(
        "permissions",
        JSON.stringify(data.permissions || {}),
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMessage("A network connection error occurred. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-8 w-full max-w-md flex flex-col items-center">
        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
          <img
            src="/logo .png"
            alt="Thudipp Logo"
            className={`w-24 h-24 object-contain pointer-events-none ${isAuthenticating ? "animate-pulse" : ""}`}
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#B3001B] tracking-tight">
            Thudipp
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
            Admin & Volunteer Portal
          </p>
        </div>

        {errorMessage && (
          <div className="w-full mb-4 bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="text-[#B3001B] w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-900 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-200 transition-colors"
              disabled={isAuthenticating}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:border-red-200 transition-colors"
              disabled={isAuthenticating}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex="-1" 
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full mt-2 bg-[#B3001B] text-white py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {isAuthenticating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Secure Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
