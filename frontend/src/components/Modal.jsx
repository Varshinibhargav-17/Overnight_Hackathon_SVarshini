// src/components/Modal.jsx
import React, { useEffect } from "react";

/**
 * A reusable modal component based on DaisyUI structure.
 * * Note: DaisyUI modals are controlled by the `open` prop on the `<dialog>` element.
 * We are using a different approach here to maintain compatibility with the original component's
 * Tailwind/React structure and `isOpen` prop.
 * * @param {boolean} isOpen - Whether the modal is visible.
 * @param {function} onClose - Function to call when the modal should close (e.g., clicking backdrop).
 * @param {string} title - Main title for the modal header.
 * @param {string} subtitle - Secondary text for the modal header.
 * @param {node} children - Content of the modal body.
 * @param {string} size - 'sm', 'md', 'lg', or 'xl'. Controls max-width.
 * @param {boolean} showClose - Whether to display the close button.
 */
export default function Modal({ isOpen, onClose, title, subtitle, children, size = "md", showClose = true }) {

    // Effect to prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            // Clean up when component unmounts
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // DaisyUI modal width classes (using Tailwind's max-w utilities)
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg", // Standard DaisyUI 'modal-middle' is typically around 500px, so lg works well.
        lg: "max-w-3xl",
        xl: "max-w-5xl"
    };

    const modalSizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        // The modal-backdrop (overlay) class handles the fixed position, z-index, and background overlay
        // We use `modal-open` class on the container div to ensure visibility
        <div className={`modal modal-open`} data-theme="emerald">

            {/* The DaisyUI approach uses a form/label to close, but here we use a simple
                onClick on a pseudo-backdrop div for simplicity and prop compatibility.
                The overlay div handles closing when clicking outside the content.
            */}
            <div
                className="modal-backdrop absolute inset-0 bg-base-300 bg-opacity-70 z-[99]"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                // daisyUI: `modal-box` for the content container styling (bg, rounded, shadow, padding)
                // We add the size class here.
                className={`modal-box p-6 sm:p-8 relative z-[100] ${modalSizeClass}`}
                // Prevent closing when clicking on the content itself
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                {(title || showClose) && (
                    <div className="flex items-start justify-between pb-4 border-b border-base-200 mb-4">
                        <div className="pr-4">
                            {title && <h3 className="text-2xl font-bold text-base-content">{title}</h3>}
                            {subtitle && <p className="text-sm text-base-content/70 mt-1">{subtitle}</p>}
                        </div>
                        {showClose && (
                            // DaisyUI uses `modal-action` and often a label/form to close, 
                            // but a standard button is cleaner for a simple React component.
                            <button
                                onClick={onClose}
                                className="btn btn-sm btn-ghost absolute right-2 top-2"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Modal Body (Children) */}
                <div className="py-2">
                    {children}
                </div>
            </div>
        </div>
    );
}