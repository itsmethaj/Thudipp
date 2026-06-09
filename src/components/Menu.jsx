import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  UserCheck,
  LogOut,
  LogIn,
  HeartPulse,
  User,
} from "lucide-react";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      page: "/",
    },
    ...(user
      ? [
          {
            icon: user.role === "admin" ? LayoutDashboard : UserCheck,
            label:
              user.role === "admin" ? "Admin Dashboard" : "Volunteer Dashboard",
            page: user.role === "admin" ? "/admin" : "/volunteer",
          },
          {
            icon: LogOut,
            label: "Logout",
            page: "logout",
          },
        ]
      : [
          {
            icon: LogIn,
            label: "Login",
            page: "/login",
          },
        ]),
  ];

  return (
    <div className="absolute left-3 top-1/2 -translate-y-1/2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-30 w-11 h-11 rounded-xl bg-[#B3001B] border border-white/10 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="flex flex-col justify-center items-center h-5 w-5 relative">
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 absolute ${isOpen ? "rotate-45" : "-translate-y-1.5"}`}
          />
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 absolute ${isOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 absolute ${isOpen ? "-rotate-45" : "translate-y-1.5"}`}
          />
        </div>
      </button>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-10 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed -top-5 -left-3 w-[80vw] max-w-[300px] h-screen z-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full bg-gradient-to-b from-[#940014] via-[#B3001B] to-[#6A040F] rounded-r-[32px] border-r border-white/10 shadow-[5px_0_40px_rgba(0,0,0,0.25)] p-5 pt-24 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="pb-5 border-b border-white/10">
              <h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-2">
                Thudipp
              </h2>
              <p className="text-white/50 text-xs mt-0.5 font-medium">
                Connecting Donors • Saving Lives
              </p>
              {user && (
                <div className="mt-4 bg-black/10 border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white text-sm font-bold truncate">
                      {user.username}
                    </p>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                      {user.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <nav className="flex flex-col gap-1.5">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.page === "logout") {
                        localStorage.removeItem("user");
                        localStorage.removeItem("permissions");
                        navigate("/");
                      } else {
                        navigate(item.page);
                      }
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 active:bg-white/5 transition-all duration-200 text-left group"
                  >
                    <IconComponent
                      size={18}
                      className="text-white/60 group-hover:text-white transition-colors shrink-0"
                    />
                    <span className="text-sm font-bold tracking-wide">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="pt-4 pb-20 border-t border-white/10 pb-8">
            <button
              onClick={() => {
                navigate("/donors");
                setIsOpen(false);
              }}
              className="w-full  bg-white hover:bg-red-50 active:scale-[0.98] text-[#B3001B] font-black py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide transition-all duration-200"
            >
              <HeartPulse size={16} />
              FIND DONORS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
