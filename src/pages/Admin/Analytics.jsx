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
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// Premium locked custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isLineChart = label !== undefined;
    const title = isLineChart ? label : payload[0].payload.group;
    const displayValue = isLineChart
      ? `count : ${payload[0].value}`
      : `${payload[0].payload.group} : ${payload[0].value}`;

    return (
      <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-xl text-center min-w-[75px] pointer-events-none select-none">
        <p className="text-gray-500 text-[11px] font-medium tracking-wide m-0 leading-tight">
          {title}
        </p>
        <p className="text-[#B3001B] text-xs font-black m-0 mt-0.5 leading-tight whitespace-nowrap">
          {displayValue}
        </p>
      </div>
    );
  }
  return null;
};

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
    <div className="w-full">
      {/* Global CSS Injector to explicitly eliminate active wrapper borders on click */}
      <style>{`
        .recharts-tooltip-wrapper, 
        .recharts-wrapper, 
        .recharts-surface {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        path.recharts-rectangle:focus, 
        path.recharts-sector:focus,
        .recharts-curve:focus {
          outline: none !important;
        }
      `}</style>

      <div className="mt-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs sm:text-base lg:text-lg text-center mb-2 sm:mb-4 text-gray-800">
                Availability
              </h3>

              <div className="flex justify-center mb-2 sm:mb-4">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-4xl font-black text-green-600">
                    {availableDonors}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    Available
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                    <span className="text-green-600 font-semibold">
                      Available
                    </span>
                    <span className="font-bold text-gray-700">
                      {availableDonors}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5">
                    <div
                      className="bg-green-500 h-1.5 sm:h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width:
                          totalDonors > 0
                            ? `${(availableDonors / totalDonors) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                    <span className="text-red-600 font-semibold">
                      Unavailable
                    </span>
                    <span className="font-bold text-gray-700">
                      {totalDonors - availableDonors}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5">
                    <div
                      className="bg-red-500 h-1.5 sm:h-2.5 rounded-full transition-all duration-500"
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

            <div className="mt-3 sm:mt-6 text-center border-t pt-2 border-gray-100">
              <span className="text-base sm:text-xl font-extrabold text-[#B3001B]">
                {Math.round((availableDonors / totalDonors) * 100) || 0}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-md flex flex-col justify-between">
            <h3 className="font-bold text-xs sm:text-base lg:text-lg text-center mb-2 sm:mb-4 text-gray-800">
              Blood Groups
            </h3>
            <div className="w-full h-36 sm:h-52 md:h-60 lg:h-64 relative mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodGroupData.filter((item) => item.count > 0)}
                    dataKey="count"
                    nameKey="group"
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="85%"
                    paddingAngle={2}
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
                        innerRadius + (outerRadius - innerRadius) * 0.55;
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
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${rotation} ${x} ${y})`}
                        >
                          <tspan x={x} dy="-4">
                            {name}
                          </tspan>
                          <tspan
                            x={x}
                            dy="10"
                            fontSize="10"
                            fontWeight="normal"
                          >
                            {value}%
                          </tspan>
                        </text>
                      );
                    }}
                  >
                    <Cell fill="#B3001B" />
                    <Cell fill="#D7263D" />
                    <Cell fill="#E84855" />
                    <Cell fill="#F26A7A" />
                    <Cell fill="#FF8FA3" />
                    <Cell fill="#FFB3C1" />
                    <Cell fill="#9D0208" />
                    <Cell fill="#6A040F" />
                  </Pie>

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    wrapperStyle={{ pointerEvents: "none" }}
                    useTranslate3d={true}
                  />

                  <text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#111827"
                    className="text-xs sm:text-base font-black select-none pointer-events-none"
                  >
                    {totalDonors}
                  </text>
                  <text
                    x="50%"
                    y="56%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#6B7280"
                    className="text-[9px] sm:text-xs font-semibold select-none pointer-events-none"
                  >
                    Donors
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 shadow-md">
          <h3 className="font-bold text-xs sm:text-base lg:text-lg text-center mb-3 text-gray-800">
            Year Joined
          </h3>
          <div className="w-full h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  dy={5}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ pointerEvents: "none" }}
                  useTranslate3d={true}
                />

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#B3001B"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    stroke: "#B3001B",
                    strokeWidth: 1.5,
                    fill: "#fff",
                  }}
                  activeDot={{ r: 5 }}
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
  