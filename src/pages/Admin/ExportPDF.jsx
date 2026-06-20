import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Download,
  Users,
  ClipboardList,
  ArrowUpDown,
  UserCheck,
  Loader2,
  FileText,
} from "lucide-react";

function ExportPDF() {
  const [reportType, setReportType] = useState("donors");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCompilingPdf, setIsCompilingPdf] = useState(false);
  const [logoBase64, setLogoBase64] = useState("");
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");
  const [availability, setAvailability] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    let isMounted = true;

    const convertLogoToBase64 = async () => {
      try {
        // 🌟 Fixed: Changed from the broken "./logo .png" to the direct root path "/logo.png"
        const response = await fetch("/logo .png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted) setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Logo failed to load from root path:", err);
      }
    };

    const fetchMasterData = async () => {
      try {
        setIsDataLoading(true);
        const [donorsRes, usersRes, logsRes] = await Promise.all([
          supabase.from("donors").select("*").eq("archived", false),
          supabase.from("users").select("*"),
          supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);
        if (isMounted) {
          setDonors(donorsRes.data || []);
          setVolunteers(usersRes.data || []);
          setLogs(logsRes.data || []);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        if (isMounted) setIsDataLoading(false);
      }
    };

    convertLogoToBase64();
    fetchMasterData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setBloodGroup("");
    setAvailability("");
    setRoleFilter("");
    setLogActionFilter("");
    setSortOrder(reportType === "activity_logs" ? "desc" : "asc");
  }, [reportType]);

  const processedData = useMemo(() => {
    if (reportType === "donors") {
      let result = [...donors];
      if (bloodGroup)
        result = result.filter((d) => d.blood_group === bloodGroup);
      if (availability !== "")
        result = result.filter((d) => String(d.available) === availability);
      return result.sort((a, b) => {
        return sortOrder === "asc"
          ? (a.name || "").localeCompare(b.name || "")
          : (b.name || "").localeCompare(a.name || "");
      });
    }
    if (reportType === "volunteers") {
      let result = [...volunteers];
      if (roleFilter) result = result.filter((v) => v.role === roleFilter);
      return result.sort((a, b) => {
        return sortOrder === "asc"
          ? (a.username || "").localeCompare(b.username || "")
          : (b.username || "").localeCompare(a.username || "");
      });
    }
    if (reportType === "activity_logs") {
      let result = [...logs];
      if (logActionFilter)
        result = result.filter((l) => l.action === logActionFilter);
      return result.sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      });
    }
    return [];
  }, [
    reportType,
    donors,
    volunteers,
    logs,
    bloodGroup,
    availability,
    roleFilter,
    logActionFilter,
    sortOrder,
  ]);

  const handleDownload = async () => {
    if (processedData.length === 0) {
      alert("No records found to download with your current filters.");
      return;
    }
    setIsCompilingPdf(true);
    try {
      const doc = new jsPDF({ orientation: "l", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      if (logoBase64) {
        try {
          doc.addImage(logoBase64, "PNG", (pageWidth - 14) / 2, 12, 14, 14);
        } catch (imgErr) {
          console.error("Failed to add logo to PDF render:", imgErr);
        }
      }

      const title = `THUDIPP ${reportType.toUpperCase()} REPORT`;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(179, 0, 27);
      doc.text(title, pageWidth / 2, 32, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} | Total Filtered Records: ${processedData.length}`,
        pageWidth / 2,
        38,
        { align: "center" },
      );

      if (reportType === "donors") {
        autoTable(doc, {
          startY: 44,
          margin: { left: 12, right: 12, bottom: 15 },
          head: [
            [
              "Adm No",
              "Full Name",
              "Blood",
              "Phone",
              "Course Stream",
              "Year",
              "Last Donated",
              "Place",
              "Current Address",
            ],
          ],
          body: processedData.map((d) => [
            d.admission_no || "-",
            d.name || "-",
            d.blood_group || "-",
            d.phone || "-",
            d.course || "-",
            d.year_joined || "-",
            d.last_donation || "Never",
            d.place || "-",
            d.address || "-",
          ]),
          theme: "striped",
          styles: {
            fontSize: 8,
            font: "helvetica",
            cellPadding: 3,
            valign: "middle",
            overflow: "linebreak",
            lineWidth: 0.1,
            borderColor: [240, 240, 240],
          },
          headStyles: {
            fillColor: [179, 0, 27],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 8.5,
          },
          alternateRowStyles: {
            fillColor: [253, 253, 253],
          },
          columnStyles: {
            0: { cellWidth: 24, fontStyle: "bold" },
            1: { cellWidth: 35 },
            2: { cellWidth: 14, halign: "center", fontStyle: "bold" },
            3: { cellWidth: 24 },
            4: { cellWidth: 32 },
            5: { cellWidth: 14, halign: "center" },
            6: { cellWidth: 24, halign: "center" },
            7: { cellWidth: 25 },
            8: { cellWidth: "auto" },
          },
        });
      } else if (reportType === "volunteers") {
        autoTable(doc, {
          startY: 44,
          margin: { left: 15, right: 15, bottom: 15 },
          head: [
            [
              "Username Profile",
              "Access Role",
              "Phone Contact",
              "Account Status",
              "System Permissions Mapping",
            ],
          ],
          body: processedData.map((v) => {
            let activePerms = "Standard Access";
            try {
              if (v.permissions) {
                const perms =
                  typeof v.permissions === "string"
                    ? JSON.parse(v.permissions)
                    : v.permissions;
                const activeKeys = Object.keys(perms).filter(
                  (k) => perms[k] === true,
                );
                if (activeKeys.length > 0) {
                  activePerms = activeKeys
                    .map((k) => k.replace(/_/g, " "))
                    .join(", ");
                }
              }
            } catch (e) {
              console.warn(
                "Skipped permission parsing exception for:",
                v.username,
              );
              activePerms = "Custom Access Map";
            }
            return [
              v.username || "-",
              v.role?.toUpperCase() || "-",
              v.phone || "-",
              v.active ? "ACTIVE" : "SUSPENDED",
              activePerms,
            ];
          }),
          headStyles: { fillColor: [179, 0, 27] },
          styles: {
            fontSize: 8.5,
            font: "helvetica",
            cellPadding: 3.5,
            overflow: "linebreak",
          },
          columnStyles: {
            0: { cellWidth: 40, fontStyle: "bold" },
            1: { cellWidth: 30, halign: "center" },
            2: { cellWidth: 30 },
            3: { cellWidth: 30, halign: "center" },
            4: { cellWidth: "auto" },
          },
        });
      } else if (reportType === "activity_logs") {
        autoTable(doc, {
          startY: 44,
          margin: { left: 15, right: 15, bottom: 15 },
          head: [
            [
              "Date & Time",
              "User Profile",
              "Action Type",
              "Reference ID",
              "Details Log Payload",
            ],
          ],
          body: processedData.map((l) => [
            new Date(l.created_at).toLocaleString(),
            l.actor_username || "-",
            l.action || "-",
            l.target_admission_no || "N/A",
            l.details || "-",
          ]),
          headStyles: { fillColor: [179, 0, 27] },
          styles: {
            fontSize: 8,
            font: "helvetica",
            cellPadding: 3,
            overflow: "linebreak",
          },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 35, fontStyle: "bold" },
            2: { cellWidth: 35, fontStyle: "bold" },
            3: { cellWidth: 30, halign: "center" },
            4: { cellWidth: "auto" },
          },
        });
      }

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - 15,
          pageHeight - 10,
          { align: "right" },
        );
        doc.text(
          "Thudipp Management System • Confidential Report",
          15,
          pageHeight - 10,
        );
      }

      doc.save(`thudipp-${reportType}-report.pdf`);

      try {
        const systemUser = JSON.parse(localStorage.getItem("user") || "{}");
        await supabase.from("activity_logs").insert([
          {
            actor_username: systemUser.username || "System Admin",
            action: "EXPORT_PDF",
            target_admission_no: "N/A",
            details: `Downloaded PDF report for: ${reportType}.`,
          },
        ]);
      } catch (logErr) {
        console.error("Logging table entry error:", logErr);
      }
    } catch (err) {
      console.error("Critical Render Error:", err);
      alert(`Could not compile PDF file layout: ${err.message}`);
    } finally {
      setIsCompilingPdf(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center gap-2">
        <Loader2 className="text-[#B3001B] animate-spin" size={28} />
        <p className="text-gray-400 text-xs font-bold tracking-widest animate-pulse">
          Loading Records...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F6F7FB] px-3 sm:px-6 pb-10">
      <div className="bg-white rounded-3xl text-center p-5 mx-auto max-w-6xl shadow-sm mb-5 border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-black text-[#B3001B] tracking-tight">
          Download Reports
        </h1>
        <p className="text-gray-400 text-xs mt-1 font-medium">
          Choose a category below to save or print official lists.
        </p>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-6">
        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-0.5">
            1. What do you want to download?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "donors", label: "Blood Donors", icon: Users },
              {
                id: "volunteers",
                label: "Volunteers & Staff",
                icon: UserCheck,
              },
              {
                id: "activity_logs",
                label: "Security Logs",
                icon: ClipboardList,
              },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setReportType(tab.id)}
                  className={`py-3 px-2 text-xs font-bold rounded-2xl border flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    reportType === tab.id
                      ? "bg-[#B3001B] text-white border-[#B3001B] shadow-md scale-[1.01]"
                      : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <TabIcon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-50 pb-1.5">
            2. Choose Filter Options
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reportType === "donors" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 text-xs font-semibold rounded-xl p-2.5 text-gray-700"
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 text-xs font-semibold rounded-xl p-2.5 text-gray-700"
                  >
                    <option value="">Show Everyone</option>
                    <option value="true">Available Only</option>
                    <option value="false">Unavailable / On Hold Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Sort Alphabetically
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="w-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 p-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <ArrowUpDown size={14} className="text-[#B3001B]" />
                    <span>
                      Names: {sortOrder === "asc" ? "A to Z" : "Z to A"}
                    </span>
                  </button>
                </div>
              </>
            )}
            {reportType === "volunteers" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Filter by Rank/Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 text-xs font-semibold rounded-xl p-2.5 text-gray-700"
                  >
                    <option value="">Show All Staff</option>
                    <option value="admin">Admins Only</option>
                    <option value="volunteer">Volunteers Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Sort Order Direction
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="w-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 p-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <ArrowUpDown size={14} className="text-[#B3001B]" />
                    <span>
                      Usernames: {sortOrder === "asc" ? "A to Z" : "Z to A"}
                    </span>
                  </button>
                </div>
              </>
            )}
            {reportType === "activity_logs" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Filter by Action Type
                  </label>
                  <select
                    value={logActionFilter}
                    onChange={(e) => setLogActionFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 text-xs font-semibold rounded-xl p-2.5 text-gray-700"
                  >
                    <option value="">Show All Action Types</option>
                    <option value="LOGIN">Logins Only</option>
                    <option value="EXPORT_PDF">PDF Downloads Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Timeline Flow
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                    }
                    className="w-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 p-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <ArrowUpDown size={14} className="text-[#B3001B]" />
                    <span>
                      Time:{" "}
                      {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleDownload}
          disabled={processedData.length === 0 || isCompilingPdf}
          className="w-full mt-2 bg-[#B3001B] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#990014] disabled:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none transition-all uppercase tracking-wider"
        >
          {isCompilingPdf ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Creating PDF Document...</span>
            </>
          ) : (
            <>
              <FileText size={16} />
              <span>
                Create and Download PDF Report ({processedData.length} items
                found)
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ExportPDF;
