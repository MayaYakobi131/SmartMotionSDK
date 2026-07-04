"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type AreaData = {
  h3Index: string;
  count: number;
};

type ChartData = {
  name: string;
  fullH3Index: string;
  users: number;
  value?: number;
};

type Props = {
  areas: AreaData[];
};

const COLORS = [
  "#8FE3B4",
  "#FFD95A",
  "#F29C9C",
  "#B7D8FF",
  "#D8C7F2",
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload as ChartData;

  return (
    <div className="rounded-2xl border border-[#DBEAFE] bg-white px-4 py-3 text-sm shadow-lg">
      <p className="font-extrabold text-[#233142]">{data.name}</p>
      <p className="mt-1 text-[#6B7280]">H3 Index:</p>
      <p className="font-mono text-xs text-[#233142]">{data.fullH3Index}</p>
      <p className="mt-2 text-[#6B7280]">Active Users:</p>
      <p className="font-extrabold text-[#233142]">
        {data.users ?? data.value}
      </p>
    </div>
  );
}

export default function AnalyticsCharts({ areas }: Props) {
  const barData: ChartData[] = areas.slice(0, 6).map((area, index) => ({
    name: `Cell ${index + 1}`,
    fullH3Index: area.h3Index,
    users: area.count,
  }));

  const pieData: ChartData[] = areas.slice(0, 5).map((area, index) => ({
    name: `Cell ${index + 1}`,
    fullH3Index: area.h3Index,
    users: area.count,
    value: area.count,
  }));

  return (
    <section className="mt-10">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-[#E3ECF7] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7A8797]">
            Analytics
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            Active Users per H3 Cell
          </h2>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="users"
                  radius={[8, 8, 0, 0]}
                  fill="#8FD3FF"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[30px] border border-[#E3ECF7] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7A8797]">
            Distribution
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            Crowd Distribution
          </h2>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}