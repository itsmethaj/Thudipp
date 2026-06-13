import { useState } from "react";
import { supabase } from "../../../supabase";
import { useNavigate } from "react-router-dom";

function CreateVolunteer() {
  const navigate = useNavigate();

  const [admissionNo, setAdmissionNo] = useState("");
  const [volunteer, setVolunteer] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [permissions, setPermissions] = useState({
    view_phone: false,
    view_address: false,
    view_dob: false,
    add_donor: false,
    edit_donor: false,
    archive_donor: false,
    export_pdf: false,
    view_analytics: false,
    manage_volunteers: false,
    manage_banners: false,
  });

  async function checkVolunteer() {
    const admission = admissionNo.trim();

    if (!admission) {
      alert("Enter Admission Number");
      return;
    }

    const { data: donor, error: donorError } = await supabase
      .from("donors")
      .select("*")
      .eq("admission_no", admission)
      .single();

    if (donorError || !donor) {
      alert("Admission Number not found");
      setVolunteer(null);
      return;
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id, username")
      .eq("admission_no", admission)
      .maybeSingle();

    if (existingUser) {
      alert(`Already a volunteer account (${existingUser.username})`);
      setVolunteer(null);
      return;
    }

    setVolunteer(donor);
  }

  function togglePermission(key) {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!volunteer) {
      alert("Please verify volunteer first");
      return;
    }

    const { data: exists } = await supabase
      .from("users")
      .select("id")
      .eq("admission_no", volunteer.admission_no)
      .maybeSingle();

    if (exists) {
      alert("Volunteer already exists");
      return;
    }

    const { error } = await supabase.from("users").insert([
      {
        admission_no: volunteer.admission_no,
        username: email,
        email,
        password,
        role: "volunteer",
        active: true,
        full_name: volunteer.name,
        phone: volunteer.phone,
        course: volunteer.course,
        year_of_study: volunteer.year_joined,
        permissions,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const { error: logError } = await supabase.from("activity_logs").insert([
      {
        actor_username: user.username,
        actor_role: user.role,
        action: "CREATE_VOLUNTEER",
        target_type: "VOLUNTEER",
        target_admission_no: volunteer.admission_no,
        details: `Created volunteer account for ${volunteer.name}`,
      },
    ]);

    if (logError) {
      console.log("Activity Log Error:", logError);
    }

    alert("Volunteer created successfully");
    navigate("/admin/view-volunteers");
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="bg-white rounded-3xl max-w-6xl text-center p-6 mx-auto shadow-sm mb-5">
        <h1 className="text-3xl font-black text-[#B3001B]">Create Volunteer</h1>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 shadow-md">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Admission Number"
            value={admissionNo}
            onChange={(e) => setAdmissionNo(e.target.value)}
            className="flex-1 border rounded-xl p-3"
          />
          <button
            type="button"
            onClick={checkVolunteer}
            className="bg-[#B3001B] text-white px-5 rounded-xl"
          >
            Check
          </button>
        </div>

        {volunteer && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <h2 className="text-xl font-bold text-[#B3001B]">
                Donor Information
              </h2>
              <p>
                <strong>Name:</strong> {volunteer.name}
              </p>
              <p>
                <strong>Admission No:</strong> {volunteer.admission_no}
              </p>
              <p>
                <strong>Blood Group:</strong> {volunteer.blood_group}
              </p>
              <p>
                <strong>Gender:</strong> {volunteer.gender}
              </p>
              <p>
                <strong>Phone:</strong> {volunteer.phone}
              </p>
              <p>
                <strong>Place:</strong> {volunteer.place}
              </p>
              <p>
                <strong>Address:</strong> {volunteer.address}
              </p>
              <p>
                <strong>DOB:</strong> {volunteer.dob}
              </p>
              <p>
                <strong>Course:</strong> {volunteer.course}
              </p>
              <p>
                <strong>Year Joined:</strong> {volunteer.year_joined}
              </p>
              <p>
                <strong>Available:</strong> {volunteer.available ? "Yes" : "No"}
              </p>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl p-3"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl p-3"
              required
            />

            <div className="space-y-4">
              <div className="border rounded-2xl p-4">
                <h2 className="font-bold text-lg mb-3 text-[#B3001B]">
                  Dashboard Features
                </h2>
                {[
                  ["add_donor", "Add Donor"],
                  ["view_donors", "View Donors"],
                  ["view_analytics", "Analytics"],
                  ["archive", "Archive"],
                  ["export_pdf", "Export PDF"],
                  ["manage_banners", "Manage Banners"],
                  ["activity_logs", "Activity Logs"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={permissions[key]}
                      onChange={() => togglePermission(key)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {permissions.view_donors && (
                <div className="border rounded-2xl p-4">
                  <h2 className="font-bold text-lg mb-3 text-[#B3001B]">
                    Donor Permissions
                  </h2>
                  {[
                    ["edit_donor", "Edit Donor"],
                    ["archive_donor", "Archive Donor"],
                    ["delete_donor", "Delete Donor"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={permissions[key]}
                        onChange={() => togglePermission(key)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {permissions.view_donors && (
                <div className="border rounded-2xl p-4">
                  <h2 className="font-bold text-lg mb-3 text-[#B3001B]">
                    Visible Donor Information
                  </h2>
                  {[
                    ["view_phone", "Phone Number"],
                    ["view_address", "Address"],
                    ["view_dob", "Date of Birth"],
                    ["view_email", "Email"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={permissions[key]}
                        onChange={() => togglePermission(key)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#B3001B] text-white py-3 rounded-xl font-semibold"
            >
              Create Volunteer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateVolunteer;
