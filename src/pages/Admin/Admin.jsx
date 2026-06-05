import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

function Analytics() {
  const [donors, setDonors] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchDonors() {
      const { data, error } = await supabase.from("donors").select("*");
      if (!error) {
        setDonors(data);
      }
    }
    fetchDonors();
  }, []);

  const totalDonors = donors.length;
  const availableDonors = donors.filter((d) => d.available).length;

  const bloodGroupData = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
    (group) => ({
      group,
      count: donors.filter((d) => d.blood_group === group).length,
    }),
  );

  const yearData = [...new Set(donors.map((d) => d.year_joined))]
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      count: donors.filter((d) => d.year_joined === year).length,
    }));

  return (
    <div className="w-full px-2 sm:px-6 max-w-6xl mx-auto bg-gray-50/50 min-h-screen py-6">
      <div className="space-y-4">
        {/* Header Title Section */}
        <div className="px-2 mb-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Overview
          </h1>
          <p className="text-xs text-gray-500">
            Real-time donor status database metrics
          </p>
        </div>

        {/* Forced 2 Columns and 1 Row on Mobile and Desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {/* Card 1: Availability */}
          <div className="bg-white rounded-2xl p-3 sm:p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-2 sm:pb-3 mb-3">
                <span className="text-[11px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase">
                  Availability
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                  {Math.round((availableDonors / totalDonors) * 100) || 0}%
                  Active
                </span>
              </div>

              <div className="my-2 sm:my-4">
                <span className="text-2xl sm:text-5xl font-black tracking-tight text-gray-900">
                  {availableDonors}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-400 ml-1">
                  / {totalDonors} total
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 mt-4">
                {/* Available Indicator */}
                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-medium mb-1">
                    <span className="text-gray-500">Ready to Donate</span>
                    <span className="font-bold text-gray-800">
                      {availableDonors}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1 sm:h-1.5">
                    <div
                      className="bg-green-500 h-1 sm:h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width:
                          totalDonors > 0
                            ? `${(availableDonors / totalDonors) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* Unavailable Indicator */}
                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-medium mb-1">
                    <span className="text-gray-500">Unavailable</span>
                    <span className="font-bold text-gray-800">
                      {totalDonors - availableDonors}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1 sm:h-1.5">
                    <div
                      className="bg-red-400 h-1 sm:h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width:
                          totalDonors > 0
                            ? `${((totalDonors - availableDonors) / totalDonors) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Blood Groups */}
          <div className="bg-white rounded-2xl p-3 sm:p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-2 sm:pb-3 mb-2">
                <span className="text-[11px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase">
                  Blood Pools
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-red-50 text-[#B3001B] rounded-full">
                  Groups
                </span>
              </div>
            </div>

            <div className="w-full h-32 sm:h-48 relative mx-auto my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodGroupData.filter((item) => item.count > 0)}
                    dataKey="count"
                    nameKey="group"
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="85%"
                    paddingAngle={3}
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      name,
                    }) => {
                      const value = Math.round(percent * 100);
                      if (!value) return null;

                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x =
                        cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                      const y =
                        cy + radius * Math.sin((-midAngle * Math.PI) / 180);

                      let rotation = 90 - midAngle;
                      if (rotation > 90) rotation -= 180;
                      if (rotation < -90) rotation += 180;

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${rotation} ${x} ${y})`}
                        >
                          {`${name}`}
                        </text>
                      );
                    }}
                  >
                    {/* Balanced gradient values across the crimson hue palette */}
                    <Cell fill="#7A0010" />
                    <Cell fill="#940014" />
                    <Cell fill="#B3001B" />
                    <Cell fill="#D7263D" />
                    <Cell fill="#E84855" />
                    <Cell fill="#F26A7A" />
                    <Cell fill="#FF8FA3" />
                    <Cell fill="#FFB3C1" />
                  </Pie>
                  <Tooltip />

                  <text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#111827"
                    className="text-xs sm:text-xl font-black"
                  >
                    {totalDonors}
                  </text>
                  <text
                    x="50%"
                    y="58%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#9CA3AF"
                    className="text-[8px] sm:text-xs font-bold uppercase tracking-wider"
                  >
                    Units
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: Year Joined (Bottom Full Row) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase block">
                Registration Timeline
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-800">
                Yearly Onboarding Growth
              </span>
            </div>
          </div>

          <div className="w-full h-44 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearData}
                margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
              >
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: "500" }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: "500" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#B3001B"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    stroke: "#B3001B",
                    strokeWidth: 2,
                    fill: "#fff",
                  }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#7A0010" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
