import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import {
  Phone,
  GraduationCap,
  MapPin,
  CalendarDays,
  Cake,
  House,
  Pencil,
  Archive,
  HeartPulse,
  UserRound,
  ShieldCheck,
  BadgeInfo,
  Search,
} from "lucide-react";

function ViewDonors() {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchDonors();
  }, []);

  async function fetchDonors() {
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .eq("archived", false)
      .order("id", { ascending: false });

    if (!error) {
      setDonors(data || []);
    }
  }

  async function archiveDonor(id) {
    const confirmArchive = window.confirm("Archive this donor?");
    if (!confirmArchive) return;

    const donor = donors.find((d) => d.id === id);

    const { error } = await supabase
      .from("donors")
      .update({ archived: true })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("activity_logs").insert([
      {
        actor_username: user?.username,
        actor_role: user?.role,
        action: "ARCHIVE_DONOR",
        target_type: "DONOR",
        target_admission_no: donor?.admission_no,
        details: `Archived donor ${donor?.name}`,
      },
    ]);

    fetchDonors();
  }

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.admission_no?.toLowerCase().includes(search.toLowerCase()) ||
      donor.name?.toLowerCase().includes(search.toLowerCase());

    const matchesBlood =
      bloodFilter === "" || donor.blood_group === bloodFilter;
    const matchesAvailable = !availableOnly || donor.available;

    return matchesSearch && matchesBlood && matchesAvailable;
  });

  return (
    <div className="min-h-screen pt-25  bg-[#F8F8F8] px-3 sm:px-6 pb-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-6xl mx-auto text-center p-4 sm:p-6 border border-gray-100 shadow-sm mb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-[#B3001B]">
          View Donors
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage and filter registered database profiles
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Admission No or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-200 transition-colors"
            />
          </div>

          {/* Blood Group Toggles: Adapts grid layouts depending on resolution screen estate */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 mb-4">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <button
                key={group}
                onClick={() =>
                  setBloodFilter(bloodFilter === group ? "" : group)
                }
                className={`py-2 text-xs sm:text-sm rounded-xl font-bold transition-all ${
                  bloodFilter === group
                    ? "bg-[#B3001B] text-white shadow-sm animate-none"
                    : "bg-white border border-gray-100 text-[#B3001B] hover:bg-red-50/40"
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-[#B3001B] focus:ring-[#B3001B] w-4 h-4 border-gray-200"
            />
            Available Donors Only
          </label>
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
                      <ShieldCheck size={10} />
                      {donor.available ? "Available" : "Unavailable"}
                    </div>
                  </div>
                </div>
                <div className="py-3.5 space-y-2 text-xs text-gray-600">
                  {(isAdmin || permissions.view_phone) && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-[#B3001B] shrink-0" />
                      <span className="font-medium">{donor.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <GraduationCap
                      size={13}
                      className="text-[#B3001B] shrink-0"
                    />
                    <span className="font-medium line-clamp-1">
                      {donor.course}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={13}
                      className="text-blue-500 shrink-0"
                    />
                    <span className="font-medium">
                      Joined: {donor.year_joined}
                    </span>
                  </div>

                  {(isAdmin || permissions.view_dob) && (
                    <div className="flex items-center gap-2">
                      <Cake size={13} className="text-pink-500 shrink-0" />
                      <span className="font-medium">{donor.dob}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <HeartPulse size={13} className="text-red-500 shrink-0" />
                    <span className="font-medium line-clamp-1">
                      Last: {donor.last_donation || "Never Donated"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-orange-500 shrink-0" />
                    <span className="font-medium line-clamp-1">
                      {donor.place}
                    </span>
                  </div>

                  {(isAdmin || permissions.view_address) && (
                    <div className="flex items-start gap-2 border-t border-gray-50/60 pt-2 mt-1">
                      <House
                        size={13}
                        className="text-green-600 mt-0.5 shrink-0"
                      />
                      <span className="font-medium text-gray-500 line-clamp-2">
                        {donor.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-50 mt-auto">
                {(isAdmin || permissions.edit_donor) && (
                  <button
                    onClick={() => {
                      localStorage.setItem("editDonorId", donor.id);
                      navigate("/admin/edit-donor");
                    }}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                )}

                {(isAdmin || permissions.archive_donor) && (
                  <button
                    onClick={() => archiveDonor(donor.id)}
                    className="flex-1 bg-red-600 text-white hover:bg-red-700 active:scale-[0.99] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Archive size={12} />
                    Archive
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDonors.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-sm font-semibold text-gray-400 border border-gray-100 shadow-sm w-full">
            No donors matched your filter criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewDonors;
