// src/components/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, subtitle, children, size = "md", showClose = true }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content ${sizeClasses[size] || sizeClasses.md}`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || showClose) && (
                    <div className="modal-header">
                        <div className="flex items-start justify-between">
                            <div>
                                {title && <h2 className="modal-title">{title}</h2>}
                                {subtitle && <p className="modal-subtitle">{subtitle}</p>}
                            </div>
                            {showClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}
                <div>{children}</div>
            </div>
        </div>
    );
}