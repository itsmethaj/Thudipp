import { useState } from "react";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Overlay */}

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? "opacity-70 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* Menu Container */}

      <div
        className={`fixed top-5 left-5 bg-red-700 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-out z-50 ${
          isOpen ? "w-72 h-[90svh] pt-20 px-5 pb-10" : "w-14 h-14"
        }`}
      >
        {/* Hamburger */}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-0 left-0 w-14 h-14 flex items-center justify-center z-[60]"
        >
          <div className="w-7 flex flex-col gap-1.5">
            <span
              className={`h-1 bg-white rounded-full transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2.5" : ""
              }`}
            ></span>

            <span
              className={`h-1 bg-white rounded-full transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>

            <span
              className={`h-1 bg-white rounded-full transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2.5" : ""
              }`}
            ></span>
          </div>
        </button>

        {/* Menu Items */}

        <div
          className={`flex flex-col justify-evenly h-full transition-all duration-500 ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5 pointer-events-none"
          }`}
        >
          <button className="w-full text-left p-4 rounded-2xl bg-white/90 hover:bg-white active:scale-[0.98] transition font-semibold text-gray-700">
            🏠 Home
          </button>

          <button className="w-full text-left p-4 rounded-2xl bg-white/90 hover:bg-white active:scale-[0.98] transition font-semibold text-gray-700">
            🩸 Donors
          </button>

          <button className="w-full text-left p-4 rounded-2xl bg-white/90 hover:bg-white active:scale-[0.98] transition font-semibold text-gray-700">
            🚨 Emergency
          </button>

          <button className="w-full text-left p-4 rounded-2xl bg-white/90 hover:bg-white active:scale-[0.98] transition font-semibold text-gray-700">
            ⚙️ Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
