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
} from "lucide-react";

function ViewDonors() {
const navigate = useNavigate();

const [donors, setDonors] = useState([]);
const [search, setSearch] = useState("");
const [bloodFilter, setBloodFilter] = useState("");
const [availableOnly, setAvailableOnly] = useState(false);

const user = JSON.parse(
localStorage.getItem("user")
);

const permissions =
JSON.parse(
localStorage.getItem("permissions")
) || {};

const isAdmin = user?.role === "admin";

useEffect(() => {
fetchDonors();
}, []);

async function fetchDonors() {
const { data, error } = await supabase
.from("donors")
.select("*")
.eq("archived", false)
.order("id", {
ascending: false,
});


if (!error) {
  setDonors(data || []);
}

}

async function archiveDonor(id) {
const confirmArchive = window.confirm(
"Archive this donor?"
);

if (!confirmArchive) return;

const donor = donors.find(
  (d) => d.id === id
);

const { error } = await supabase
  .from("donors")
  .update({
    archived: true,
  })
  .eq("id", id);

if (error) {
  alert(error.message);
  return;
}

await supabase
  .from("activity_logs")
  .insert([
    {
      actor_username:
        user?.username,

      actor_role:
        user?.role,

      action:
        "ARCHIVE_DONOR",

      target_type:
        "DONOR",

      target_admission_no:
        donor?.admission_no,

      details: `Archived donor ${donor?.name}`,
    },
  ]);

fetchDonors();

}

const filteredDonors = donors.filter(
(donor) => {
const matchesSearch =
donor.admission_no
?.toLowerCase()
.includes(
search.toLowerCase()
) ||
donor.name
?.toLowerCase()
.includes(
search.toLowerCase()
);

  const matchesBlood =
    bloodFilter === "" ||
    donor.blood_group ===
      bloodFilter;

  const matchesAvailable =
    !availableOnly ||
    donor.available;

  return (
    matchesSearch &&
    matchesBlood &&
    matchesAvailable
  );
}

);

return (
  <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
    {" "}
    <div className="bg-white rounded-3xl text-center p-6 shadow-sm mb-5">
      <h1 className="text-3xl font-black text-[#B3001B]">View Donors</h1>
    </div>
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl p-4 shadow-md mb-5">
        <input
          type="text"
          placeholder="Search by Admission No or Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <div className="grid grid-cols-4 gap-2 mb-4">
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
            <button
              key={group}
              onClick={() => setBloodFilter(bloodFilter === group ? "" : group)}
              className={`py-2 rounded-xl font-semibold transition-all ${
                bloodFilter === group
                  ? "bg-[#B3001B] text-white"
                  : "bg-white border border-red-100 text-[#B3001B]"
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available Donors Only
        </label>
      </div>

      <div className="space-y-4">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="
            bg-white
            rounded-3xl
            p-5
            border
            border-gray-100
            shadow-sm
            hover:shadow-lg
            transition-all
          "
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div
                  className="
                  w-12 h-12
                  rounded-2xl
                  bg-red-50
                  flex
                  items-center
                  justify-center
                "
                >
                  <UserRound size={22} className="text-[#B3001B]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">{donor.name}</h2>

                  <div
                    className="
                    inline-flex
                    items-center
                    gap-1
                    bg-gray-100
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    mt-1
                  "
                  >
                    <BadgeInfo size={12} />
                    {donor.admission_no}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div
                  className="
                  bg-[#B3001B]
                  text-white
                  px-3
                  py-2
                  rounded-2xl
                  font-bold
                  flex
                  items-center
                  gap-2
                "
                >
                  <HeartPulse size={15} />
                  {donor.blood_group}
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    donor.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <ShieldCheck size={12} className="inline mr-1" />
                  {donor.available ? "Available" : "Unavailable"}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              {(isAdmin || permissions.view_phone) && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#B3001B]" />
                  <span>{donor.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-[#B3001B]" />
                <span>{donor.course}</span>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-blue-500" />
                <span>Joined Year: {donor.year_joined}</span>
              </div>

              {(isAdmin || permissions.view_dob) && (
                <div className="flex items-center gap-3">
                  <Cake size={16} className="text-pink-500" />
                  <span>{donor.dob}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <HeartPulse size={16} className="text-red-500" />
                <span>
                  Last Donation: {donor.last_donation || "Never Donated"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-orange-500" />
                <span>{donor.place}</span>
              </div>

              {(isAdmin || permissions.view_address) && (
                <div className="flex items-start gap-3">
                  <House size={16} className="text-green-600 mt-1" />
                  <span>{donor.address}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              {(isAdmin || permissions.edit_donor) && (
                <button
                  onClick={() => {
                    localStorage.setItem("editDonorId", donor.id);

                    navigate("/admin/edit-donor");
                  }}
                  className="
                    flex-1
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-3
                    rounded-2xl
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Pencil size={16} />
                  Edit
                </button>
              )}

              {(isAdmin || permissions.archive_donor) && (
                <button
                  onClick={() => archiveDonor(donor.id)}
                  className="
                    flex-1
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    py-3
                    rounded-2xl
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Archive size={16} />
                  Archive
                </button>
              )}
            </div>
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

export default ViewDonors;
