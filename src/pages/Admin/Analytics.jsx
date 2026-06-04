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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
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

  const archivedDonors = donors.filter((d) => d.archived).length;

  const totalCourses = new Set(donors.map((d) => d.course)).size;

  const genderData = [
    {
      name: "Male",
      value: donors.filter((d) => d.gender === "Male").length,
    },
    {
      name: "Female",
      value: donors.filter((d) => d.gender === "Female").length,
    },
  ];

  const availabilityData = [
    {
      name: "Available",
      value: donors.filter((d) => d.available).length,
    },
    {
      name: "Unavailable",
      value: donors.filter((d) => !d.available).length,
    },
  ];

  const bloodGroupData = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
    (group) => ({
      group,
      count: donors.filter((d) => d.blood_group === group).length,
    }),
  );

  const courseData = [...new Set(donors.map((d) => d.course))].map(
    (course) => ({
      course,
      count: donors.filter((d) => d.course === course).length,
    }),
  );

  const yearData = [...new Set(donors.map((d) => d.year_joined))]
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      count: donors.filter((d) => d.year_joined === year).length,
    }));

  return (
    <div>
      <div className="mt-4">
        {/* Top Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Availability */}
          <div className="bg-white rounded-3xl p-4 shadow-md">
            <h3 className="font-bold text-sm text-center mb-4">Availability</h3>

            <div className="flex justify-center mb-4">
              <div className="text-center">
                <h2 className="text-3xl font-black text-green-600">
                  {availableDonors}
                </h2>

                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-600 font-semibold">
                    Available
                  </span>

                  <span>{availableDonors}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
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
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-600 font-semibold">
                    Unavailable
                  </span>

                  <span>{totalDonors - availableDonors}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
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

            <div className="mt-4 text-center">
              <span className="text-lg font-bold text-[#B3001B]">
                {Math.round((availableDonors / totalDonors) * 100) || 0}%
              </span>
            </div>
          </div>

          {/* Blood Group */}
          <div className="bg-white rounded-3xl p-3 shadow-md">
            <h3 className="font-bold text-xs text-center mb-2">Blood Groups</h3>

            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={bloodGroupData.filter((item) => item.count > 0)}
                  dataKey="count"
                  nameKey="group"
                  innerRadius={30}
                  outerRadius={70}
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
                      innerRadius + (outerRadius - innerRadius) * 0.65;

                    const x =
                      cx + radius * Math.cos((-midAngle * Math.PI) / 180);

                    const y =
                      cy + radius * Math.sin((-midAngle * Math.PI) / 180);

                    let rotation = 90 - midAngle;

                    // Prevent upside-down text
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
                        {name}
                        <tspan dx="4">{value}%</tspan>
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

                <Tooltip />

                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#111827"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {totalDonors}
                </text>

                <text
                  x="50%"
                  y="54%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#6B7280"
                  fontSize="9"
                >
                  Donors
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Year Joined */}
        <div className="bg-white rounded-3xl p-4 shadow-md">
          <h3 className="font-bold text-sm text-center mb-3">Year Joined</h3>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={yearData}
              margin={{
                top: 10,
                right: 10,
                left: -25,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="year" tick={{ fontSize: 10 }} />

              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#B3001B"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
