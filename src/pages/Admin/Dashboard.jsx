import React from "react";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import {
  UserPlus,
  Users,
  Archive,
  FileText,
  Shield,
  ClipboardList,
  LogOut,
  ChevronRight,
  Image,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">
        Access Denied
      </div>
    );
  }

  const actions = [
    {
      title: "Add Donor",
      description: "Register a new blood donor",
      icon: UserPlus,
      page: user.role === "admin" ? "/admin/add-donor" : "/volunteer/add-donor",
      permission: "add_donor",
    },
    {
      title: "View Donors",
      description: "Manage donor records",
      icon: Users,
      page:
        user.role === "admin" ? "/admin/view-donors" : "/volunteer/view-donors",
      permission: "view_donors",
    },
    {
      title: "Archive",
      description: "Archived donor records",
      icon: Archive,
      page: "/admin/archive",
      permission: "archive_donor",
      adminOnly: true,
    },
    {
      title: "Export PDF",
      description: "Generate donor reports",
      icon: FileText,
      page:
        user.role === "admin" ? "/admin/export-pdf" : "/volunteer/export-pdf",
      permission: "export_pdf",
    },
    {
      title: "Manage Banners",
      description: "Upload homepage carousel sliders",
      icon: Image,
      page:
        user.role === "admin"
          ? "/admin/manage-banners"
          : "/volunteer/manage-banners",
      permission: "manage_banners",
    },
    {
      title: "Access Control",
      description: "Manage volunteers",
      icon: Shield,
      page: "/admin/access-control",
      permission: "access_control",
      adminOnly: true,
    },
    {
      title: "Activity Logs",
      description: "Track all actions",
      icon: ClipboardList,
      page:
        user.role === "admin"
          ? "/admin/activity-logs"
          : "/volunteer/activity-logs",
      permission: "activity_logs",
    },
  ];

  const visibleActions = actions.filter((action) => {
    if (user.role === "admin") return true;
    if (action.adminOnly) return false;
    return permissions[action.permission];
  });

  return (
    <div className="min-h-screen pt-25 bg-[#F6F7FB] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl text-center p-6 shadow-sm mb-5 border border-gray-100/40">
          <h1 className="text-3xl font-black text-[#B3001B]">
            {user.role === "admin" ? "Admin Dashboard" : "Volunteer Dashboard"}
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-5">
          {visibleActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.page)}
                className="bg-white rounded-3xl p-5 min-h-[150px] shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100/50 transition-all duration-300 text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center transition-colors group-hover:bg-[#B3001B]/5">
                    <Icon size={22} className="text-[#B3001B]" />
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
                <h3 className="font-bold text-gray-900 mt-4 group-hover:text-[#B3001B] transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
        <Analytics />
        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("permissions");
            navigate("/login");
          }}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
