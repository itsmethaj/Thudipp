import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  UserRound,
  CalendarDays,
  ShieldCheck,
  ArrowUpDown,
  Search,
  Activity,
} from "lucide-react";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); 
  const [sortOrder, setSortOrder] = useState("desc"); 

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });

    setLogs(data || []);
  }

  const processedLogs = logs
    .filter((log) => {
      const matchText =
        log.actor_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeFilter === "LOGIN") return matchText && log.action === "LOGIN";
      if (activeFilter === "MODIFICATIONS")
        return matchText && log.action !== "LOGIN";
      return matchText;
    })
    .sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-4 shadow-sm mb-5">
          <h1 className="text-3xl font-black text-[#B3001B] text-center">
            Activity & Security Logs
          </h1>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search user, action, or log details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F8F8] pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B3001B]/20 transition-all"
            />
          </div>

          <div className="flex gap-1 bg-[#F8F8F8] p-1 rounded-xl w-full md:w-auto">
            {["ALL", "LOGIN", "MODIFICATIONS"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === filter
                    ? "bg-[#B3001B] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {filter === "MODIFICATIONS" ? "Data Actions" : filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="w-full md:w-auto flex items-center justify-center gap-2 border border-gray-100 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 transition-colors"
          >
            <ArrowUpDown size={14} />
            Sorting: {sortOrder === "desc" ? "Newest" : "Oldest"}
          </button>
        </div>

        <div className="space-y-4">
          {processedLogs.length > 0 ? (
            processedLogs.map((log) => {
              const isLoginAction = log.action === "LOGIN";

              return (
                <div
                  key={log.id}
                  className={`bg-white rounded-[28px] border transition-all duration-200 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] ${
                    isLoginAction
                      ? "border-emerald-100/70 bg-emerald-50/5"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div
                      className={`inline-flex items-center self-start px-3 py-1.5 rounded-full text-xs font-bold ${
                        isLoginAction
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {log.action}{" "}
                      {log.target_admission_no &&
                        log.target_admission_no !== "N/A" &&
                        `• Ref: ${log.target_admission_no}`}
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                      <CalendarDays size={14} />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 mt-4 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-gray-700">
                      <UserRound size={16} className="text-gray-400" />
                      <span className="text-sm font-semibold">
                        {log.actor_username}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-gray-600">
                      <ShieldCheck
                        size={16}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <span className="text-sm leading-relaxed">
                        {log.details}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
              <Activity className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm font-semibold">
                No logs found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;
