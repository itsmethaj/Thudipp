import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const menuItems = [
    {
      icon: "🏠",
      label: "Home",
      page: "/",
    },
    {
      icon: "🩸",
      label: "Find Donors",
      page: "/donors",
    },

    ...(user
      ? [
          {
            icon: "👨‍💼",
            label:
              user.role === "admin" ? "Admin Dashboard" : "Volunteer Dashboard",
            page: user.role === "admin" ? "/admin" : "/volunteer",
          },
          {
            icon: "🚪",
            label: "Logout",
            page: "logout",
          },
        ]
      : [
          {
            icon: "🔐",
            label: "Login",
            page: "/login",
          },
        ]),
  ];

  return (
    <div className="absolute left-3 top-1/2 -translate-y-1/2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-30 w-10 h-10 rounded-2xl bg-[#B3001B] border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#990017]"
      >
        <div className="flex flex-col justify-between h-4 w-5">
          <span className="w-5 h-0.5 bg-white rounded-full"></span>
          <span className="w-5 h-0.5 bg-white rounded-full"></span>
          <span className="w-5 h-0.5 bg-white rounded-full"></span>
        </div>
      </button>

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-10 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed -top-2 -left-3 w-[85vw] max-w-[340px] md:max-w-[400px] h-screen z-20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full bg-gradient-to-b from-[#B3001B] to-[#8A0015] rounded-r-3xl border-r border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-4 pt-20 flex flex-col">
          {/* Header */}
          <div className="pb-4 mb-4 border-b border-white/10">
            <h2 className="text-white text-xl md:text-2xl font-bold">
              Thudipp
            </h2>

            <p className="text-white/60 text-sm mt-1">
              Donate Blood. Save Lives.
            </p>

            {user && (
              <div className="mt-3 bg-white/10 rounded-xl p-3">
                <p className="text-white text-sm font-medium">
                  {user.username}
                </p>

                <p className="text-white/60 text-xs capitalize">{user.role}</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-2 flex-1">
            {menuItems.map((item) => (
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
                className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-2xl text-white hover:bg-white/10 transition-all duration-200 text-left"
              >
                <span className="text-lg md:text-xl">{item.icon}</span>

                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 h-20 border-t border-white/10">
            <button
              onClick={() => navigate("/donors")}
              className="w-full bg-white text-[#B3001B] font-semibold py-3 md:py-4 rounded-2xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Find Donors ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
