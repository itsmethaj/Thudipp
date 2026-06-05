import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SlidersHorizontal, Download } from "lucide-react";

function ExportPDF() {
  const [reportType, setReportType] = useState("donors"); // "donors" or "volunteers"
  const [bloodGroup, setBloodGroup] = useState("");
  const [availability, setAvailability] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [logoBase64, setLogoBase64] = useState("");

  // Convert logo file to Base64 format on initial mount for jsPDF injection
  useEffect(() => {
    const convertLogoToBase64 = async () => {
      try {
        const response = await fetch("/logo.png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Logo vector file missing from public folder:", err);
      }
    };
    convertLogoToBase64();
  }, []);

  async function exportPDF() {
    let data = [];
    let error = null;
    let reportTitle = "";

    // --- DATA FETCHING & TITLE LOGIC FOR DONORS ---
    if (reportType === "donors") {
      let query = supabase.from("donors").select("*").eq("archived", false);

      if (bloodGroup) {
        query = query.eq("blood_group", bloodGroup);
      }

      // Fixed matching logic block to correctly process unavailable (false) flag strings
      if (availability !== "") {
        const isAvailableTarget = availability === "true";
        query = query.eq("available", isAvailableTarget);
      }

      const res = await query;
      data = res.data;
      error = res.error;

      reportTitle = "THUDIPP DONORS REPORT";
      if (bloodGroup && availability !== "") {
        reportTitle = `THUDIPP ${bloodGroup} (${availability === "true" ? "AVAILABLE" : "UNAVAILABLE"}) DONORS REPORT`;
      } else if (bloodGroup) {
        reportTitle = `THUDIPP ${bloodGroup} DONORS REPORT`;
      } else if (availability !== "") {
        reportTitle = `THUDIPP ${availability === "true" ? "AVAILABLE" : "UNAVAILABLE"} DONORS REPORT`;
      }
    }
    // --- DATA FETCHING & TITLE LOGIC FOR VOLUNTEERS ---
    else {
      let query = supabase.from("users").select("*");

      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }

      const res = await query;
      data = res.data;
      error = res.error;

      reportTitle = "THUDIPP VOLUNTEERS REPORT";
      if (roleFilter) {
        reportTitle = `THUDIPP ${roleFilter.toUpperCase()} COORDINATORS REPORT`;
      }
    }

    if (error) {
      alert(error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert("No registered records matched this filter query.");
      return;
    }

    // Initialize landscape document structure
    const doc = new jsPDF({ orientation: "l", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Center the Logo Emblem Graphic
    if (logoBase64) {
      const logoWidth = 14;
      const logoHeight = 14;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(logoBase64, "PNG", logoX, 10, logoWidth, logoHeight);
    }

    // Render Center-Aligned Core Header Titles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(179, 0, 27); // #B3001B Brand Crimson
    doc.text(reportTitle, pageWidth / 2, 30, { align: "center" });

    // Render Center-Aligned Subtext Metadata String
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    const today = new Date().toLocaleDateString();
    doc.text(
      `Generated: ${today}  |  Total Records: ${data.length}`,
      pageWidth / 2,
      35,
      { align: "center" },
    );

    // --- CONDITIONAL TABLE SCHEMA GENERATION ---
    if (reportType === "donors") {
      autoTable(doc, {
        startY: 42,
        head: [
          [
            "Adm No",
            "Full Name",
            "Blood",
            "Phone",
            "Course",
            "Joined",
            "D.O.B",
            "Last Donated",
            "Place",
            "Current Address",
          ],
        ],
        body: data.map((donor) => [
          donor.admission_no || "-",
          donor.name || "-",
          donor.blood_group || "-",
          donor.phone || "-",
          donor.course || "-",
          donor.year_joined || "-",
          donor.dob || "-",
          donor.last_donation || "Never",
          donor.place || "-",
          donor.address || "-",
        ]),
        styles: {
          fontSize: 8.5,
          cellPadding: 3,
          valign: "middle",
          font: "helvetica",
          textColor: [40, 40, 40],
          lineWidth: 0.1,
          borderColor: [235, 235, 235],
        },
        headStyles: {
          fillColor: [179, 0, 27],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          lineWidth: 0,
        },
        columnStyles: {
          0: { cellWidth: 22, fontStyle: "bold" },
          1: { cellWidth: 34 },
          2: { cellWidth: 14, halign: "center", fontStyle: "bold" },
          3: { cellWidth: 24 },
          4: { cellWidth: 20 },
          5: { cellWidth: 14, halign: "center" },
          6: { cellWidth: 20, halign: "center" },
          7: { cellWidth: 24, halign: "center" },
          8: { cellWidth: 25 },
          9: { cellWidth: "auto" },
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { top: 42, left: 14, right: 14, bottom: 15 },
      });
    } else {
      autoTable(doc, {
        startY: 42,
        head: [
          [
            "Username / Name",
            "System Role",
            "Contact Number",
            "Account Status",
            "Assigned Permissions",
          ],
        ],
        body: data.map((vol) => {
          let parsedPermissions = {};
          try {
            parsedPermissions =
              typeof vol.permissions === "string"
                ? JSON.parse(vol.permissions || "{}")
                : vol.permissions || {};
          } catch (e) {
            console.error(
              "Failed to parse permissions cell data structural mapping",
              e,
            );
          }

          const activePermissions = Object.keys(parsedPermissions)
            .filter((key) => parsedPermissions[key] === true)
            .map((key) => key.replace(/_/g, " "))
            .join(", ");

          return [
            vol.username || "-",
            vol.role ? vol.role.toUpperCase() : "-",
            vol.phone || "-",
            vol.active ? "ACTIVE" : "SUSPENDED",
            activePermissions || "None Assigned",
          ];
        }),
        styles: {
          fontSize: 9,
          cellPadding: 3.5,
          valign: "middle",
          font: "helvetica",
          textColor: [40, 40, 40],
          lineWidth: 0.1,
          borderColor: [235, 235, 235],
        },
        headStyles: {
          fillColor: [179, 0, 27],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          lineWidth: 0,
        },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: "bold" },
          1: { cellWidth: 35, halign: "center" },
          2: { cellWidth: 40 },
          3: { cellWidth: 35, halign: "center" },
          4: { cellWidth: "auto" },
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { top: 42, left: 14, right: 14, bottom: 15 },
      });
    }

    // Save File out using structural slug definitions
    doc.save(`thudipp-${reportTitle.toLowerCase().replace(/ /g, "-")}.pdf`);

    // Complete background log telemetry insertions
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    await supabase.from("activity_logs").insert([
      {
        actor_username: user.username,
        actor_role: user.role,
        action: "EXPORT_PDF",
        target_type: reportType === "donors" ? "DONOR" : "USER",
        details: `Exported: ${reportTitle}`,
      },
    ]);
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F6F7FB] px-3 sm:px-6 pb-10">
      {/* Centered Page Header */}
      <div className="bg-white rounded-3xl max-w-xl mx-auto text-center p-5 border border-gray-100 shadow-sm mb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-[#B3001B]">
          Export Registry Reports
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Generate high-fidelity tabular administrative documents
        </p>
      </div>

      {/* Configuration Parameter Panel */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-5">
        {/* Category Selector Buttons */}
        <div>
          <label className="block text-[11px] sm:text-xs font-black text-gray-400 uppercase tracking-wide mb-2 px-0.5">
            Select Report Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setReportType("donors")}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                reportType === "donors"
                  ? "bg-[#B3001B] text-white border-[#B3001B] shadow-sm"
                  : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
              }`}
            >
              Donors List
            </button>
            <button
              onClick={() => setReportType("volunteers")}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                reportType === "volunteers"
                  ? "bg-[#B3001B] text-white border-[#B3001B] shadow-sm"
                  : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
              }`}
            >
              Volunteers & Staff
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 pb-3 border-b border-gray-50 text-gray-800">
          <SlidersHorizontal size={15} className="text-[#B3001B]" />
          <span className="text-xs font-bold tracking-wide text-gray-400 uppercase">
            Filters & Sub-Parameters
          </span>
        </div>

        <div className="space-y-3">
          {reportType === "donors" ? (
            <>
              {/* Blood Group Dropdown */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 px-0.5">
                  Blood Group Pool
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 text-sm rounded-xl p-2.5 text-gray-700 focus:outline-none focus:border-red-200 cursor-pointer transition-colors"
                >
                  <option value="">All Blood Groups</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Availability Dropdown */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 px-0.5">
                  Availability Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 text-sm rounded-xl p-2.5 text-gray-700 focus:outline-none focus:border-red-200 cursor-pointer transition-colors"
                >
                  <option value="">All Status Enrolled Pools</option>
                  <option value="true">Active & Ready (Available Only)</option>
                  <option value="false">On Hold / Unavailable Only</option>
                </select>
              </div>
            </>
          ) : (
            /* Role Filtering Dropdown for Volunteers */
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 px-0.5">
                Filter By Administrative Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-100 text-sm rounded-xl p-2.5 text-gray-700 focus:outline-none focus:border-red-200 cursor-pointer transition-colors"
              >
                <option value="">All Management Personnel</option>
                <option value="admin">Super Admins Only</option>
                <option value="volunteer">Standard Volunteers Only</option>
              </select>
            </div>
          )}

          {/* Action Execution Button */}
          <button
            onClick={exportPDF}
            className="w-full mt-2 bg-[#B3001B] text-white py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
          >
            <Download size={15} />
            Generate {reportType === "donors" ? "Donors" : "Volunteers"} PDF
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportPDF;
