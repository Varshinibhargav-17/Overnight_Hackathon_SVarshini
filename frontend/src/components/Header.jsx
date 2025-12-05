// src/components/Header.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom";

const NavItem = ({ to, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm inline-flex items-center ${
          isActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-base-200"
        }`
      }
    >
      {children}
    </NavLink>
  </li>
);

export default function Header() {
  return (
    <header className="w-full bg-base-100 shadow-sm" data-theme="emerald">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* LEFT: Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-lg font-bold text-primary leading-none">ProctorAI</span>
            </Link>
          </div>

          {/* CENTER: Navigation */}
          <nav className="flex flex-1 justify-center">
            <ul className="flex items-center space-x-1">
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/analytics">Analytics</NavItem>
              <NavItem to="/create-exam">Schedule Exam</NavItem>
            </ul>
          </nav>

        </div>
      </div>
    </header>
  );
}
