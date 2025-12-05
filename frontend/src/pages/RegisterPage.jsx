// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rollNumber: "",
        password: "",
        confirmPassword: ""
    });

    // --- FUNCTIONALITY REMAINS UNCHANGED ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            // NOTE: Add validation logic here (e.g., password match) in a real app
            navigate("/login");
        }
    };
    // ----------------------------------------

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card bg-base-100 shadow-xl max-w-md w-full p-8">

                {/* Logo & Heading */}
                <div className="text-center mb-8">
                    {/* Theme-aware Logo */}
                    <div className="w-16 h-16 rounded-2xl bg-primary text-primary-content flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg">
                        EP
                    </div>
                    <h1 className="text-2xl font-bold text-base-content mb-1">Create Account</h1>
                    <p className="text-base-content/70">Join ExamPulse AI</p>
                </div>

                {/* Progress Indicator (DaisyUI Steps) */}
                <ul className="steps steps-vertical md:steps-horizontal w-full mb-8">
                    <li className={`step ${step >= 1 ? 'step-primary' : ''} text-sm`}>Personal Info</li>
                    <li className={`step ${step >= 2 ? 'step-primary' : ''} text-sm`}>Security</li>
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {step === 1 ? (
                        <>
                            {/* Step 1: Personal Info */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input input-bordered w-full"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input input-bordered w-full"
                                    placeholder="john@university.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Student ID / Roll Number</span>
                                </label>
                                <input
                                    type="text"
                                    name="rollNumber"
                                    className="input input-bordered w-full"
                                    placeholder="2021CS101"
                                    value={formData.rollNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Step 2: Security */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input input-bordered w-full"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                />
                                <label className="label">
                                    <span className="label-text-alt text-base-content/60">At least 8 characters</span>
                                </label>
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input input-bordered w-full"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Alert (DaisyUI) */}
                            <div role="alert" className="alert alert-info">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">After registration, please log in to access your dashboard.</p>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn btn-neutral btn-outline flex-1"
                            >
                                Back
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary btn-lg flex-1">
                            {step === 1 ? "Continue" : "Create Account"}
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm text-base-content/70">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="link link-primary font-semibold"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}