function Home() {
  return (
    <div className="relative z-0 flex justify-center mt-4 px-2">
      <div
        className="
    relative
    w-full
    top-5
    min-h-[160px]
    rounded-2xl
    overflow-visible
    bg-cover
    bg-center
    shadow-[0_20px_50px_rgba(0,0,0,0.20)]
    p-5
  "
        style={{
          backgroundImage: "url('/banner.png')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/15 rounded-2xl"></div>

        {/* Logo */}
        <div className="absolute -top-6 right-0 flex items-center justify-center overflow-visible">
          <img
            src="/logo 3.png"
            alt="Thudipp Logo"
            className="w-50 h-40 md:w-14 md:h-14 object-contain"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-white font-black leading-tight text-lg md:text-lg">
            Be a reason
            <br />
            for someone's
            <br />
            heartbeat
          </h1>

          <p className="mt-1 text-red-100 text-sm md:text-sm">
            Donate Blood. Save Lives.
          </p>
          <button className="mt-2 bg-white text-[#B3001B] text-xs px-2 py-1 rounded-2xl shadow-lg">
            Donate Now →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
