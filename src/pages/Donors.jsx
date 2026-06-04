import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Donors() {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");

  useEffect(() => {
    async function fetchDonors() {
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .eq("archived", false);

      if (error) {
        console.error(error);
        return;
      }

      setDonors(data || []);
    }

    fetchDonors();
  }, []);

  const filteredDonors = bloodGroup
    ? donors.filter((donor) => donor.blood_group === bloodGroup)
    : donors;

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#B3001B]">Find Donors</h1>

          <p className="text-gray-500 mt-1">Search blood donors near you</p>
        </div>

        {/* Blood Group Filter */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
            <button
              key={group}
              onClick={() => setBloodGroup(group)}
              className={`py-2 rounded-xl font-semibold transition-all duration-200 ${
                bloodGroup === group
                  ? "bg-[#B3001B] text-white shadow-lg"
                  : "bg-white text-[#B3001B] border border-red-100"
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5 px-1">
          <span className="text-sm font-medium text-gray-500">
            {filteredDonors.length} donors found
          </span>

          {bloodGroup && (
            <button
              onClick={() => setBloodGroup("")}
              className="text-sm font-semibold text-[#B3001B]"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Donor Cards */}
        <div className="space-y-4">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400">ID: {donor.id}</p>

                  <h2 className="mt-1 text-lg font-bold text-gray-800">
                    {donor.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">📍 {donor.place}</p>
                </div>

                <div className="flex items-center justify-center min-w-[60px] h-9 rounded-xl bg-[#B3001B] text-white font-bold text-sm">
                  {donor.blood_group}
                </div>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="mt-4 w-full bg-[#B3001B] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Contact Volunteer
              </button>
            </div>
          ))}

          {filteredDonors.length === 0 && (
            <div className="bg-white rounded-3xl p-6 text-center shadow-md">
              No donors found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Donors;
