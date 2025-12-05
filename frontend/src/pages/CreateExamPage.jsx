// src/pages/CreateExamPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function CreateExamPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        duration: 60,
        date: "",
        time: "",
        sensitivity: "medium"
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock creation - replace with API call
        alert("Exam created successfully!");
        navigate("/proctor");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Create New Exam</h1>

                    <form onSubmit={handleSubmit} className="card space-y-6">
                        <div className="input-group">
                            <label className="input-label">Exam Title</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="input-label">Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.duration}
                                    onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Monitoring Sensitivity</label>
                                <select
                                    className="input"
                                    value={formData.sensitivity}
                                    onChange={e => setFormData(prev => ({ ...prev, sensitivity: e.target.value }))}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="input-label">Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.date}
                                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Time</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={formData.time}
                                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="button" onClick={() => navigate("/proctor")} className="btn btn-secondary flex-1">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary flex-1">
                                Create Exam
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}