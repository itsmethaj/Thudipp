import React from "react";
import Analytics from "./Analytics";

const Admin = ({ setPage }) => {
  const actions = [
    {
      title: "Add Donor",
      icon: "➕",
      page: "add-donor",
    },
    {
      title: "View Donors",
      icon: "👥",
      page: "view-donors",
    },
    {
      title: "Edit Donor",
      icon: "✏️",
      page: "edit-donor",
    },
    {
      title: "Archive",
      icon: "🗂",
      page: "archive",
    },
    {
      title: "Export PDF",
      icon: "📄",
      page: "export-pdf",
    },
    {
      title: "Access Control",
      icon: "🔐",
      page: "access-control",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#B3001B] mb-2">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mb-6">
          Manage donors and system operations
        </p>

        {/* Analytics Section */}

        <div className="mb-6">
          <Analytics />
        </div>

        {/* Quick Actions */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <button
              key={action.title}
              onClick={() => setPage(action.page)}
              className="
                bg-white
                rounded-3xl
                p-5
                shadow-md
                text-left
                hover:scale-105
                hover:shadow-lg
                transition-all
                duration-200
              "
            >
              <div className="text-4xl mb-3">{action.icon}</div>

              <h3 className="font-semibold text-gray-800">{action.title}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
