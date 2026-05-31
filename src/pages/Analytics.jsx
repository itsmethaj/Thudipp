import { useEffect, useState } from "react";
import { supabase } from "../supabase";

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
      <div className="mx-[10px]">
        {/* Pie Charts */}

        <div className="grid grid-cols-2 gap-2 mb-7">
          {/* Gender */}

          <div className="bg-white rounded-3xl p-4 shadow-md h-50 flex flex-col">
            <h3 className="font-bold text-sm text-center mb-2">Gender</h3>

            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    outerRadius={58}
                    innerRadius={28}
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
                      const RADIAN = Math.PI / 180;

                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.55;

                      const x = cx + radius * Math.cos(-midAngle * RADIAN);

                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={8}
                          fontWeight="bold"
                        >
                          {name === "Male" ? "M" : "F"}{" "}
                          {(percent * 100).toFixed(0)}%
                        </text>
                      );
                    }}
                  >
                    <Cell fill="#B3001B" />
                    <Cell fill="#FF9EAA" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Availability */}

          <div className="bg-white rounded-3xl p-4 shadow-md h-50 flex flex-col ">
            <h3 className="font-bold text-sm text-center mb-2">Availability</h3>

            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={availabilityData}
                    dataKey="value"
                    outerRadius={58}
                    innerRadius={28}
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const RADIAN = Math.PI / 180;

                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.55;

                      const x = cx + radius * Math.cos(-midAngle * RADIAN);

                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={8}
                          fontWeight="bold"
                        >
                          {(percent * 100).toFixed(0)}%
                        </text>
                      );
                    }}
                  >
                    <Cell fill="#16A34A" />
                    <Cell fill="#DC2626" />
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md mb-7">
          <h3 className="font-bold mb-4">Blood Group Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bloodGroupData}
                dataKey="count"
                nameKey="group"
                innerRadius={40}
                outerRadius={75}
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name}\n${(percent * 100).toFixed(0)}%`
                }
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
                className="font-bold"
                fill="#111827"
              >
                {totalDonors}
              </text>

              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#6B7280"
                fontSize="12"
              >
                Donors
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-3xl p-3 shadow-md mb-7">
          <h3 className="text-xs font-semibold text-center mb-2">
            Year Joined
          </h3>

          <ResponsiveContainer width="100%" height={200}>
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

              <XAxis dataKey="year" tick={{ fontSize: 9 }} />

              <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#B3001B"
                strokeWidth={2.5}
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
