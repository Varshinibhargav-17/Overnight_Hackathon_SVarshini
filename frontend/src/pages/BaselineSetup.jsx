// src/pages/BaselineSetup.jsx (Revised Page Title)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Assuming Header is a DaisyUI-styled component

export default function BaselineSetup() {
    const navigate = useNavigate();
    const [testsCompleted, setTestsCompleted] = useState(0);
    const [currentTest, setCurrentTest] = useState(null);

    const startTest = (testNumber) => {
        setCurrentTest(testNumber);

        // Mock test simulation
        setTimeout(() => {
            setTestsCompleted(prev => prev + 1);
            setCurrentTest(null);

            // Logic to mark baseline as complete after 2 tests
            if (testsCompleted + 1 === 2) {
                // Mark baseline as complete
                const userId = localStorage.getItem("user_id");
                localStorage.setItem("needs_baseline", "false");
                localStorage.setItem(`baseline_${userId}`, "completed");

                // Redirect to dashboard after a short delay
                setTimeout(() => navigate("/"), 2000);
            }
        }, 3000); // Simulate a 3-second test duration
    };

    return (
        <div className="min-h-screen bg-base-200" data-theme="emerald">
            <Header />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mx-auto w-16 h-16 bg-primary text-primary-content rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        {/* 👇 CHANGE: Adjusted from 3xl to 2xl */}
                        <h1 className="text-2xl font-bold text-base-content mb-2">Create Your Behavior Baseline</h1>
                        <p className="text-base-content/70">
                            Complete 2 short practice tests to establish your **normal typing and navigation patterns** for accurate exam proctoring.
                        </p>
                    </div>

                    {/* Progress Card */}
                    <div className="card bg-base-100 shadow-xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-base-content">Setup Progress</h2>
                            <span className="text-lg font-bold text-primary">{testsCompleted} / 2</span>
                        </div>
                        <progress
                            className="progress progress-primary w-full"
                            value={testsCompleted}
                            max="2"
                        ></progress>
                    </div>

                    {/* Completion Alert */}
                    {testsCompleted === 2 && (
                        <div role="alert" className="alert alert-success mb-6 shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div>
                                <h3 className="font-bold text-success-content">Baseline Complete! 🎉</h3>
                                <p className="text-sm">
                                    Your profile is now established. Redirecting to dashboard...
                                </p>
                            </div>
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    )}

                    {/* Test Cards */}
                    <div className="grid gap-4 mb-8">
                        {[1, 2].map((testNum) => {
                            const isCompleted = testsCompleted >= testNum;
                            const isInProgress = currentTest === testNum;
                            const isLocked = testsCompleted + 1 < testNum;

                            let cardClass = "card-body flex-row items-center justify-between transition-all";
                            let statusText = "10 questions • 15 minutes";
                            let iconClass = "w-12 h-12 rounded-full flex items-center justify-center";
                            let iconContent;

                            if (isCompleted) {
                                cardClass += " bg-success/10 border border-success/30";
                                iconClass += " bg-success text-success-content";
                                statusText = "Completed successfully";
                                iconContent = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
                            } else if (isInProgress) {
                                cardClass += " bg-primary/10 border border-primary/30";
                                iconClass += " bg-primary text-primary-content";
                                statusText = "In progress...";
                                iconContent = <span className="loading loading-ring loading-md"></span>;
                            } else if (isLocked) {
                                cardClass += " bg-base-300 opacity-60";
                                iconClass += " bg-base-content/10 text-base-content/30";
                                iconContent = <span className="font-bold">{testNum}</span>;
                            } else {
                                cardClass += " bg-base-100 shadow-md hover:shadow-lg";
                                iconClass += " bg-base-300 text-base-content/70";
                                iconContent = <span className="font-bold">{testNum}</span>;
                            }

                            return (
                                <div key={testNum} className="card">
                                    <div className={cardClass}>
                                        <div className="flex items-center gap-4">
                                            <div className={iconClass}>
                                                {iconContent}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-base-content">
                                                    Practice Test {testNum}
                                                </h3>
                                                <p className={`text-sm ${isCompleted ? 'text-success' : 'text-base-content/70'}`}>
                                                    {statusText}
                                                </p>
                                            </div>
                                        </div>

                                        {!isCompleted && !isInProgress && (
                                            <button
                                                onClick={() => startTest(testNum)}
                                                className="btn btn-primary"
                                                disabled={isLocked}
                                            >
                                                Start Test
                                            </button>
                                        )}
                                        {isInProgress && (
                                            <button className="btn btn-primary" disabled>
                                                <span className="loading loading-spinner"></span>
                                                Running...
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Info Card */}
                    <div className="card bg-info/20 border border-info shadow-sm p-6">
                        <h3 className="font-bold text-info-content mb-3 flex items-center gap-2">
                            <svg className="w-6 h-6 text-info-content" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            What Data Creates the Baseline?
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-info-content">
                            <li>
                                <strong>Typing patterns:</strong> Metrics like **dwell time** (key press duration) and **flight time** (time between key releases) to create a unique **keystroke biometric profile**.
                            </li>
                            <li>
                                <strong>Mouse movements:</strong> Tracking of speed, distance, and pauses in mouse/trackpad usage.
                            </li>
                            <li>
                                <strong>Answer timing:</strong> Recording the typical time taken for reading and responding to questions.
                            </li>
                        </ul>
                        <div role="alert" className="alert alert-warning mt-4 text-xs bg-base-100 text-base-content border-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p>
                                **Privacy First:** We only collect anonymous behavioral metrics. We **do not** record video, audio, or screenshot your desktop.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}