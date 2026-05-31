import Menu from "./Menu";

function Navbar({ setPage }) {
  return (
    <nav className="relative z-10 overflow-visible w-full h-14 mx-auto mt-2 px-4 bg-gradient-to-r from-[#B3001B] to-[#8A0015] flex items-center justify-center shadow-lg">
      <Menu setPage={setPage} />

      <h1 className="text-white text-2xl font-bold tracking-wide select-none">
        Thudipp
      </h1>
    </nav>
  );
}

export default Navbar;
