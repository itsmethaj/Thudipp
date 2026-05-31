import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Donors from "./pages/Donors";
import Admin from "./pages/Admin";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <Navbar setPage={setPage} />

      {page === "home" && <Home />}
      {page === "donors" && <Donors />}
      {page === "admin" && <Admin setPage={setPage} />}
    </>
  );
}

export default App;
