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

    const getStatusColor = (status) => {
        if (status === "passed") return "text-green-600 bg-green-100 border-green-300";
        if (status === "failed") return "text-red-600 bg-red-100 border-red-300";
        return "text-orange-600 bg-orange-100 border-orange-300";
    };

    const getIntegrityColor = (score) => {
        if (score >= 90) return "text-green-700";
        if (score >= 70) return "text-orange-700";
        return "text-red-700";
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Exam Results</h1>
                    <p className="text-slate-600">View your performance and integrity scores</p>
                </div>

                {/* Results Table */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Exam</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Score</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Integrity</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {MOCK_RESULTS.map((result) => (
                                    <tr key={result.id} className="hover:bg-slate-50">
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-slate-900">{result.examName}</p>
                                            <p className="text-sm text-slate-600">{result.totalQuestions} questions</p>
                                        </td>
                                        <td className="py-4 px-4 text-slate-700">
                                            {new Date(result.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-semibold text-lg text-slate-900">{result.score}%</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`font-semibold ${getIntegrityColor(result.integrityScore)}`}>
                                                {result.integrityScore}%
                                            </span>
                                            {result.incidents > 0 && (
                                                <p className="text-xs text-orange-600 mt-1">{result.incidents} incidents</p>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`badge ${getStatusColor(result.status)}`}>
                                                {result.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => setSelectedResult(result)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="stat-card">
                        <p className="text-sm text-slate-600 mb-1">Average Score</p>
                        <p className="text-3xl font-bold text-slate-900">85%</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-slate-600 mb-1">Average Integrity</p>
                        <p className="text-3xl font-bold text-green-600">94%</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-slate-600 mb-1">Exams Taken</p>
                        <p className="text-3xl font-bold text-slate-900">{MOCK_RESULTS.length}</p>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedResult && (
                <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
                    <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedResult.examName}</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-900 mb-1">Score</p>
                                <p className="text-2xl font-bold text-blue-700">{selectedResult.score}%</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-900 mb-1">Integrity Score</p>
                                <p className="text-2xl font-bold text-green-700">{selectedResult.integrityScore}%</p>
                            </div>
                        </div>

                        {selectedResult.incidents > 0 && (
                            <div className="alert alert-warning mb-6">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <strong className="text-orange-900">{selectedResult.incidents} Behavioral Incidents Detected</strong>
                                    <p className="text-orange-800 text-sm mt-1">These did not affect your final score but were noted for review.</p>
                                </div>
                            </div>
                        )}

                        <button onClick={() => setSelectedResult(null)} className="btn btn-secondary w-full">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}