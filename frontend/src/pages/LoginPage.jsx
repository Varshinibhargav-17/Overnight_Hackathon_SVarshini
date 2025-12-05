// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({ email: "", password: "" });

    // --- FUNCTIONALITY REMAINS UNCHANGED ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("user_id", "user123");
        localStorage.setItem("user_name", formData.email.split("@")[0]);
        localStorage.setItem("user_role", role);
        navigate(role === "proctor" ? "/proctor" : "/");
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
                    <h1 className="text-3xl font-bold text-base-content mb-2">ExamPulse AI</h1>
                    <p className="text-base-content/70">Behavioral Analytics for Online Exams</p>
                </div>

                {/* Role Selection (Redesigned with DaisyUI Tabs) */}
                <div role="tablist" className="tabs tabs-boxed bg-base-300/50 mb-6 p-1">
                    <button
                        role="tab"
                        onClick={() => setRole("student")}
                        className={`tab flex-1 font-semibold ${role === "student" ? "tab-active bg-primary text-primary-content shadow-md" : "hover:bg-base-200"}`}
                    >
                        🎓 Student
                    </button>
                    <button
                        role="tab"
                        onClick={() => setRole("proctor")}
                        className={`tab flex-1 font-semibold ${role === "proctor" ? "tab-active bg-primary text-primary-content shadow-md" : "hover:bg-base-200"}`}
                    >
                        👨‍🏫 Proctor
                    </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Email Address</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full"
                            placeholder="your.email@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        />

                        <div className="flex items-center justify-between text-sm mt-2">
                            {/* Remember Me */}
                            <label className="label cursor-pointer p-0">
                                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mr-2" />
                                <span className="label-text text-base-content/70">Remember me</span>
                            </label>
                            {/* Forgot Password Link */}
                            <a href="#" className="link link-hover link-primary font-medium text-sm">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full mt-8">
                        Sign In
                    </button>
                </form>

                {/* Registration Link */}
                <div className="mt-6 text-center text-sm text-base-content/70">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/register")}
                        className="link link-primary font-semibold"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}