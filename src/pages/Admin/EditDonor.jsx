import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

function EditDonor() {
  const navigate = useNavigate();

  const donorId = localStorage.getItem("editDonorId");
  const [originalData, setOriginalData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};

  const isAdmin = user?.role === "admin";

  if (!isAdmin && !permissions.edit_donor) {
    return <div className="p-10 text-center">Access Denied</div>;
  }

  const [loading, setLoading] = useState(true);

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
    available: true,
  });

  useEffect(() => {
    fetchDonor();
  }, []);

async function fetchDonor() {
  const { data, error } = await supabase
    .from("donors")
    .select("*")
    .eq("id", donorId)
    .single();

  if (!error && data) {
    setOriginalData(data);

    setFormData({
      admission_no: data.admission_no || "",
      name: data.name || "",
      blood_group: data.blood_group || "",
      gender: data.gender || "",
      phone: data.phone || "",
      place: data.place || "",
      address: data.address || "",
      dob: data.dob || "",
      course: data.course || "",
      year_joined: data.year_joined || "",
      available: data.available ?? true,
    });
  }

  setLoading(false);
}

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

async function handleSubmit(e) {
  e.preventDefault();

  if (
    JSON.stringify(formData) ===
    JSON.stringify({
      admission_no: originalData.admission_no || "",
      name: originalData.name || "",
      blood_group: originalData.blood_group || "",
      gender: originalData.gender || "",
      phone: originalData.phone || "",
      place: originalData.place || "",
      address: originalData.address || "",
      dob: originalData.dob || "",
      course: originalData.course || "",
      year_joined: originalData.year_joined || "",
      available: originalData.available ?? true,
    })
  ) {
    alert("No changes made");
    return;
  }

  const { error } = await supabase
    .from("donors")
    .update(formData)
    .eq("id", donorId);

  if (error) {
    alert(error.message);
    return;
  }

  // Activity Log here

  alert("Donor updated successfully");

  navigate("/admin/view-donors");
}

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate("/admin/view-donors")}
          className="mb-4 bg-gray-200 px-4 py-2 rounded-xl"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-black text-[#B3001B] mb-5">Edit Donor</h1>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className="bg-white rounded-3xl p-5 shadow-md space-y-3"
        >
          <input
            type="text"
            name="admission_no"
            value={formData.admission_no}
            onChange={handleChange}
            placeholder="Admission Number"
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            placeholder="Blood Group"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="Place"
            className="w-full border rounded-xl p-3"
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Course"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            name="year_joined"
            value={formData.year_joined}
            onChange={handleChange}
            placeholder="Year Joined"
            className="w-full border rounded-xl p-3"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>

          <button
            type="submit"
            className="w-full bg-[#B3001B] text-white py-3 rounded-xl font-semibold"
          >
            Update Donor
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditDonor;
