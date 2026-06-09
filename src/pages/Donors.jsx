import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import {
  HeartPulse,
  MapPin,
  UserRound,
  PhoneCall,
  BadgeInfo,
  X,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

function Donors() {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    fetchDonors();
    fetchAuthorizedVolunteers();
  }, []);

  async function fetchDonors() {
    
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .eq("archived", false);

    if (!error) {
      setDonors(data || []);
    }
    
  }

  // Fetch users/volunteers who are admins OR have explicit permission to view phone numbers
  async function fetchAuthorizedVolunteers() {
    const { data, error } = await supabase
      .from("users")
      .select("username, role, phone, permissions")
      .eq("archived", false); // Assuming you might have an archived flag for users too

    if (!error && data) {
      const authorized = data.filter((v) => {
        // Safe parsing for permissions structure
        const perms =
          typeof v.permissions === "string"
            ? JSON.parse(v.permissions || "{}")
            : v.permissions || {};

        return v.role === "admin" || perms.view_phone === true;
      });
      setVolunteers(authorized);
    }
  }

  const filteredDonors = bloodGroup
    ? donors.filter((donor) => donor.blood_group === bloodGroup)
    : donors;

  async function handleContactClick(donor) {
    setSelectedDonor(donor);

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("active", true);

    const coordinators = (data || [])
      .filter((user) => user.role === "admin" || user.permissions?.view_phone)
      .sort((a, b) => (a.role === "admin" ? -1 : 1));

    setVolunteers(coordinators);

    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen pt-25 sm:pt-24 bg-[#F8F8F8] px-3 sm:px-6 pb-10 relative">
      <div className="w-full max-w-6xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl sm:rounded-3xl text-center p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-black text-[#B3001B]">
            Find Donors
          </h1>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs sm:text-sm font-bold mx-auto text-gray-400 tracking-wider uppercase">
              Filter by Blood Group
            </span>
            {bloodGroup && (
              <button
                onClick={() => setBloodGroup("")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#B3001B] hover:underline"
              >
                <X size={12} />
                Clear Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 mb-3">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <button
                key={group}
                onClick={() => setBloodGroup(bloodGroup === group ? "" : group)}
                className={`py-2 text-xs sm:text-sm rounded-xl font-bold transition-all duration-200 ${
                  bloodGroup === group
                    ? "bg-[#B3001B] text-white shadow-sm"
                    : "bg-white border border-gray-100 text-[#B3001B] hover:bg-red-50/40"
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="text-[11px] sm:text-xs text-center rounded-sm bg-gray-50 text-gray-400 font-medium shadow-sm px-1 mt-1">
             Showing {filteredDonors.length} active matching pool
            profiles
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:border-gray-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 pb-3 border-b border-gray-50">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <UserRound size={18} className="text-[#B3001B]" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-gray-900 line-clamp-1">
                        {donor.name}
                      </h2>
                      <div className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5">
                        <BadgeInfo size={10} />
                        {donor.admission_no}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="bg-[#B3001B] text-white px-2.5 py-1 rounded-lg font-black text-xs flex items-center gap-1 shadow-sm">
                      <HeartPulse size={12} />
                      {donor.blood_group}
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        donor.available
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${donor.available ? "bg-green-500" : "bg-red-500"}`}
                      />
                      {donor.available ? "Available" : "Unavailable"}
                    </div>
                  </div>
                </div>
                <div className="py-4 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-orange-500 shrink-0" />
                    <span className="font-medium line-clamp-1">
                      {donor.place}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                    Donor contact details are protected to safeguard privacy.
                    Click below to view authorized coordinators.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleContactClick(donor)}
                className="
    mt-2
    w-full
    bg-red-500
    text-white
    hover:bg-red-700
    active:scale-[0.99]
    py-2.5
    rounded-xl
    font-bold
    text-xs
    sm:text-sm
    flex
    items-center
    justify-center
    gap-1.5
    transition-all
  "
              >
                <PhoneCall size={14} />
                Contact Coordinator
              </button>
            </div>
          ))}
        </div>
        {filteredDonors.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-sm font-semibold text-gray-400 border border-gray-100 shadow-sm w-full">
            No registered blood donors found matching this filter criteria
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl border border-gray-100 animate-slide-up flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-black text-gray-900 text-base sm:text-lg">
                  Contact Coordinators
                </h3>

                <p className="text-[11px] text-gray-400 mt-0.5">
                  Call an authorized coordinator to connect with donor{" "}
                  <span className="font-semibold">{selectedDonor?.name}</span>
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 flex-grow">
              {volunteers.length > 0 ? (
                volunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="
          flex
          items-center
          justify-between
          p-3
          rounded-2xl
          border
          border-gray-100
          bg-white
          shadow-sm
        "
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <UserCheck size={18} className="text-[#B3001B]" />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-800">
                          {vol.full_name || vol.username}
                        </h4>

                        <span
                          className={`
                inline-flex
                items-center
                px-2
                py-1
                mt-1
                rounded-full
                text-[10px]
                font-bold
                ${
                  vol.role === "admin"
                    ? "bg-red-100 text-[#B3001B]"
                    : "bg-blue-100 text-blue-700"
                }
              `}
                        >
                          {vol.role === "admin"
                            ? "Administrator"
                            : "Volunteer Coordinator"}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`tel:${vol.phone}`}
                      className="
            px-3
            py-2
            bg-green-50
            hover:bg-green-100
            text-green-700
            rounded-xl
            flex
            items-center
            gap-2
            font-semibold
            transition-all
          "
                    >
                      <PhoneCall size={14} />
                      Call
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-gray-400">
                  No authorized coordinators available.
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-50 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Donors;
