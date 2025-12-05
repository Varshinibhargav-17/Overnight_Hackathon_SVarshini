// src/components/LoadingSpinner.jsx
import React from "react";

/**
 * A reusable loading component using DaisyUI's `loading` utility.
 * @param {string} size - 'sm', 'md', or 'lg' (default: 'md').
 * @param {string} text - Optional text displayed below the spinner.
 */
export default function LoadingSpinner({ size = "md", text = "" }) {
    // Map custom size props to DaisyUI loading size classes
    const sizeClass =
        size === "sm" ? "loading-sm" :
            size === "lg" ? "loading-lg" :
                "loading-md"; // Default to md

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-4">
            {/* DaisyUI Loading Spinner */}
            <span
                className={`loading loading-spinner text-primary ${sizeClass}`}
                aria-label="Loading"
            ></span>

            {/* Optional Text */}
            {text && <p className="text-sm font-medium text-base-content/70 animate-pulse">{text}</p>}
        </div>
    );
}