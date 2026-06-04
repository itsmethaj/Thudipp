import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import {
  UserRound,
  Phone,
  Mail,
  GraduationCap,
  ShieldCheck,
  BadgeInfo,
  Lock,
  Unlock,
  Trash2,
} from "lucide-react";

function ViewVolunteers() {
const [volunteers, setVolunteers] = useState([]);

useEffect(() => {
fetchVolunteers();
}, []);

async function fetchVolunteers() {
const { data, error } = await supabase
.from("users")
.select("*")
.eq("role", "volunteer")
.order("id", { ascending: false });

if (!error) {
  setVolunteers(data || []);
}

}
async function toggleStatus(id, active) {
  const volunteer = volunteers.find((v) => v.id === id);

  const { error } = await supabase
    .from("users")
    .update({
      active: !active,
    })
    .eq("id", id);

  if (!error) {
    await supabase.from("activity_logs").insert([
      {
        action: active ? "Volunteer Blocked" : "Volunteer Unblocked",

        admission_no: volunteer.admission_no,

        performed_by: user.username,

        created_at: new Date().toISOString(),
      },
    ]);

    fetchVolunteers();
  }
}

async function deleteVolunteer(id) {
  const confirmDelete = window.confirm("Delete this volunteer?");

  if (!confirmDelete) return;

  const volunteer = volunteers.find((v) => v.id === id);

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (!error) {
    await supabase.from("activity_logs").insert([
      {
        action: "Volunteer Deleted",

        admission_no: volunteer.admission_no,

        performed_by: user.username,

        created_at: new Date().toISOString(),
      },
    ]);

    fetchVolunteers();
  }
}

return (
  <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
    {" "}
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-[#B3001B] mb-6">Volunteers</h1>

      <div className="space-y-4">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="
    bg-white
    rounded-[28px]
    border border-gray-100
    shadow-[0_10px_40px_rgba(0,0,0,0.06)]
    p-5
  "
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div
                  className="
          w-14 h-14
          rounded-2xl
          bg-red-50
          flex items-center justify-center
        "
                >
                  <UserRound size={24} className="text-[#B3001B]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {volunteer.full_name || "No Name"}
                  </h2>

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
            font-medium
            mt-1
          "
                  >
                    <BadgeInfo size={12} />
                    {volunteer.admission_no}
                  </div>
                </div>
              </div>

              <div
                className={`
        px-3 py-1.5
        rounded-full
        text-xs
        font-semibold
        ${
          volunteer.active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
              >
                {volunteer.active ? "Active" : "Blocked"}
              </div>
            </div>

            <div className="grid gap-3 mt-5">
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span className="text-sm">{volunteer.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span className="text-sm">{volunteer.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap size={16} />
                <span className="text-sm">{volunteer.course}</span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold text-sm mb-2">Permissions</h3>

              <div className="flex flex-wrap gap-2">
                {volunteer.permissions &&
                  Object.entries(volunteer.permissions)
                    .filter(([, value]) => value)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="
                bg-blue-50
                text-blue-700
                px-3
                py-1
                rounded-full
                text-xs
                font-medium
              "
                      >
                        {key.replaceAll("_", " ")}
                      </span>
                    ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => toggleStatus(volunteer.id, volunteer.active)}
                className={`
        flex-1
        py-3
        rounded-2xl
        text-white
        font-semibold
        flex
        items-center
        justify-center
        gap-2
        ${volunteer.active ? "bg-orange-500" : "bg-green-600"}
      `}
              >
                {volunteer.active ? (
                  <>
                    <Lock size={18} />
                    Block
                  </>
                ) : (
                  <>
                    <Unlock size={18} />
                    Unblock
                  </>
                )}
              </button>

              <button
                onClick={() => deleteVolunteer(volunteer.id)}
                className="
        flex-1
        bg-red-600
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
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {volunteers.length === 0 && (
          <div className="bg-white rounded-3xl p-6 text-center shadow-md">
            No Volunteers Found
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default ViewVolunteers;
