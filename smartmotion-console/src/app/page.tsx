import Heatmap from "./components/Heatmap";
import AnalyticsCharts from "./components/AnalyticsCharts";
import AutoRefresh from "./components/AutoRefresh";

type StatsData = {
  totalLocations: number;
  activeUsers: number;
  activeAreas: number;
  totalEventsHistory?: number;
};

type TopArea = {
  h3Index: string;
  count: number;
};

type HeatmapCell = {
  h3Index: string;
  count: number;
};

type AppData = {
  appId: string;
  totalLocations: number;
  status: string;
};

type LocationData = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  appId: string;
  h3Index: string;
  receivedAt?: string;
  updatedAt?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: "no-store",
    });

    if (!response.ok) return fallback;

    const result = await response.json();
    return result.data ?? fallback;
  } catch {
    return fallback;
  }
}

function formatLocationTime(location: LocationData) {
  const dateValue = location.updatedAt || location.receivedAt || location.timestamp;
  if (!dateValue) return "No time";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No time";

  return date.toLocaleTimeString();
}

function formatUserName(userId: string) {
  if (!userId) return "Unknown User";

  if (userId.startsWith("user_")) {
    return `User #${userId.replace("user_", "").slice(0, 4).toUpperCase()}`;
  }

  return userId;
}

function formatAppName(appId: string) {
  if (appId === "demo_android_app") {
    return "SmartMotion Android Demo";
  }

  return appId;
}

function StatCard({
  title,
  value,
  description,
  accent,
}: {
  title: string;
  value: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="soft-card rounded-[30px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`mb-5 h-2 w-16 rounded-full ${accent}`} />
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7A8797]">
        {title}
      </p>
      <p className="mt-3 text-4xl font-extrabold text-[#233142]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p>
    </div>
  );
}

