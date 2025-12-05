// src/pages/AnalyticsPage.jsx (Revised Page Title)
import React from "react";
import Header from "../components/Header"; // Assuming Header is a DaisyUI-styled component

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-base-200" data-theme="emerald">
            <Header />

            <div className="container mx-auto px-4 py-12">
                {/* 👇 CHANGE: Adjusted from 4xl to 3xl */}
                <h1 className="text-3xl font-bold text-base-content mb-8 flex items-center gap-3">
                    <span className="text-primary">📊</span> Analytics Dashboard
                </h1>

                {/* Statistics Section using DaisyUI Stats */}
                <div className="shadow-xl stats stats-vertical lg:stats-horizontal w-full mb-10">

                    {/* Total Exams */}
                    <div className="stat bg-base-100">
                        <div className="stat-figure text-primary">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </div>
                        <div className="stat-title">Total Exams</div>
                        <div className="stat-value">24</div>
                        <div className="stat-desc">Since start of semester</div>
                    </div>

                    {/* Total Students */}
                    <div className="stat bg-base-100">
                        <div className="stat-figure text-secondary">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div className="stat-title">Total Students</div>
                        <div className="stat-value">156</div>
                        <div className="stat-desc">Across all sections</div>
                    </div>

                    {/* Average Integrity */}
                    <div className="stat bg-base-100">
                        <div className="stat-figure text-success">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.01 12.01 0 003 12c0 2.492.578 4.808 1.601 6.818A11.95 11.95 0 0012 21c3.072 0 5.945-.968 8.24-2.677.106-.076.216-.144.323-.217A11.996 11.996 0 0021 12c0-2.492-.578-4.808-1.601-6.818z" /></svg>
                        </div>
                        <div className="stat-title">Avg Integrity Score</div>
                        <div className="stat-value text-success">94%</div>
                        <div className="stat-desc">Overall success rate</div>
                    </div>

                    {/* Incidents (Cheating Flags) */}
                    <div className="stat bg-base-100">
                        <div className="stat-figure text-error">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.42-1.748 1.681-3.08l-6.929-12.004c-.732-1.277-2.632-1.277-3.364 0L3.342 16.92c-.739 1.332.14 3.08 1.681 3.08z" /></svg>
                        </div>
                        <div className="stat-title">High-Severity Incidents</div>
                        <div className="stat-value text-error">12</div>
                        <div className="stat-desc">Needs manual review</div>
                    </div>
                </div>

                {/* Detail Section */}
                <div className="card bg-base-100 shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-base-content mb-4 flex items-center gap-2">
                        <span className="text-secondary">📋</span> Recent Activity & Detailed Reports
                    </h2>
                    <p className="text-base-content/70">
                        This section will feature **interactive charts** (e.g., line chart for integrity over time, bar chart for incident types) and a **sortable table** listing recent exams, their average scores, and incident counts.
                    </p>
                    <div className="mt-6 p-4 bg-base-200 rounded-box border border-base-300">
                        <h3 className="font-semibold text-base-content mb-2">Example Chart Placeholder:</h3>
                        <div className="flex justify-center items-center h-40 bg-white rounded-lg border border-dashed border-gray-400">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}