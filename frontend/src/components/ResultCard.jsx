import {
  ShieldAlert,
  AlertTriangle,
  Link as LinkIcon,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Mail,
  Banknote,
  Phone,
} from "lucide-react";

export default function ResultCard({ data }) {
  function levelColor(level) {
    if (level === "High") {
      return { bg: "bg-danger-50", text: "text-danger-700", border: "border-danger-200", dot: "bg-danger-500" };
    } else if (level === "Medium") {
      return { bg: "bg-warn-50", text: "text-warn-800", border: "border-warn-200", dot: "bg-warn-500" };
    } else {
      return { bg: "bg-safe-50", text: "text-safe-800", border: "border-safe-200", dot: "bg-safe-500" };
    }
  }

  function StatCard({ label, value, color }) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      </div>
    );
  }

  function FlagRow({ label, value, icon }) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-slate-600">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          value ? "bg-danger-100 text-danger-700" : "bg-safe-100 text-safe-700"
        }`}>
          {value ? "Yes" : "No"}
        </span>
      </div>
    );
  }

  const style = levelColor(data.risk_level);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Analysis Report</h2>
            <p className="text-slate-600">
              FraudShield 360 preliminary assessment &bull; not a guarantee of fraud.
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${style.bg} ${style.text} ${style.border}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
            Risk Score: <span className="font-mono">{data.risk_score}</span> / 100
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Risk Level" value={data.risk_level} color={style.text} />
          <StatCard label="Category" value={data.category || "Suspicious Message"} color="text-slate-700" />
          <StatCard label="Risk Class" value={data.risk_score >= 60 ? "High" : data.risk_score >= 30 ? "Medium" : "Low"} color={style.text} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FlagRow label="Urgency Detected" value={data.urgency_detected} icon={<Clock className="h-5 w-5" />} />
          <FlagRow label="Sensitive Info Requested" value={data.sensitive_information_requested} icon={<Lock className="h-5 w-5" />} />
          <FlagRow label="URL Detected" value={data.url_detected} icon={<LinkIcon className="h-5 w-5" />} />
          <FlagRow label="Likely Category" value={!!data.category} icon={<ShieldAlert className="h-5 w-5" />} />
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-brand-600" />
          Detected Warning Signs
        </h3>
        <div className="space-y-3">
          {data.warning_indicators.map((ind) => {
            const s = SEVERITY_STYLE[ind.severity];
            return (
              <div
                key={ind.id}
                className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg} ${s.border}`}
              >
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${s.dot}`} />
                <div>
                  <h4 className={`font-semibold ${s.text}`}>{ind.title}</h4>
                  <p className="text-sm text-slate-600 mt-0.5">{ind.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data.urls.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-slate-600" />
            Link Inspection
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2 font-medium">URL</th>
                  <th className="pb-2 font-medium w-32">Domain</th>
                  <th className="pb-2 font-medium w-40 text-center">Status</th>
                  <th className="pb-2 font-medium">Reasons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.urls.map((u, i) => (
                  <tr key={i}>
                    <td className="py-2 text-slate-700 truncate max-w-xs">{u.url}</td>
                    <td className="py-2 text-slate-600 font-mono text-xs">{u.domain || "—"}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        u.is_suspicious
                          ? "bg-danger-100 text-danger-700"
                          : "bg-safe-100 text-safe-700"
                      }`}>
                        {u.is_suspicious ? "Suspicious" : "OK"}
                      </span>
                    </td>
                    <td className="py-2 text-slate-600 text-xs">
                      {u.reasons.length ? u.reasons.join(", ") : "No risky characteristics"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-brand-600" />
          AI Explanation
        </h3>
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-slate-800">
          <p className="whitespace-pre-line">{data.explanation}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-brand-600" />
          Recommended Actions
        </h3>
        <div className="space-y-3">
          {data.recommendations.map((r, i) => (
            <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
              <ArrowRight className="h-4 w-4 text-brand-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-slate-700 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-semibold mb-1">Important:</p>
        <p>
          The risk score represents this application's assessment of suspicious indicators,
          not a scientifically established probability that a message is fraudulent. Always verify
          through official channels before acting.
        </p>
      </div>
    </div>
  );
}

const SEVERITY_STYLE = {
  high: { bg: "bg-danger-50", text: "text-danger-700", dot: "bg-danger-400" },
  medium: { bg: "bg-warn-50", text: "text-warn-800", dot: "bg-warn-400" },
  low: { bg: "bg-safe-50", text: "text-safe-800", dot: "bg-safe-400" },
};