// src/components/StatCard.jsx
import React from "react";

/**
 * A reusable statistical card component using DaisyUI 'stat' structure.
 * @param {string} label - Title of the statistic.
 * @param {string|number} value - The main metric value.
 * @param {'up'|'down'|null} trend - Direction of the trend (null if no trend).
 * @param {string} trendValue - The value of the change (e.g., "+5%").
 * @param {React.ReactNode} icon - An SVG icon for the stat.
 */
export default function StatCard({ label, value, trend, trendValue, icon }) {

    // Determine the color and icon styling based on the trend direction
    const trendColorClass =
        trend === "up" ? "text-success" :
            trend === "down" ? "text-error" :
                "text-base-content/70";

    const trendIconPath = trend === "up" ? (
        // Up Arrow SVG
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    ) : (
        // Down Arrow SVG
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    );

    return (
        // DaisyUI 'stat' container
        <div className="stat bg-base-100 shadow-xl p-4 sm:p-6" data-theme="emerald">

            {/* Stat Figure (Icon) */}
            {icon && (
                <div className="stat-figure text-primary">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {icon}
                    </div>
                </div>
            )}

            {/* Stat Title (Label) */}
            <div className="stat-title text-base-content/70 text-sm font-medium">{label}</div>

            {/* Stat Value */}
            <div className="stat-value text-base-content text-3xl font-bold">{value}</div>

            {/* Stat Description (Trend) */}
            {trend && (
                <div className={`stat-desc flex items-center gap-1 font-semibold ${trendColorClass}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {trendIconPath}
                    </svg>
                    <span>{trendValue}</span>
                </div>
            )}

            {/* If no trend, still provide stat-desc for spacing */}
            {!trend && <div className="stat-desc text-transparent">.</div>}
        </div>
    );
}