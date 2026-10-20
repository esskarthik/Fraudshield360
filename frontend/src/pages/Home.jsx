import { ArrowRight, ShieldCheck, Mail, Link as LinkIcon, Smartphone } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-600" />,
      title: "AI Risk Assessment",
      desc: "Rule-based analysis with a consistent 0–100 risk score and clear classification.",
    },
    {
      icon: <Mail className="h-6 w-6 text-slate-600" />,
      title: "Message Scanner",
      desc: "Paste SMS, WhatsApp, or email content to detect phishing indicators instantly.",
    },
    {
      icon: <LinkIcon className="h-6 w-6 text-slate-600" />,
      title: "Link Inspection",
      desc: "Extract URLs and flag suspicious domains, IP addresses, and risky TLDs.",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-slate-600" />,
      title: "Safety Guidance",
      desc: "Plain-language explanations and actionable recommendations for every scan.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-4 border border-brand-100">
          FraudShield 360 &bull; v1.0
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Detect the Deception.<br />
          <span className="text-brand-600">Defend Your Digital World.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          An AI-powered platform to analyze suspicious SMS, WhatsApp messages, emails, and links.
          Get a risk score, plain-language warnings, and safety recommendations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <a href="/scan" className="btn-primary">
            Start Scanning
          </a>
          <a href="/learn" className="btn-outline">
            Learn Center
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="p-2 rounded-xl bg-slate-100 text-brand-600 mb-4">{f.icon}</div>
            <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Ready to scan a message?</h2>
          <p className="text-slate-300 mb-6 max-w-md">
            Paste suspicious content and get an instant fraud risk assessment.
          </p>
          <a href="/scan" className="btn-primary bg-white text-brand-600 hover:bg-slate-100">
            Analyze Now
          </a>
        </div>
      </div>
    </div>
  );
}
