// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("user_id", "user123");
        localStorage.setItem("user_name", formData.email.split("@")[0]);
        localStorage.setItem("user_role", role);
        navigate(role === "proctor" ? "/proctor" : "/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="card-glass max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-xl">
                        EP
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">ExamPulse AI</h1>
                    <p className="text-gray-600">Behavioral Analytics for Online Exams</p>
                </div>

                {/* Role Selection */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                    <button
                        onClick={() => setRole("student")}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${role === "student"
                                ? "bg-white text-blue-600 shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        🎓 Student
                    </button>
                    <button
                        onClick={() => setRole("proctor")}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${role === "proctor"
                                ? "bg-white text-blue-600 shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        👨‍🏫 Proctor
                    </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="your.email@university.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                            <span className="text-gray-700">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/register")}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}