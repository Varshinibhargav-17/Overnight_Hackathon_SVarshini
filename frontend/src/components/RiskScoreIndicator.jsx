// src/components/RiskScoreIndicator.jsx
import React from "react";

export default function RiskScoreIndicator({ score, size = "md", showLabel = true }) {
    const percentage = Math.round(score * 100);

    // Determine risk level and color
    let level, color, bgColor, textColor;
    if (score < 0.3) {
        level = "Low Risk";
        color = "#10b981";
        bgColor = "#d1fae5";
        textColor = "#065f46";
    } else if (score < 0.7) {
        level = "Medium Risk";
        color = "#f59e0b";
        bgColor = "#fef3c7";
        textColor = "#92400e";
    } else {
        level = "High Risk";
        color = "#ef4444";
        bgColor = "#fee2e2";
        textColor = "#991b1b";
    }

    const sizes = {
        sm: { width: 80, strokeWidth: 6, fontSize: "text-sm" },
        md: { width: 120, strokeWidth: 8, fontSize: "text-lg" },
        lg: { width: 160, strokeWidth: 10, fontSize: "text-2xl" }
    };

    const { width, strokeWidth, fontSize } = sizes[size];
    const radius = (width - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative inline-flex items-center justify-center">
                <svg width={width} height={width} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                            transition: "stroke-dashoffset 0.5s ease-in-out"
                        }}
                    />
                </svg>
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${fontSize}`}>
                    <span className="font-bold" style={{ color }}>{percentage}%</span>
                </div>
            </div>
            {showLabel && (
                <div
                    className="risk-indicator"
                    style={{
                        background: bgColor,
                        color: textColor,
                        borderColor: color
                    }}
                >
                    <div className="w-2 h-2 rounded-full" style={{ background: color }}></div>
                    <span>{level}</span>
                </div>
            )}
        </div>
    );
}