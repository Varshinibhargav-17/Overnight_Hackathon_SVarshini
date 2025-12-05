// src/components/Header.jsx (Simplified DaisyUI Version)
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    // Use a compact navbar with primary color background
    <div className="navbar bg-base-100 shadow-md **p-0 min-h-[1rem]**" data-theme="emerald">
      <div className="flex-1 px-4">
        {/* Logo/App Name - Use a standard text size for brevity */}
        <Link to="/" className="text-xl font-extrabold text-primary flex items-center gap-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          ProctorAI
        </Link>
      </div>

      {/* Navigation links (simplified for the example pages) */}
      <div className="flex-none hidden sm:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
          <li><Link to="/create-exam">Schedule Exam</Link></li>
        </ul>
      </div>

      {/* User Avatar/Dropdown (using a small, compact avatar) */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar btn-sm">
          <div className="w-8 rounded-full">
            {/* Placeholder for user image */}
            <img alt="User Avatar" src="https://i.pravatar.cc/32?img=1" />
          </div>
        </div>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a href="#profile">Profile</a></li>
          <li><a href="#settings">Settings</a></li>
          <li><a href="#logout" className="text-error">Logout</a></li>
        </ul>
      </div>

      {/* Padding on the right for clean look */}
      <div className="px-2"></div>
    </div>
  );
}