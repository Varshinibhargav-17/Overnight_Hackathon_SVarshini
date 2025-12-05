// src/components/StatCard.jsx
import React from "react";

export default function StatCard({ label, value, trend, trendValue, icon }) {
    return (
        <div className="stat-card">
            <div className="flex items-start justify-between mb-3">
                <div className="stat-card-label">{label}</div>
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        {icon}
                    </div>
                )}
            </div>
            <div className="stat-card-value">{value}</div>
            {trend && (
                <div className={`stat-card-trend ${trend === "up" ? "positive" : "negative"}`}>
                    {trend === "up" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    )}
                    <span>{trendValue}</span>
                </div>
            )}
        </div>
    );
}