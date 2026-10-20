import { Link } from "react-router-dom";
import { Globe, Activity, BookOpen, Moon, Sun } from "lucide-react";

export default function Navbar({ darkMode, onToggleTheme }) {
  return (
    <nav className="sticky top-0 z-50 site-nav backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/fraudshield-logo.svg" alt="FraudShield 360 logo" className="h-9 w-9" />
            <span className="font-bold text-xl tracking-tight text-slate-900 brand-name">
              FraudShield<span className="text-brand-600">360</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={<Globe />}>Scanner</NavLink>
            <NavLink to="/dashboard" icon={<Activity />}>Dashboard</NavLink>
            <NavLink to="/learn" icon={<BookOpen />}>Learn</NavLink>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
            </button>
            <Link to="/scan" className="hidden sm:flex btn-outline text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, children }) {
  return (
    <Link to={to} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-brand-600 transition">
      {icon} {children}
    </Link>
  );
}
