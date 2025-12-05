// src/pages/StudentProfile.jsx
import React, { useState } from "react";
import Header from "../components/Header";

export default function StudentProfile() {
    const [profile, setProfile] = useState({
        name: localStorage.getItem("user_name") || "Student",
        email: localStorage.getItem("user_email") || "",
        rollNumber: "2024CS001",
        department: "Computer Science"
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Profile</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Info */}
                        <div className="lg:col-span-2 card">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>

                            <div className="space-y-4">
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input type="text" className="input" value={profile.name} disabled />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input type="email" className="input" value={profile.email} disabled />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="input-group">
                                        <label className="input-label">Roll Number</label>
                                        <input type="text" className="input" value={profile.rollNumber} disabled />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Department</label>
                                        <input type="text" className="input" value={profile.department} disabled />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="lg:col-span-1">
                            <div className="card">
                                <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-900 mb-1">Exams Taken</p>
                                        <p className="text-2xl font-bold text-blue-700">8</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-900 mb-1">Avg Score</p>
                                        <p className="text-2xl font-bold text-green-700">85%</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="text-sm text-purple-900 mb-1">Integrity</p>
                                        <p className="text-2xl font-bold text-purple-700">94%</p>
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