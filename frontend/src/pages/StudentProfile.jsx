// src/pages/StudentProfile.jsx
import React, { useState } from "react";
import Header from "../components/Header";

export default function StudentProfile() {
    // --- FUNCTIONALITY REMAINS UNCHANGED ---
    const [profile, setProfile] = useState({
        name: localStorage.getItem("user_name") || "Student",
        email: localStorage.getItem("user_email") || "student@university.edu", // Added a default email for better rendering
        rollNumber: "2024CS001",
        department: "Computer Science"
    });
    // ----------------------------------------

    return (
        <div className="min-h-screen bg-base-200">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-base-content mb-8">My Profile 👤</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 1. Profile Info (2/3 width) */}
                        <div className="lg:col-span-2 card bg-base-100 shadow-xl">
                            <div className="card-body p-8">
                                <h2 className="card-title text-xl mb-6 border-b border-base-200 pb-3">Personal Information</h2>

                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base-content/70 font-medium">Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full bg-base-300 text-base-content"
                                            value={profile.name}
                                            disabled
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base-content/70 font-medium">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="input input-bordered w-full bg-base-300 text-base-content"
                                            value={profile.email}
                                            disabled
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {/* Roll Number */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-base-content/70 font-medium">Roll Number</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered w-full bg-base-300 text-base-content"
                                                value={profile.rollNumber}
                                                disabled
                                            />
                                        </div>

                                        {/* Department */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-base-content/70 font-medium">Department</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered w-full bg-base-300 text-base-content"
                                                value={profile.department}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="btn btn-primary btn-outline w-full md:w-auto">
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Quick Stats (1/3 width) */}
                        <div className="lg:col-span-1">
                            <div className="card bg-base-100 shadow-xl p-6">
                                <h3 className="text-lg font-bold text-base-content mb-4">Performance Overview</h3>

                                {/* DaisyUI Stats component for cleaner presentation */}
                                <div className="stats stats-vertical shadow w-full border border-base-300">

                                    {/* Exams Taken */}
                                    <div className="stat bg-primary/10 text-primary-content">
                                        <div className="stat-figure text-primary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        </div>
                                        <div className="stat-title text-base-content/70">Exams Taken</div>
                                        <div className="stat-value text-primary">8</div>
                                    </div>

                                    {/* Average Score */}
                                    <div className="stat bg-base-100">
                                        <div className="stat-figure text-success">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        </div>
                                        <div className="stat-title text-base-content/70">Avg Score</div>
                                        <div className="stat-value text-success">85%</div>
                                    </div>

                                    {/* Integrity Score */}
                                    <div className="stat bg-base-100">
                                        <div className="stat-figure text-secondary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        </div>
                                        <div className="stat-title text-base-content/70">Integrity Score</div>
                                        <div className="stat-value text-secondary">94%</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}