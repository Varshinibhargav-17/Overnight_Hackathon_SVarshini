// src/components/Header.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("user_name") || "Student";
  const userRole = localStorage.getItem("user_role") || "student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/results", label: "Results", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" }
  ];

  const proctorLinks = [
    { path: "/proctor", label: "Monitor", icon: "📡" },
    { path: "/proctor/create-exam", label: "Create Exam", icon: "➕" },
    { path: "/proctor/analytics", label: "Analytics", icon: "📈" }
  ];

  const links = userRole === "proctor" ? proctorLinks : studentLinks;

  return (
    <header className="header">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              EP
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">ExamPulse AI</h1>
              <p className="text-xs text-muted">Behavioral Analytics</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-muted capitalize">{userRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}