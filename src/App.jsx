import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";

import Home from "./pages/Home";
import Donors from "./pages/Donors";
import Login from "./pages/Login";

import Dashboard from "./pages/Admin/Dashboard";

import AddDonor from "./pages/Admin/AddDonor";
import ViewDonors from "./pages/Admin/ViewDonors";
import EditDonor from "./pages/Admin/EditDonor";
import Archive from "./pages/Admin/Archive";
import ExportPDF from "./pages/Admin/ExportPDF";
import ManageBanners from "./pages/Admin/ManageBanners"; // 1. Imported the ManageBanners page component

import AccessControlDashboard from "./pages/Admin/AccessControl/AccessControlDashboard";
import CreateVolunteer from "./pages/Admin/AccessControl/CreateVolunteer";
import ViewVolunteers from "./pages/Admin/AccessControl/ViewVolunteers";

import ActivityLogs from "./pages/Admin/ActivityLogs";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Mount full-screen splash animation handler mask globally on load */}
      {isLoading && <SplashScreen finishLoading={() => setIsLoading(false)} />}

      {/* Primary layout container with structural fade-in mask */}
      <div
        className={
          isLoading
            ? "hidden"
            : "block transition-opacity duration-500 animate-fade-in"
        }
      >
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/login" element={<Login />} />

            {/* Shared Dashboard */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/volunteer" element={<Dashboard />} />

            {/* Donor Management */}
            <Route path="/admin/add-donor" element={<AddDonor />} />
            <Route path="/admin/view-donors" element={<ViewDonors />} />
            <Route path="/admin/edit-donor" element={<EditDonor />} />
            <Route path="/admin/archive" element={<Archive />} />
            <Route path="/admin/export-pdf" element={<ExportPDF />} />

            {/* System Settings & Customization */}
            {/* 2. Registered Admin Custom Carousel Banner Upload Management Route */}
            <Route path="/admin/manage-banners" element={<ManageBanners />} />

            {/* Access Control */}
            <Route
              path="/admin/access-control"
              element={<AccessControlDashboard />}
            />
            <Route
              path="/admin/create-volunteer"
              element={<CreateVolunteer />}
            />
            <Route path="/admin/view-volunteers" element={<ViewVolunteers />} />

            {/* Activity Logs */}
            <Route path="/admin/activity-logs" element={<ActivityLogs />} />
            <Route path="/volunteer/add-donor" element={<AddDonor />} />
            <Route path="/volunteer/view-donors" element={<ViewDonors />} />
            <Route path="/volunteer/activity-logs" element={<ActivityLogs />} />
            <Route path="/volunteer/export-pdf" element={<ExportPDF />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
