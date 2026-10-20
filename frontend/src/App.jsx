import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";

import Home from "./pages/Home";
import ScannerPage from "./pages/ScannerPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import LearnPage from "./pages/LearnPage";

import { scanMessage } from "./lib/api";

import "./index.css";

function AppContent() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = window.localStorage.getItem("fraudshield-theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", darkMode);
    window.localStorage.setItem("fraudshield-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const titles = {
      "/": "FraudShield 360 | Detect the Deception",
      "/scan": "Scan a Message | FraudShield 360",
      "/result": "Analysis Report | FraudShield 360",
      "/dashboard": "Security Dashboard | FraudShield 360",
      "/learn": "Learning Center | FraudShield 360",
    };
    document.title = titles[location.pathname] || "FraudShield 360";
  }, [location.pathname]);

  async function handleAnalyzeMessage(message) {
    if (!message || !message.trim()) {
      setError("Please enter a message to analyze.");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const result = await scanMessage(message);

      setAnalysisResult(result);

      navigate("/result", {
        state: {
          result,
          originalMessage: message,
        },
      });

      return result;
    } catch (err) {
      const errorMessage =
        err.message || "Unable to analyze this message.";

      setError(errorMessage);
      console.error("FraudShield 360 scan error:", err);

      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col app-shell">
      <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />

      <main className="pb-12 flex-grow">
        {error && (
          <div
            role="alert"
            className="mx-auto mt-4 max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <strong>Scan failed:</strong> {error}

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-4 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/scan"
            element={
              <ScannerPage
                onAnalyze={handleAnalyzeMessage}
                loading={loading}
                error={error}
              />
            }
          />

          <Route path="/result" element={<ResultPage result={analysisResult} />} />

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/learn"
            element={<LearnPage />}
          />

          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl px-6 py-20 text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                  Page Not Found
                </h1>

                <p className="mt-3 text-slate-600">
                  The page you requested does not exist.
                </p>

                <Link
                  to="/"
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Return Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Router>
      {showSplash ? <SplashScreen /> : <AppContent />}
    </Router>
  );
}
