import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { scanImage, scanMessage } from "../lib/api";
import {
  ShieldAlert,
  Mail,
  MessageCircle,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  AlertTriangle,
} from "lucide-react";

export default function Scanner() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!message.trim() && !file) {
      setError("Paste a message or select a screenshot to analyze.");
      return;
    }
    setLoading(true);
    try {
      if (file && !message.trim()) {
        const result = await scanImage(file);
        setMessage(result.extracted_text);
        navigate("/result", {
          state: { result: result.analysis, originalMessage: result.extracted_text },
        });
      } else {
        const content = message.trim();
        const data = await scanMessage(content);
        navigate("/result", { state: { result: data, originalMessage: content } });
      }
    } catch (err) {
      const msg = err.response
        ? `Scan failed (${err.response.status}): ${err.response.data?.detail || err.message}`
        : err.message || "Could not reach the backend. Make sure the FastAPI server is running on port 8000.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 lg:w-3/5 space-y-5">
          <div className="card">
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Intelligent Message Scanner</h2>
              <p className="text-slate-600 text-sm">
                Paste suspicious SMS, WhatsApp, email, or other messages for analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl border-2 border-brand-500 bg-brand-50 p-4">
                <div className="flex items-center gap-2 text-brand-700">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">Paste Message</span>
                </div>
                <p className="mt-1 text-xs text-brand-700/80">Analyze SMS, WhatsApp, email, or chat text.</p>
              </div>
              <label className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-brand-500 hover:bg-brand-50">
                <div className="flex items-center gap-2 text-slate-700">
                  <ImageIcon className="h-5 w-5" />
                  <span className="font-semibold">Upload Screenshot</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {file ? file.name : "Choose an image to extract and scan its text."}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Message Content</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Paste the suspicious message here..."
                  className="w-full min-h-[200px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
                  rows={10}
                />
                <p className="text-xs text-slate-500">
                  We do not store your full message by default. Read our privacy notice.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-danger-50 border border-danger-200 p-4 text-danger-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!message.trim() && !file)}
                className="btn-primary w-full disabled:opacity-60"
              >
                {loading ? "Extracting and analyzing..." : file && !message.trim() ? "Extract & Analyze Screenshot" : "Analyze Message"}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickCheck icon={<ShieldAlert className="h-5 w-5" />} label="Urgent language" />
            <QuickCheck icon={<Mail className="h-5 w-5" />} label="Credential requests" />
            <QuickCheck icon={<LinkIcon className="h-5 w-5" />} label="Risky links" />
          </div>
        </div>

        <div className="lg:w-2/5 flex flex-col gap-6">
          <div className="card sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4">How it works</h3>
            <ol className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="bg-brand-100 text-brand-700 rounded-full p-1 text-xs font-bold">1</span>
                Paste a suspicious message.
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-brand-100 text-brand-700 rounded-full p-1 text-xs font-bold">2</span>
                Rule-based engine checks urgency, credentials, and links.
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-brand-100 text-brand-700 rounded-full p-1 text-xs font-bold">3</span>
                Receive a risk score, explanation, and safety steps.
              </li>
            </ol>
          </div>

          <div className="card">
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <Upload className="h-8 w-8 mb-2" />
              <p className="text-sm text-center px-4">
                Upload a screenshot, then choose “Extract & Analyze Screenshot” to inspect its text and links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickCheck({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      {icon} <span className="font-medium">{label}</span>
    </div>
  );
}
