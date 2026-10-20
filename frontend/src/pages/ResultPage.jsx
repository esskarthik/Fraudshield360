import ResultCard from "../components/ResultCard";
import { useLocation } from "react-router-dom";

export default function ResultPage({ result: appResult }) {
  const location = useLocation();
  const data = location.state?.result || appResult;

  if (!data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-danger-500 text-6xl mb-4">&#x26A0;</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No scan data</h2>
        <p className="text-slate-600">Please run a scan to view results.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ResultCard data={data} />
    </div>
  );
}
