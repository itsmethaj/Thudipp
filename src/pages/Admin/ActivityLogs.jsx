import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  History,
  UserRound,
  BadgeInfo,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setLogs(data || []);
  }

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-4 shadow-sm mb-5">
          <h1 className="text-3xl font-black text-[#B3001B] text-center">
            Activity Logs
          </h1>
          <p className="pt-5 text-gray-500 text-sm text-center">
            Track all admin and volunteer actions
          </p>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="
      bg-white
      rounded-[28px]
      border border-gray-100
      shadow-[0_10px_40px_rgba(0,0,0,0.06)]
      p-5
    "
            >
              <div className="flex justify-center mb-2">
                <div
                  className="
      inline-flex
      items-center
      bg-blue-100
      text-blue-700
      px-3
      py-1.5
      rounded-full
      text-xs
      font-semibold
    "
                >
                  {log.action} • {log.target_admission_no}
                </div>
              </div>

              {/* Details */}
              <div className="grid gap-3 mt-5">
                <div className="flex items-center gap-3">
                  <UserRound size={16} />
                  <span className="text-sm">{log.actor_username}</span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} />
                  <span className="text-sm">{log.details}</span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays size={16} />
                  <span className="text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;
