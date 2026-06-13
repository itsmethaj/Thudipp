import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { ArrowLeft, Save } from "lucide-react";

function AddDonor() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};
  const isAdmin = user?.role === "admin";

  if (!isAdmin && !permissions.add_donor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
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

    if (name === "name" || name === "place") {
      const cleanValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === "phone" || name === "year_joined") {
      const cleanValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      alert("Error: Phone number must contain exactly 10 digits.");
      return;
    }

    const { error } = await supabase.from("donors").insert([formData]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await supabase.from("activity_logs").insert([
      {
        actor_username: user.username,
        actor_role: user.role,
        action: "ADD_DONOR",
        target_type: "DONOR",
        target_admission_no: formData.admission_no,
        details: `Added donor ${formData.name}`,
      },
    ]);

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
      last_donation: "",
      available: true,
      archived: false,
    });

    const redirectPath = isAdmin
      ? "/admin/view-donors"
      : "/volunteer/view-donors";
    navigate(redirectPath, { replace: true });
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 bg-white rounded-3xl p-6 shadow-sm mb-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-black text-[#B3001B] flex-1 text-center pr-10">
            Add Donor
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-md p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admission Number
              </label>
              <input
                type="text"
                name="admission_no"
                value={formData.admission_no}
                onChange={handleChange}
                placeholder="Admission Number"
                className="w-full border rounded-xl p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name (Alphabets Only)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border rounded-xl p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 text-sm"
                required
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 text-sm"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Phone Number (10 Digits Only)
              </label>
              <input
                type="text"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border rounded-xl p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Place (Alphabets Only)
              </label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="Place"
                className="w-full border rounded-xl p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()}
                onClick={(e) => e.target.showPicker?.()}
                className="w-full border rounded-xl p-3 text-sm cursor-pointer select-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Year Joined (Numbers Only)
              </label>
              <input
                type="text"
                name="year_joined"
                maxLength={4}
                value={formData.year_joined}
                onChange={handleChange}
                placeholder="Year Joined"
                className="w-full border rounded-xl p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Last Donation Date
              </label>
              <input
                type="date"
                name="last_donation"
                value={formData.last_donation}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()}
                onClick={(e) => e.target.showPicker?.()}
                className="w-full border rounded-xl p-3 text-sm cursor-pointer select-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Course
            </label>
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
                  onClick={() => setFormData({ ...formData, course })}
                  className={`h-11 px-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    formData.course === course
                      ? "bg-[#B3001B] text-white shadow-md"
                      : "bg-white text-[#B3001B] border border-red-100 hover:bg-red-50/30"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              rows="3"
              className="w-full border rounded-xl p-3 text-sm"
              required
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer w-max text-sm font-semibold select-none">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-4 h-4 accent-[#B3001B]"
              />
              Available to Donate
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#B3001B] hover:bg-[#910014] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-colors mt-4"
          >
            <Save size={22} />
            Save Donor
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonor;
