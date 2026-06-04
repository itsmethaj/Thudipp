import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

function Archive() {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};

  const isAdmin = user?.role === "admin";

  if (!isAdmin && !permissions.archive_donor) {
    return <div className="p-10 text-center">Access Denied</div>;
  }

  useEffect(() => {
    fetchArchivedDonors();
  }, []);

  async function fetchArchivedDonors() {
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .eq("archived", true)
      .order("id", {
        ascending: false,
      });

    if (!error) {
      setDonors(data || []);
    }
  }

  async function restoreDonor(id) {
    const confirmRestore = window.confirm("Restore this donor?");

    if (!confirmRestore) return;

    const { error } = await supabase
      .from("donors")
      .update({
        archived: false,
      })
      .eq("id", id);

    if (!error) {
      alert("Donor restored successfully");

      fetchArchivedDonors();
    }
  }

  async function deleteDonor(id) {
    const confirmDelete = window.confirm("Permanently delete this donor?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("donors").delete().eq("id", id);

    if (!error) {
      alert("Donor deleted permanently");

      fetchArchivedDonors();
    }
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin/view-donors")}
          className="mb-4 bg-gray-200 px-4 py-2 rounded-xl"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-black text-[#B3001B] mb-6">
          Archived Donors
        </h1>

        <div className="space-y-4">
          {donors.map((donor) => (
            <div key={donor.id} className="bg-white rounded-3xl p-4 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{donor.name}</h2>

                  <p className="text-gray-500">
                    {donor.blood_group}
                    {" • "}
                    {donor.gender}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                  Archived
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                {(isAdmin || permissions.view_phone) && <p>📞 {donor.phone}</p>}

                <p>🎓 {donor.course}</p>

                <p>📅 Joined: {donor.year_joined}</p>

                {(isAdmin || permissions.view_dob) && (
                  <p>🎂 DOB: {donor.dob}</p>
                )}

                <p>📍 {donor.place}</p>

                {(isAdmin || permissions.view_address) && (
                  <p>🏠 {donor.address}</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => restoreDonor(donor.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Restore
                </button>

                {isAdmin && (
                  <button
                    onClick={() => deleteDonor(donor.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {donors.length === 0 && (
            <div className="bg-white rounded-3xl p-6 text-center shadow-md">
              No archived donors found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Archive;
