// src/pages/ProctorDashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import RiskScoreIndicator from "../components/RiskScoreIndicator"; // Assuming this component is styled appropriately or uses generic classes
import { socket } from "../socket";

const MOCK_STUDENTS = [
    { id: 1, name: "Alice Johnson", progress: 75, riskScore: 0.12, incidents: 0, status: "normal" },
    { id: 2, name: "Bob Smith", progress: 85, riskScore: 0.58, incidents: 3, status: "warning" },
    { id: 3, name: "Charlie Brown", progress: 92, riskScore: 0.88, incidents: 8, status: "high-risk" }
];

export default function ProctorDashboard() {
    const [students, setStudents] = useState(MOCK_STUDENTS);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // --- SOCKET LOGIC REMAINS UNCHANGED ---
    useEffect(() => {
        socket.emit("join_exam", { user_id: "proctor_1", exam_id: "exam_123", role: "proctor" });

        socket.on("student_alert", (data) => {
            console.log("Alert received:", data);
        });

        socket.on("risk_update", (data) => {
            console.log("Risk update:", data);
        });
    }, []);
    // ----------------------------------------

    // Map status to DaisyUI classes
    const getStatusClass = (status) => {
        if (status === "normal") return "alert-success border-l-success";
        if (status === "warning") return "alert-warning border-l-warning";
        return "alert-error border-l-error";
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        // Manually trigger the DaisyUI modal
        document.getElementById('student_detail_modal').showModal();
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
        document.getElementById('student_detail_modal').close();
    };

    // Calculate quick stats
    const highRiskCount = students.filter(s => s.status === "high-risk").length;
    const warningCount = students.filter(s => s.status === "warning").length;


    return (
        <div className="min-h-screen bg-base-200">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-base-content mb-8">Live Exam Monitoring 👁️‍🗨️</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 1. Students List (2/3 width) */}
                    <div className="lg:col-span-2">
                        <div className="card bg-base-100 shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-base-content mb-4">Active Students ({students.length})</h2>
                            <div className="space-y-3">
                                {students.map((student) => (
                                    // Use DaisyUI Alert for each student row to indicate status clearly
                                    <div
                                        key={student.id}
                                        className={`alert p-4 border-l-4 rounded-lg cursor-pointer transition-all hover:bg-base-200 ${getStatusClass(student.status)}`}
                                        onClick={() => handleSelectStudent(student)}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Avatar */}
                                                <div className="avatar placeholder">
                                                    <div className="w-10 rounded-full bg-primary text-primary-content">
                                                        <span>{student.name.split(" ").map(n => n[0]).join("")}</span>
                                                    </div>
                                                </div>
                                                {/* Info */}
                                                <div className="flex-1">
                                                    <p className="font-medium text-base-content">{student.name}</p>
                                                    <p className="text-sm text-base-content/70">Progress: {student.progress}%</p>
                                                </div>
                                            </div>
                                            {/* Indicators */}
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:block">
                                                    <RiskScoreIndicator score={student.riskScore} size="sm" />
                                                </div>
                                                {student.incidents > 0 && (
                                                    <div className="badge badge-warning font-semibold">
                                                        {student.incidents} incidents
                                                    </div>
                                                )}
                                                <button className="btn btn-ghost btn-xs text-primary">Details &rarr;</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. Quick Stats (1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="stats stats-vertical shadow w-full bg-base-100 border border-base-300">

                            <div className="stat">
                                <div className="stat-figure text-primary">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2m0 2H7m10 0a3 3 0 01-3 3H7a3 3 0 01-3-3m0 0V9a2 2 0 012-2h4M7 20h4a2 2 0 002-2m0 0V9a2 2 0 00-2-2H9m1.5-6h1.5m-3 0h3" /></svg>
                                </div>
                                <div className="stat-title">Total Students</div>
                                <div className="stat-value text-primary">{students.length}</div>
                            </div>

                            <div className="stat bg-error/10 text-error">
                                <div className="stat-figure text-error">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="stat-title">High Risk</div>
                                <div className="stat-value">{highRiskCount}</div>
                            </div>

                            <div className="stat bg-warning/10 text-warning">
                                <div className="stat-figure text-warning">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div className="stat-title">Warnings</div>
                                <div className="stat-value">{warningCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Detail Modal (DaisyUI Modal) */}
            <dialog id="student_detail_modal" className="modal">
                {selectedStudent && (
                    <div className="modal-box max-w-3xl">
                        <form method="dialog">
                            {/* Close button */}
                            <button
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                        </form>
                        <h3 className="font-bold text-2xl text-base-content mb-6">{selectedStudent.name} Live View</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Placeholder for live feed/screenshot */}
                            <div className="col-span-1 p-4 bg-base-300 rounded-lg flex items-center justify-center h-64">
                                <p className="text-base-content/70">Live Webcam Feed / Screen Capture </p>
                            </div>

                            {/* Key Metrics */}
                            <div className="col-span-1 space-y-4">
                                <div className="stats shadow w-full">
                                    <div className={`stat p-4 ${selectedStudent.status === 'high-risk' ? 'bg-error/10 text-error' : selectedStudent.status === 'warning' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                                        <div className="stat-title text-base-content/70">Risk Score</div>
                                        <div className="stat-value">
                                            <RiskScoreIndicator score={selectedStudent.riskScore} size="lg" />
                                        </div>
                                    </div>
                                </div>

                                <div className="stats shadow w-full">
                                    <div className="stat p-4">
                                        <div className="stat-title text-base-content/70">Exam Progress</div>
                                        <div className="stat-value text-primary">{selectedStudent.progress}%</div>
                                        <div className="stat-desc">Questions Remaining: {Math.round(100 - selectedStudent.progress)}%</div>
                                    </div>
                                </div>

                                <div className="stats shadow w-full">
                                    <div className="stat p-4 bg-warning/10 text-warning">
                                        <div className="stat-title text-base-content/70">Incidents Logged</div>
                                        <div className="stat-value">{selectedStudent.incidents}</div>
                                        <div className="stat-desc">Click 'Flag' to review manual logs.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action mt-0 flex gap-3">
                            <button className="btn btn-error text-error-content flex-1">
                                Flag Student & Send Warning
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="btn btn-secondary flex-1"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {/* Modal backdrop/outside click handler */}
                <form method="dialog" className="modal-backdrop" onClick={handleCloseModal}>
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}