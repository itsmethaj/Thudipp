import { useState, useEffect } from "react";
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
import ManageBanners from "./pages/Admin/ManageBanners";
import AccessControlDashboard from "./pages/Admin/AccessControl/AccessControlDashboard";
import CreateVolunteer from "./pages/Admin/AccessControl/CreateVolunteer";
import ViewVolunteers from "./pages/Admin/AccessControl/ViewVolunteers";
import EditVolunteer from "./pages/Admin/AccessControl/EditVolunteer";
import ActivityLogs from "./pages/Admin/ActivityLogs";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [manifest, setManifest] = useState(["/logo.png"]);

  useEffect(() => {
    async function fetchHomeAssets() {
      try {
        const response = await fetch("https://api.thudipp.com/banners");
        const bannerData = await response.json();
        if (Array.isArray(bannerData)) {
          setManifest(["/logo.png", ...bannerData]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch dynamic banners, falling back to logo only:",
          error,
        );
        setManifest(["/logo.png"]);
      }
    }
    fetchHomeAssets();
  }, []);

  return (
    <>
      {isLoading && (
        <SplashScreen
          manifest={manifest}
          finishLoading={() => setIsLoading(false)}
        />
      )}

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
            <Route path="/" element={<Home />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<Dashboard />} />
            <Route path="/volunteer" element={<Dashboard />} />

            <Route path="/admin/add-donor" element={<AddDonor />} />
            <Route path="/admin/view-donors" element={<ViewDonors />} />
            <Route path="/admin/edit-donor" element={<EditDonor />} />
            <Route path="/admin/archive" element={<Archive />} />
            <Route path="/admin/export-pdf" element={<ExportPDF />} />

            <Route path="/admin/manage-banners" element={<ManageBanners />} />

            <Route
              path="/admin/access-control"
              element={<AccessControlDashboard />}
            />
            <Route
              path="/admin/create-volunteer"
              element={<CreateVolunteer />}
            />
            <Route path="/admin/view-volunteers" element={<ViewVolunteers />} />
            <Route
              path="/admin/edit-volunteer/:id"
              element={<EditVolunteer />}
            />

            <Route path="/admin/activity-logs" element={<ActivityLogs />} />
            <Route path="/volunteer/add-donor" element={<AddDonor />} />
            <Route path="/volunteer/view-donors" element={<ViewDonors />} />
            <Route path="/volunteer/activity-logs" element={<ActivityLogs />} />
            <Route path="/volunteer/export-pdf" element={<ExportPDF />} />
            <Route
              path="/volunteer/manage-banners"
              element={<ManageBanners />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
