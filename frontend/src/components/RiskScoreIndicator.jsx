// src/components/RiskScoreIndicator.jsx
import React from "react";

export default function RiskScoreIndicator({ score, size = "md", showLabel = true }) {
    const percentage = Math.round(score * 100);

    // Determine risk level and DaisyUI color classes based on the score threshold
    let level, colorClass, badgeColorClass;

    if (score < 0.3) {
        level = "Low Risk";
        // DaisyUI Success/Primary for Low Risk (using success from the emerald theme)
        colorClass = "text-success stroke-success";
        badgeColorClass = "badge-success";
    } else if (score < 0.7) {
        level = "Medium Risk";
        // DaisyUI Warning for Medium Risk
        colorClass = "text-warning stroke-warning";
        badgeColorClass = "badge-warning";
    } else {
        level = "High Risk";
        // DaisyUI Error for High Risk
        colorClass = "text-error stroke-error";
        badgeColorClass = "badge-error";
    }

    // Define size properties (width, stroke width, font size)
    const sizes = {
        sm: { width: 80, strokeWidth: 6, fontSize: "text-base" },
        md: { width: 120, strokeWidth: 8, fontSize: "text-xl" },
        lg: { width: 160, strokeWidth: 10, fontSize: "text-3xl" }
    };

    const { width, strokeWidth, fontSize } = sizes[size];

    // SVG Calculation Logic
    const radius = (width - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3" data-theme="emerald">
            <div className="relative inline-flex items-center justify-center">
                <svg width={width} height={width} className="transform -rotate-90">
                    {/* Background circle (using a neutral color from DaisyUI base) */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor" // Use Tailwind current color
                        className="text-base-300" // Set stroke color to light gray
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor" // Use currentColor and apply colorClass to SVG
                        className={colorClass.split(" ")[0]} // Apply stroke color class
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                            transition: "stroke-dashoffset 0.5s ease-in-out"
                        }}
                    />
                </svg>
                {/* Center Percentage Display */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${fontSize}`}>
                    <span className={`font-bold ${colorClass.split(" ")[0]}`}>{percentage}%</span>
                </div>
            </div>

            {/* Risk Level Badge using DaisyUI `badge` */}
            {showLabel && (
                <div className={`badge ${badgeColorClass} text-sm font-semibold p-3`}>
                    {level}
                </div>
            )}
        </div>
    );
}