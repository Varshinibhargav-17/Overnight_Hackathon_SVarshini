// src/pages/ProctorDashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import RiskScoreIndicator from "../components/RiskScoreIndicator";
import { socket } from "../socket";

const MOCK_STUDENTS = [
    { id: 1, name: "Alice Johnson", progress: 75, riskScore: 0.12, incidents: 0, status: "normal" },
    { id: 2, name: "Bob Smith", progress: 85, riskScore: 0.58, incidents: 3, status: "warning" },
    { id: 3, name: "Charlie Brown", progress: 92, riskScore: 0.88, incidents: 8, status: "high-risk" }
];

export default function ProctorDashboard() {
    const [students, setStudents] = useState(MOCK_STUDENTS);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        socket.emit("join_exam", { user_id: "proctor_1", exam_id: "exam_123", role: "proctor" });

        socket.on("student_alert", (data) => {
            console.log("Alert received:", data);
        });

        socket.on("risk_update", (data) => {
            console.log("Risk update:", data);
        });
    }, []);

    const getStatusColor = (status) => {
        if (status === "normal") return "border-l-green-500";
        if (status === "warning") return "border-l-orange-500";
        return "border-l-red-500";
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Live Exam Monitoring</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Students List */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Students ({students.length})</h2>
                            <div className="space-y-3">
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        className={`p-4 bg-white border-l-4 rounded-lg ${getStatusColor(student.status)} hover:shadow-md transition-shadow cursor-pointer`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                                                    {student.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">{student.name}</p>
                                                    <p className="text-sm text-slate-600">Progress: {student.progress}%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <RiskScoreIndicator score={student.riskScore} size="sm" />
                                                {student.incidents > 0 && (
                                                    <span className="badge badge-warning">{student.incidents} incidents</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card">
                            <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-900 mb-1">Total Students</p>
                                    <p className="text-2xl font-bold text-blue-700">{students.length}</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-sm text-red-900 mb-1">High Risk</p>
                                    <p className="text-2xl font-bold text-red-700">
                                        {students.filter(s => s.status === "high-risk").length}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <p className="text-sm text-orange-900 mb-1">Warnings</p>
                                    <p className="text-2xl font-bold text-orange-700">
                                        {students.filter(s => s.status === "warning").length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="modal-content max-w-3xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{selectedStudent.name}</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center">
                                <p className="text-sm text-slate-600 mb-2">Risk Score</p>
                                <RiskScoreIndicator score={selectedStudent.riskScore} size="lg" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-600 mb-2">Progress</p>
                                <p className="text-4xl font-bold text-slate-900">{selectedStudent.progress}%</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="btn btn-danger flex-1">Flag Student</button>
                            <button onClick={() => setSelectedStudent(null)} className="btn btn-secondary flex-1">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}