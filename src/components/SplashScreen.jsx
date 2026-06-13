import { useEffect, useState } from "react";

// 'manifest' is an array of image strings, e.g., ["/logo.png", "/banner1.jpg", "/banner2.jpg"]
function SplashScreen({ finishLoading, manifest = ["/logo.png"] }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!manifest || manifest.length === 0) {
      setAssetsReady(true);
      return;
    }

    // Preload all images programmatically
    const promises = manifest.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        // Resolve on success OR error so a single broken image won't infinite-loop your splash screen
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    // Wait until every single asset is fully cached by the browser
    Promise.all(promises).then(() => {
      if (mounted) setAssetsReady(true);
    });

    return () => {
      mounted = false;
    };
  }, [manifest]);

  useEffect(() => {
    // CRITICAL: Block the countdown timers until assetsReady is true
    if (!assetsReady) return;

    // Keep splash screen visible for a short window, then initiate fade out
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
  }, [assetsReady, finishLoading]);

  return (
    <div
      className={`fixed inset-0 bg-[#F8F8F8] z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Pulsing Brand Logo Wrapper Container */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 bg-red-100 rounded-full animate-ping opacity-25" />

          {/* Render the logo safely now that we know it is already cached */}
          <img
            src="/logo .png"
            alt="Thudipp Logo Asset"
            className={`w-24 h-24 object-contain relative z-10 animate-pulse pointer-events-none transition-opacity duration-300 ${
              assetsReady ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Clean, Minimalist Typography Plate */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#B3001B] tracking-tight">
            Thudipp
          </h1>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">
            The Thudipp That Connects Lives
          </p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
