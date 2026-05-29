import Menu from "./Menu.jsx";

function Navbar() {
  return (
    <nav className="w-[98.5%] mx-auto h-20 bg-red-700 mt-2 rounded-3xl flex items-center justify-between relative overflow-visible px-4">
      <Menu />
      <h1 className="mx-auto ![font-family:Poppins-Bold] text-[40px] text-white">
        Thudipp
      </h1>
    </nav>
  );
}

export default Navbar;
