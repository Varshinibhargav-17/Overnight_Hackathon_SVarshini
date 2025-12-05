// src/pages/BaselineSetup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function BaselineSetup() {
    const navigate = useNavigate();
    const [testsCompleted, setTestsCompleted] = useState(0);
    const [currentTest, setCurrentTest] = useState(null);

    const startTest = (testNumber) => {
        setCurrentTest(testNumber);
        // Mock test - in reality, this would navigate to an actual test
        setTimeout(() => {
            setTestsCompleted(prev => prev + 1);
            setCurrentTest(null);

            if (testsCompleted + 1 === 2) {
                // Mark baseline as complete
                localStorage.setItem("needs_baseline", "false");
                const userId = localStorage.getItem("user_id");
                localStorage.setItem(`baseline_${userId}`, "completed");
                // Redirect to dashboard after a short delay
                setTimeout(() => navigate("/"), 2000);
            }
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Baseline</h1>
                        <p className="text-slate-600">
                            Complete 2 practice tests to establish your normal behavior patterns
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="card mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
                            <span className="text-sm text-slate-600">{testsCompleted} / 2 completed</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(testsCompleted / 2) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {testsCompleted === 2 && (
                        <div className="alert alert-success mb-6">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <strong className="text-green-900">Baseline Complete!</strong>
                                <p className="text-green-800 text-sm mt-1">
                                    Redirecting to dashboard...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Test Cards */}
                    <div className="grid gap-4 mb-8">
                        {[1, 2].map((testNum) => (
                            <div key={testNum} className="card">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${testsCompleted >= testNum
                                                ? "bg-green-100 text-green-600"
                                                : currentTest === testNum
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}>
                                            {testsCompleted >= testNum ? (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="font-bold">{testNum}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                Practice Test {testNum}
                                            </h3>
                                            <p className="text-sm text-slate-600">
                                                {testsCompleted >= testNum
                                                    ? "Completed"
                                                    : currentTest === testNum
                                                        ? "In progress..."
                                                        : "10 questions • 15 minutes"}
                                            </p>
                                        </div>
                                    </div>
                                    {testsCompleted < testNum && !currentTest && (
                                        <button
                                            onClick={() => startTest(testNum)}
                                            className="btn btn-primary"
                                            disabled={testsCompleted + 1 < testNum}
                                        >
                                            Start Test
                                        </button>
                                    )}
                                    {currentTest === testNum && (
                                        <div className="spinner"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Card */}
                    <div className="card-gradient">
                        <h3 className="font-semibold text-slate-900 mb-3">What We Track</h3>
                        <ul className="space-y-2 text-sm text-slate-700">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span><strong>Typing patterns:</strong> Speed and rhythm of your keystrokes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span><strong>Mouse movement:</strong> How you navigate and interact</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span><strong>Answer timing:</strong> Time spent on each question</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-900">
                                <strong>Privacy First:</strong> We don't record video, audio, or screenshots.
                                Only anonymous behavioral metrics are collected.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}