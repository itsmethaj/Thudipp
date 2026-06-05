import Menu from "./Menu";

function Navbar() {
  return (
    <nav className="fixed top-0   left-0 right-0 z-50 w-full h-20 bg-red-800 flex items-center justify-center shadow-lg">
      <Menu />

      <h1 className="text-white text-2xl font-bold tracking-wide select-none">
        Thudipp
      </h1>
    </nav>
  );
}

export default Navbar;
