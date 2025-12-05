// src/pages/ResultsPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";

const MOCK_RESULTS = [
    {
        id: 1,
        examName: "Data Structures Midterm",
        date: "2024-03-15",
        score: 85,
        totalQuestions: 50,
        integrityScore: 95,
        status: "passed",
        incidents: 2
    },
    {
        id: 2,
        examName: "Algorithms Quiz",
        date: "2024-03-10",
        score: 92,
        totalQuestions: 30,
        integrityScore: 98,
        status: "passed",
        incidents: 0
    },
    {
        id: 3,
        examName: "Database Systems Final",
        date: "2024-03-05",
        score: 78,
        totalQuestions: 60,
        integrityScore: 88,
        status: "passed",
        incidents: 5
    }
];

export default function ResultsPage() {
    const [selectedResult, setSelectedResult] = useState(null);

    // --- FUNCTIONALITY REMAINS UNCHANGED (Color logic is adapted to DaisyUI classes) ---
    const getStatusColor = (status) => {
        if (status === "passed") return "badge-success";
        if (status === "failed") return "badge-error";
        return "badge-warning";
    };

    const getIntegrityColor = (score) => {
        if (score >= 90) return "text-success";
        if (score >= 70) return "text-warning";
        return "text-error";
    };

    // Calculate overall stats for the bottom section
    const totalScore = MOCK_RESULTS.reduce((acc, r) => acc + r.score, 0);
    const totalIntegrity = MOCK_RESULTS.reduce((acc, r) => acc + r.integrityScore, 0);
    const avgScore = (totalScore / MOCK_RESULTS.length).toFixed(0);
    const avgIntegrity = (totalIntegrity / MOCK_RESULTS.length).toFixed(0);
    // -----------------------------------------------------------------------------------

    return (
        // Use bg-base-200 for the page background
        <div className="min-h-screen bg-base-200">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-base-content mb-2">Exam Results 📊</h1>
                    <p className="text-base-content/70">View your performance and integrity scores</p>
                </div>

                {/* Overall Stats (DaisyUI Stats Component) */}
                <div className="stats shadow w-full mb-8 border border-base-300">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <div className="stat-title">Average Score</div>
                        <div className="stat-value text-primary">{avgScore}%</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-success">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div className="stat-title">Avg Integrity</div>
                        <div className={`stat-value ${getIntegrityColor(avgIntegrity)}`}>{avgIntegrity}%</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <div className="stat-title">Exams Taken</div>
                        <div className="stat-value">{MOCK_RESULTS.length}</div>
                    </div>
                </div>

                {/* Results Table (DaisyUI Table Component) */}
                <div className="card bg-base-100 shadow-xl overflow-x-auto">
                    <table className="table w-full">
                        {/* head */}
                        <thead className="text-base-content border-b border-base-300">
                            <tr>
                                <th className="text-left font-semibold">Exam</th>
                                <th className="text-left font-semibold">Date</th>
                                <th className="text-left font-semibold">Score</th>
                                <th className="text-left font-semibold">Integrity</th>
                                <th className="text-left font-semibold">Status</th>
                                <th className="text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_RESULTS.map((result) => (
                                <tr key={result.id} className="hover:bg-base-200">
                                    {/* Exam Name */}
                                    <td className="py-4">
                                        <p className="font-medium text-base-content">{result.examName}</p>
                                        <p className="text-sm text-base-content/70">{result.totalQuestions} questions</p>
                                    </td>
                                    {/* Date */}
                                    <td className="text-base-content/80">
                                        {new Date(result.date).toLocaleDateString()}
                                    </td>
                                    {/* Score */}
                                    <td>
                                        <span className="font-bold text-lg text-base-content">{result.score}%</span>
                                    </td>
                                    {/* Integrity */}
                                    <td>
                                        <span className={`font-semibold ${getIntegrityColor(result.integrityScore)}`}>
                                            {result.integrityScore}%
                                        </span>
                                        {result.incidents > 0 && (
                                            <p className="text-xs text-warning mt-1">
                                                <span className="font-bold">{result.incidents}</span> incidents
                                            </p>
                                        )}
                                    </td>
                                    {/* Status */}
                                    <td>
                                        <span className={`badge badge-lg ${getStatusColor(result.status)} text-xs font-semibold uppercase`}>
                                            {result.status}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td>
                                        <button
                                            onClick={() => {
                                                setSelectedResult(result);
                                                // Trigger modal open via its ID if using pure DaisyUI modal structure
                                                document.getElementById('details_modal').showModal();
                                            }}
                                            className="btn btn-ghost btn-sm text-primary hover:bg-primary/10"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>

            {/* Detail Modal (DaisyUI Modal) */}
            <dialog id="details_modal" className="modal">
                {selectedResult && (
                    <div className="modal-box">
                        <form method="dialog">
                            {/* Close button */}
                            <button
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                onClick={() => setSelectedResult(null)} // Reset state on close
                            >
                                ✕
                            </button>
                        </form>

                        <h3 className="font-bold text-2xl text-base-content mb-4">{selectedResult.examName} Details</h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* Score */}
                            <div className="stat bg-primary/10 text-primary">
                                <div className="stat-title text-base-content/70">Score</div>
                                <div className="stat-value">{selectedResult.score}%</div>
                            </div>
                            {/* Integrity Score */}
                            <div className="stat bg-success/10 text-success">
                                <div className="stat-title text-base-content/70">Integrity Score</div>
                                <div className="stat-value">{selectedResult.integrityScore}%</div>
                            </div>
                        </div>

                        {selectedResult.incidents > 0 && (
                            // Alert (DaisyUI)
                            <div role="alert" className="alert alert-warning mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <strong className="text-warning-content">{selectedResult.incidents} Behavioral Incidents Detected</strong>
                                    <p className="text-warning-content text-sm mt-1">These did not affect your final score but were noted for review.</p>
                                </div>
                            </div>
                        )}

                        <div className="modal-action mt-0">
                            <form method="dialog" className="w-full">
                                {/* Button to close the modal */}
                                <button
                                    className="btn btn-secondary w-full"
                                    onClick={() => setSelectedResult(null)} // Reset state on close
                                >
                                    Close Details
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {/* Modal backdrop/outside click handler */}
                <form method="dialog" className="modal-backdrop" onClick={() => setSelectedResult(null)}>
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}