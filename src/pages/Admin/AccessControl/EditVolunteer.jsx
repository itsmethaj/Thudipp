import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import { ShieldCheck, KeyRound, ArrowLeft, Save } from "lucide-react";

function EditVolunteer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [volunteer, setVolunteer] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const permissionStructure = {
    dashboard: [
      ["add_donor", "Add Donor"],
      ["view_donors", "View Donors"],
      ["view_analytics", "Analytics"],
      ["archive", "Archive"],
      ["export_pdf", "Export PDF"],
      ["manage_banners", "Manage Banners"],
      ["activity_logs", "Activity Logs"],
    ],
    actions: [
      ["edit_donor", "Edit Donor"],
      ["archive_donor", "Archive Donor"],
      ["delete_donor", "Delete Donor"],
    ],
    visibility: [
      ["view_phone", "Phone Number"],
      ["view_address", "Address"],
      ["view_dob", "Date of Birth"],
      ["view_email", "Email"],
    ],
  };

  useEffect(() => {
    async function fetchVolunteer() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setVolunteer(data);
        setPermissions(data.permissions || {});
      }
      setLoading(false);
    }
    fetchVolunteer();
  }, [id]);

  function handlePermissionChange(key, value) {
    setPermissions((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "view_donors" && !value) {
        permissionStructure.actions.forEach(([actionKey]) => {
          updated[actionKey] = false;
        });
        permissionStructure.visibility.forEach(([visKey]) => {
          updated[visKey] = false;
        });
      }
      return updated;
    });
  }

  async function handleSaveChanges() {
    const { error: permError } = await supabase
      .from("users")
      .update({ permissions })
      .eq("id", id);

    if (permError) {
      alert(permError.message);
      return;
    }

    await supabase.from("activity_logs").insert([
      {
        action: "UPDATE_PERMISSIONS",
        actor_username: currentUser.username,
        actor_role: currentUser.role,
        target_type: "VOLUNTEER",
        target_admission_no: volunteer.admission_no,
        details: `Updated permissions for ${volunteer.full_name}`,
      },
    ]);

    if (newPassword.trim()) {
      const { error: passError } = await supabase
        .from("users")
        .update({ password: newPassword })
        .eq("id", id);

      if (passError) {
        alert(
          "Permissions saved, but password update failed: " + passError.message,
        );
        return;
      }

      await supabase.from("activity_logs").insert([
        {
          action: "RESET_PASSWORD",
          actor_username: currentUser.username,
          actor_role: currentUser.role,
          target_type: "VOLUNTEER",
          target_admission_no: volunteer.admission_no,
          details: `Reset password for ${volunteer.full_name}`,
        },
      ]);
    }

    alert("Volunteer configuration updated successfully");

    navigate("/admin", { replace: false });
    setTimeout(() => {
      navigate("/admin/view-volunteers", { replace: false });
    }, 0);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">
        Loading...
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">
        Volunteer not found
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 bg-white rounded-3xl p-6 shadow-sm mb-5">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/view-volunteers", { replace: true })
            }
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-black text-[#B3001B] flex-1 text-center pr-10">
            Manage: {volunteer.full_name}
          </h1>
        </div>

        <div className="bg-white rounded-[28px] border border-gray-100 shadow-md p-6 grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Permissions
            </h2>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              <div className="border rounded-2xl p-4 bg-gray-50/50">
                <h3 className="font-bold text-sm mb-3 text-[#B3001B]">
                  Dashboard Features
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {permissionStructure.dashboard.map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-2 bg-white rounded-xl border text-xs cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={!!permissions[key]}
                        onChange={(e) =>
                          handlePermissionChange(key, e.target.checked)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {permissions.view_donors && (
                <div className="border rounded-2xl p-4 bg-gray-50/50 animate-fade-in">
                  <h3 className="font-bold text-sm mb-3 text-[#B3001B]">
                    Donor Management Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {permissionStructure.actions.map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 p-2 bg-white rounded-xl border text-xs cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={!!permissions[key]}
                          onChange={(e) =>
                            handlePermissionChange(key, e.target.checked)
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {permissions.view_donors && (
                <div className="border rounded-2xl p-4 bg-gray-50/50 animate-fade-in">
                  <h3 className="font-bold text-sm mb-3 text-[#B3001B]">
                    Visible Donor Information
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {permissionStructure.visibility.map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 p-2 bg-white rounded-xl border text-xs cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={!!permissions[key]}
                          onChange={(e) =>
                            handlePermissionChange(key, e.target.checked)
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 flex flex-col justify-start">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Reset Password
            </h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter New Password (Leave blank to keep old password)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-xl p-3 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="w-full bg-[#B3001B] hover:bg-[#910014] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <Save size={22} />
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default EditVolunteer;
