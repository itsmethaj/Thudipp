import { useNavigate } from "react-router-dom";
import Analytics from "./Admin/Analytics";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="pt-20 relative z-0 flex justify-center px-2">
        {/* Your current banner */}
      </div>
      <div className="px-4 pb-10">
        <div className="bg-[#B3001B] rounded-3xl p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Need Blood Urgently?</h2>

          <p className="text-red-100 mb-4">Search donors near you instantly.</p>

          <button
            onClick={() => navigate("/donors")}
            className="bg-white text-[#B3001B] px-5 py-3 rounded-2xl font-semibold"
          >
            Find Donors
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
