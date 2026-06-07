import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function ManageBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setBanners(data || []);
    }

    setLoading(false);
  };

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      if (file.size > 7 * 1024 * 1024) {
        alert("Maximum file size is 7MB");
        return;
      }

      setUploading(true);

      const extension = file.name.split(".").pop();

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("assets").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("banners").insert([
        {
          image_url: publicUrl,
          storage_path: fileName,
        },
      ]);

      if (dbError) throw dbError;

      alert("Banner uploaded successfully");
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (banner) => {
    try {
      await supabase.storage.from("assets").remove([banner.storage_path]);

      await supabase.from("banners").delete().eq("id", banner.id);

      fetchBanners();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-28 px-4 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-700">Manage Banners</h1>

          <label className="cursor-pointer">
            <span className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold">
              {uploading ? "Uploading..." : "Upload Banner"}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : banners.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No banners uploaded
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="border rounded-2xl overflow-hidden bg-white"
              >
                <img
                  src={banner.image_url}
                  alt="Banner"
                  className="w-full h-44 object-cover"
                />

                <button
                  onClick={() => handleDelete(banner)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2"
                >
                  Delete Banner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
