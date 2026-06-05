import { useEffect, useState } from "react";

function SplashScreen({ finishLoading }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Keep splash screen visible for a short window, then initiate elegant fade out animation
    const fadeTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // Completely unmount the loader view from the layout cycle
    const exitTimeout = setTimeout(() => {
      if (finishLoading) finishLoading();
    }, 2200);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(exitTimeout);
    };
  }, [finishLoading]);

  return (
    <div
      className={`fixed inset-0 bg-[#F8F8F8] z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Pulsing Brand Logo Wrapper Container */}
        <div className="relative flex items-center justify-center">
          {/* Subtle radar ripple ring under logo layer */}
          <div className="absolute w-28 h-28 bg-red-100 rounded-full animate-ping opacity-25" />

          <img
            src="./public/logo.png"
            alt="Thudipp Logo Asset"
            className="w-24 h-24 object-contain relative z-10 animate-pulse pointer-events-none"
          />
        </div>

        {/* Clean, Minimalist Typography Plate */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#B3001B] tracking-tight">
            Thudipp
          </h1>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">
            Connecting Donors • Saving Lives
          </p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
