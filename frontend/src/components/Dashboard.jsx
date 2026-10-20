import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Activity, ScanLine, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard } from "../lib/api";

function StatCard({ title, value, icon, change, changePositive }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={`mt-1 text-xs font-medium ${changePositive ? "text-safe-600" : "text-danger-600"}`}>
              {changePositive ? "▲ " : "▼ "}{change}
            </p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-slate-100 text-slate-600">{icon}</div>
      </div>
    </div>
  );
}

function rlevelColor(level) {
  if (level === "High") return { bg: "bg-danger-100", text: "text-danger-700" };
  if (level === "Medium") return { bg: "bg-warn-100", text: "text-warn-800" };
  return { bg: "bg-safe-100", text: "text-safe-700" };
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      setStats(await getDashboard());
    } catch (err) {
      setError(err.response?.data?.detail || "Dashboard data is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const riskData = [
    { name: "Low", value: stats?.low_risk || 0 },
    { name: "Medium", value: stats?.medium_risk || 0 },
    { name: "High", value: stats?.high_risk || 0 },
  ];

  const recent = stats?.recent_scans || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security Dashboard</h1>
          <p className="text-slate-600">Overview of scans and risk distribution.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="btn-primary text-sm" onClick={loadDashboard}>Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Scans" value={loading ? "..." : stats?.total_scans || 0} icon={<ScanLine />} />
        <StatCard title="High Risk" value={loading ? "..." : stats?.high_risk || 0} icon={<ShieldCheck className="text-danger-600" />} />
        <StatCard title="Medium Risk" value={loading ? "..." : stats?.medium_risk || 0} icon={<Activity className="text-warn-600" />} />
        <StatCard title="Low Risk" value={loading ? "..." : stats?.low_risk || 0} icon={<ShieldCheck className="text-safe-600" />} />
      </div>

      {error && <div role="alert" className="mb-8 rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Risk Category Distribution</h3>
            <span className="text-xs text-slate-500">Last 30 days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={110} fill="#8884d8" label>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#14b8a6", "#f59e0b", "#ef4444", "#6366f1", "#10b981"][index % 5]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Recent Scans</h3>
            <span className="text-xs text-slate-500">View all</span>
          </div>
          <div className="space-y-3">
            {recent.map((r) => {
              const clr = rlevelColor(r.risk_level);
              return (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{r.category || "Suspicious Message"}</p>
                      <p className="text-xs text-slate-500">{new Date(r.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${clr.bg} ${clr.text}`}>
                      {r.risk_level}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{r.risk_score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}