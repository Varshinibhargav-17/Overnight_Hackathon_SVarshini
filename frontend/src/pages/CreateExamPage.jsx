// src/pages/CreateExamPage.jsx (Revised Page Title)
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

    // Helper function to handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock creation - replace with API call
        // In a real app, you'd send formData to the server here
        alert("Exam created successfully!");
        navigate("/proctor");
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Assuming the Header component is now a DaisyUI Navbar or equivalent. */}
            <Header />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* 👇 CHANGE: Adjusted from 4xl to 3xl and font-extrabold to font-bold */}
                    <h1 className="text-3xl font-bold text-base-content mb-8">
                        <span className="text-primary mr-2">📅</span> Schedule New Exam
                    </h1>

                    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-8 space-y-6">

                        {/* Exam Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-lg">Exam Title</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g., Data Structures Midterm"
                                className="input input-bordered w-full input-lg"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Grid for Duration and Sensitivity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Duration */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Duration (minutes)</span>
                                    <span className="label-text-alt text-base-content/60">Minimum 10 min</span>
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    placeholder="60"
                                    className="input input-bordered w-full"
                                    min="10"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Monitoring Sensitivity */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Proctoring Sensitivity</span>
                                </label>
                                <select
                                    name="sensitivity"
                                    className="select select-bordered w-full"
                                    value={formData.sensitivity}
                                    onChange={handleChange}
                                >
                                    <option value="low">Low (Only major breaches)</option>
                                    <option value="medium">Medium (Standard: Tracks tabs/copy)</option>
                                    <option value="high">High (Strict: Tracks keystrokes/focus shifts)</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid for Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Date */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Start Date</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    className="input input-bordered w-full"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Time */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Start Time</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    className="input input-bordered w-full"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/proctor")}
                                className="btn btn-neutral btn-outline flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-1"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create Exam
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}