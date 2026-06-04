import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

function AddDonor() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};

  const isAdmin = user?.role === "admin";

  if (!isAdmin && !permissions.add_donor) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Access Denied
      </div>
    );
  }

const [formData, setFormData] = useState({
  admission_no: "",
  name: "",
  blood_group: "",
  gender: "",
  phone: "",
  place: "",
  address: "",
  dob: "",
  course: "",
  year_joined: "",
  last_donation: "",
  available: true,
  archived: false,
});
  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from("donors").insert([formData]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    const { error: logError } = await supabase.from("activity_logs").insert([
      {
        actor_username: user.username,

        actor_role: user.role,

        action: "ADD_DONOR",

        target_type: "DONOR",

        target_admission_no: formData.admission_no,

        details: `Added donor ${formData.name}`,
      },
    ]);

    if (logError) {
      console.log("Activity Log Error:", logError);
    }

    alert("Donor added successfully");

    setFormData({
      admission_no: "",
      name: "",
      blood_group: "",
      gender: "",
      phone: "",
      place: "",
      address: "",
      dob: "",
      course: "",
      year_joined: "",
      available: true,
      archived: false,
    });

    navigate("/admin/view-donors");
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="bg-white rounded-3xl text-center p-6 shadow-sm mb-5">
        <h1 className="text-3xl font-black text-[#B3001B]">Add Donor</h1>
      </div>
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="admission_no"
            placeholder="Admission Number"
            value={formData.admission_no}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          >
            <option value="">Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="text"
            name="place"
            placeholder="Place"
            value={formData.place}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Donation Date
            </label>

            <input
              type="date"
              name="last_donation"
              value={formData.last_donation}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* Course Selection */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Course</h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                "BA ENGLISH",
                "BA ECONOMICS",
                "BA JOURNALISM",
                "BA POLITICAL",
                "BA SOCIOLOGY",
                "BSC PSYCHOLOGY",
                "BCOM CO-OP",
                "BCOM FINANCE",
                "BSC CS",
              ].map((course) => (
                <button
                  type="button"
                  key={course}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      course,
                    })
                  }
                  className={`h-12 px-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    formData.course === course
                      ? "bg-[#B3001B] text-white shadow-lg"
                      : "bg-white text-[#B3001B] border border-red-100"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          <input
            type="number"
            name="year_joined"
            placeholder="Year Joined"
            value={formData.year_joined}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available to Donate
          </label>

          <button
            type="submit"
            className="w-full bg-[#B3001B] text-white py-3 rounded-xl font-semibold"
          >
            Add Donor
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonor;
