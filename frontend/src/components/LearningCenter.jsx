import { BookOpen, ShieldCheck, AlertTriangle, GraduationCap } from "lucide-react";

const resources = [
  {
    title: "Spot a Phishing Email",
    category: "Email Scams",
    icon: <ShieldCheck className="h-5 w-5 text-brand-600" />,
    description:
      "Learn how to identify fake sender addresses, urgent language, and malicious attachments in emails.",
  },
  {
    title: "SMS & WhatsApp Scams",
    category: "Message Scams",
    icon: <AlertTriangle className="h-5 w-5 text-warn-600" />,
    description:
      "Understand common text-message scams, including fake delivery alerts and prize notifications.",
  },
  {
    title: "Protecting Your Credentials",
    category: "Account Safety",
    icon: <BookOpen className="h-5 w-5 text-slate-600" />,
    description:
      "Best practices for passwords, OTPs, PINs, and two-factor authentication to keep accounts safe.",
  },
  {
    title: "Safe Online Shopping",
    category: "E-commerce",
    icon: <GraduationCap className="h-5 w-5 text-slate-600" />,
    description:
      "Tips for verifying online stores, spotting too-good-to-be-true deals, and secure payments.",
  },
];

const tips = [
  "Never share OTPs, passwords, or PINs with anyone.",
  "Verify unexpected payment requests through official channels.",
  "Hover over links before clicking to check the real destination.",
  "Use strong, unique passwords for every account.",
  "Enable two-factor authentication wherever possible.",
  "Report suspicious messages to official cybercrime portals.",
];

export default function LearningCenter() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Cybersecurity Learning Center</h1>
        <p className="text-slate-600 mt-1">
          Build your scam-spotting skills with short guides and practical tips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {resources.map((r) => (
          <div key={r.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              {r.icon}
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {r.category}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{r.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">{r.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900">Quick Safety Tips</h3>
          <span className="text-xs text-slate-500">Practice daily</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 text-sm font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-slate-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