export default async function Home() {
  const stats = await fetchData<StatsData>("/stats", {
    totalLocations: 0,
    activeUsers: 0,
    activeAreas: 0,
    totalEventsHistory: 0,
  });

  const topAreas = await fetchData<TopArea[]>("/top-areas", []);
  const heatmap = await fetchData<HeatmapCell[]>("/heatmap", []);
  const apps = await fetchData<AppData[]>("/apps", []);
  const locations = await fetchData<LocationData[]>("/locations", []);

  const recentLocations = locations.slice(-5).reverse();
  const lastUpdated = new Date().toLocaleTimeString();

  const statCards = [
    {
      title: "Live Users",
      value: stats.activeUsers.toString(),
      description: "Users with a current live location",
      accent: "bg-[#A9D6FF]",
    },
    {
      title: "History Events",
      value: (stats.totalEventsHistory ?? 0).toString(),
      description: "Total SDK location updates received",
      accent: "bg-[#BDECCF]",
    },
    {
      title: "Active Areas",
      value: stats.activeAreas.toString(),
      description: "H3 cells with live crowd activity",
      accent: "bg-[#D8C7F2]",
    },
    {
      title: "Connected Apps",
      value: apps.length.toString(),
      description: "Applications using SmartMotion SDK",
      accent: "bg-[#F4C7CD]",
    },
  ];

  return (
    <main className="min-h-screen text-[#233142]">
      <AutoRefresh />

      <nav className="sticky top-0 z-[9999] border-b border-[#E3ECF7] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-2xl font-extrabold tracking-tight">
              SmartMotion
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7A8797]">
              SDK Portal
            </p>
          </div>

          <div className="hidden items-center gap-7 text-sm font-bold text-[#526071] md:flex">
            <a href="#dashboard">Dashboard</a>
            <a href="#heatmap">Heatmap</a>
            <a href="#analytics">Analytics</a>
            <a href="#areas">Areas</a>
            <a href="#users">Live Users</a>
          </div>

          <div className="rounded-full bg-[#DDF6E8] px-5 py-2 text-sm font-extrabold text-green-700 shadow-sm">
            Online
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <header className="glass-card overflow-hidden rounded-[40px] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#526071]">
                Real-time motion analytics
              </p>

              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight text-[#233142] md:text-6xl">
                Build live crowd insights into any Android app.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#526071]">
                SmartMotion SDK collects anonymous live locations, sends them to
                the backend, aggregates users into H3 cells, and displays live
                density insights in a developer portal.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#dashboard"
                  className="rounded-full bg-[#DDF6E8] px-7 py-3 text-sm font-extrabold text-green-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  View Dashboard
                </a>
                <a
                  href="#heatmap"
                  className="rounded-full bg-white px-7 py-3 text-sm font-extrabold text-[#233142] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  Open Heatmap
                </a>
              </div>
            </div>

            <div className="rounded-[32px] bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-bold text-[#7A8797]">
                Backend Status
              </p>
              <p className="mt-2 text-3xl font-black text-green-700">Online</p>
              <p className="mt-3 text-sm text-[#6B7280]">
                Last updated: {lastUpdated}
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-[#F7FBFF] p-4">
                  <p className="text-sm font-bold">SDK Version</p>
                  <p className="mt-1 text-sm text-[#6B7280]">v1.0.0 demo</p>
                </div>

                <div className="rounded-2xl bg-[#FFF3C4] p-4">
                  <p className="text-sm font-bold">Aggregation</p>
                  <p className="mt-1 text-sm text-[#6B7280]">H3 live cells</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          id="dashboard"
          className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section
          id="heatmap"
          className="mt-10 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]"
        >
          <div className="soft-card rounded-[34px] p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#7A8797]">
                  Live map
                </p>
                <h2 className="mt-2 text-3xl font-black">Live H3 Heatmap</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                  The map is calculated from the latest location of each active
                  user. Green means low density, yellow means medium density,
                  and red means high density.
                </p>
              </div>

              <span className="rounded-full bg-[#DDF6E8] px-4 py-2 text-sm font-extrabold text-green-700">
                {heatmap.length} H3 cells
              </span>
            </div>

            <div className="rounded-[30px] bg-[#EEF7FF] p-4">
              <Heatmap />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[26px] bg-[#F7FBFF] p-4">
              <div>
                <p className="text-sm font-extrabold">Density scale</p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Based on active users per H3 cell.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280]">Low</span>
                <span className="h-3 w-12 rounded-full bg-green-300" />
                <span className="h-3 w-12 rounded-full bg-yellow-300" />
                <span className="h-3 w-12 rounded-full bg-red-300" />
                <span className="text-xs text-[#6B7280]">High</span>
              </div>
            </div>
          </div>

          <div className="soft-card rounded-[34px] p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#7A8797]">
              Applications
            </p>
            <h2 className="mt-2 text-3xl font-black">Connected Apps</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Apps currently using the SDK and sending live location updates.
            </p>

            <div className="mt-6 space-y-4">
              {apps.length === 0 ? (
                <div className="rounded-[28px] bg-[#DDF6E8] p-5">
                  <p className="font-extrabold">No apps yet</p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    Start the Android demo app to send live location updates.
                  </p>
                </div>
              ) : (
                apps.map((app) => (
                  <div
                    key={app.appId}
                    className="rounded-[28px] bg-[#DDF6E8] p-5 shadow-sm"
                  >
                    <p className="text-sm text-[#6B7280]">Application</p>
                    <p className="mt-2 text-xl font-black">
                      {formatAppName(app.appId)}
                    </p>
                    <p className="mt-1 text-xs font-mono text-[#6B7280]">
                      {app.appId}
                    </p>
                    <p className="mt-3 text-sm text-[#6B7280]">
                      Current Live Users
                    </p>
                    <p className="mt-1 text-3xl font-black">
                      {app.totalLocations}
                    </p>
                    <p className="mt-4 text-sm font-extrabold text-green-700">
                      Status: {app.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="analytics">
          <AnalyticsCharts areas={topAreas} />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <div id="areas" className="soft-card rounded-[34px] p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#7A8797]">
              H3 analytics
            </p>
            <h2 className="mt-2 text-3xl font-black">Top Crowded Areas</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Highest activity H3 cells based on current live users.
            </p>

            <div className="mt-5 overflow-hidden rounded-[26px] border border-[#DBEAFE] bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#CFE8FF]">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Active Users</th>
                  </tr>
                </thead>

                <tbody>
                  {topAreas.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-[#6B7280]" colSpan={3}>
                        No area activity yet.
                      </td>
                    </tr>
                  ) : (
                    topAreas.map((area, index) => (
                      <tr
                        key={area.h3Index}
                        className="border-t border-[#DBEAFE]"
                      >
                        <td className="px-4 py-3 font-extrabold text-xl">
                          <span className="font-extrabold text-[#233142]">
                            {index + 1}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            title={`H3 Index: ${area.h3Index}`}
                            className="inline-flex rounded-full bg-[#EEF7FF] px-4 py-2 font-bold text-[#233142] shadow-sm"
                          >
                            Cell {index + 1}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-full bg-[#DDF6E8] px-3 py-1 font-extrabold text-green-700">
                            {area.count}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div id="users" className="soft-card rounded-[34px] p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#7A8797]">
              Live users
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Current User Locations
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Latest known location for each active SDK user.
            </p>

            <div className="mt-5 space-y-3">
              {recentLocations.length === 0 ? (
                <div className="rounded-[26px] border border-[#DBEAFE] bg-[#F7FBFF] p-4">
                  <p className="text-sm text-[#6B7280]">
                    No active users yet.
                  </p>
                </div>
              ) : (
                recentLocations.map((location) => (
                  <div
                    key={location.id}
                    className="rounded-[26px] border border-[#DBEAFE] bg-[#F7FBFF] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-extrabold">
                          {formatUserName(location.userId)}
                        </p>
                        <p className="mt-1 text-xs font-mono text-[#6B7280]">
                          {location.userId}
                        </p>
                      </div>
                      <p className="text-sm text-[#6B7280]">
                        {formatLocationTime(location)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-[#6B7280]">
                      Latitude: {location.latitude} | Longitude:{" "}
                      {location.longitude}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#6B7280]">
                      H3: {location.h3Index}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}