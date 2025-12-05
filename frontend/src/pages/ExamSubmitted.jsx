// src/pages/ExamSubmitted.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExamSubmitted() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    // --- FUNCTIONALITY REMAINS UNCHANGED ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);
    // ----------------------------------------

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">

                {/* Success Message (Using Hero and Alert structure) */}
                <div className="hero p-8 bg-success/10 rounded-xl mb-8 border border-success/30 text-center">
                    <div className="hero-content flex-col">
                        {/* Success Icon */}
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-success rounded-full mb-4">
                            <svg className="w-12 h-12 text-success-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-success-content">Exam Submitted Successfully! 🎉</h1>
                        <p className="text-success-content/90 max-w-md">
                            Your answers have been securely recorded. The proctoring data will be reviewed shortly.
                        </p>
                    </div>
                </div>

                {/* Summary Stats (DaisyUI Stats Component) */}
                <div className="stats shadow w-full bg-base-100 mb-6 border border-base-300">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M18 10h-2M5 10h2" /></svg>
                        </div>
                        <div className="stat-title text-base-content/70">Exam</div>
                        <div className="stat-value text-xl text-primary">Data Structures Midterm</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-success">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="stat-title text-base-content/70">Questions Answered</div>
                        <div className="stat-value text-2xl text-success">5 / 5</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="stat-title text-base-content/70">Time Taken</div>
                        <div className="stat-value text-2xl text-secondary">12:34</div>
                    </div>
                </div>

                {/* Next Steps (DaisyUI Card) */}
                <div className="card bg-base-100 shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-base-content mb-4 border-b border-base-200 pb-2">What's Next?</h3>
                    <ul className="steps steps-vertical lg:steps-horizontal">
                        <li data-content="✓" className="step step-success">
                            <div className="text-left ml-4">
                                <p className="font-medium text-base-content">Results available soon</p>
                                <p className="text-sm text-base-content/70">Check your dashboard within 24 hours.</p>
                            </div>
                        </li>
                        <li data-content="ⓘ" className="step">
                            <div className="text-left ml-4">
                                <p className="font-medium text-base-content">Email Notification</p>
                                <p className="text-sm text-base-content/70">You'll receive a detailed report via email.</p>
                            </div>
                        </li>
                        <li data-content="↓" className="step">
                            <div className="text-left ml-4">
                                <p className="font-medium text-base-content">Download Certificate</p>
                                <p className="text-sm text-base-content/70">Available on the results page upon passing.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Actions (DaisyUI Buttons) */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-primary flex-1"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/results")}
                        className="btn btn-outline btn-secondary flex-1"
                    >
                        View Past Results
                    </button>
                </div>

                {/* Auto-redirect */}
                <p className="text-center text-sm text-base-content/50 mt-6">
                    Redirecting to dashboard in **{countdown}** seconds...
                </p>
            </div>
        </div>
    );
}