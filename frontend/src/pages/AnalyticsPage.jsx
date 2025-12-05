// src/pages/AnalyticsPage.jsx
import React from "react";
import Header from "../components/Header";

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Analytics Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card">
                        <p className="text-sm text-slate-600 mb-1">Total Exams</p>
                        <p className="text-3xl font-bold text-slate-900">24</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-slate-600 mb-1">Total Students</p>
                        <p className="text-3xl font-bold text-slate-900">156</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-slate-600 mb-1">Avg Integrity</p>
                        <p className="text-3xl font-bold text-green-600">94%</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-slate-600 mb-1">Incidents</p>
                        <p className="text-3xl font-bold text-orange-600">12</p>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
                    <p className="text-slate-600">Analytics charts and detailed reports will appear here.</p>
                </div>
            </div>
        </div>
    );
}