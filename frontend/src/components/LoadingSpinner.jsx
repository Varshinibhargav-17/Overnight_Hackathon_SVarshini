// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ size = "md", text = "" }) {
    const sizeClass = size === "sm" ? "spinner-sm" : size === "lg" ? "spinner-lg" : "";

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`spinner ${sizeClass}`}></div>
            {text && <p className="text-sm text-secondary">{text}</p>}
        </div>
    );
}