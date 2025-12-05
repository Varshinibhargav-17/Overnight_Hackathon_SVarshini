// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./components/Dashboard";
import ExamPage from "./pages/ExamPage";
import BaselineSetup from "./pages/BaselineSetup";
import ExamSubmitted from "./pages/ExamSubmitted";
import ResultsPage from "./pages/ResultsPage";
import ProctorDashboard from "./pages/ProctorDashboard";
import CreateExamPage from "./pages/CreateExamPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import StudentProfile from "./pages/StudentProfile";

/**
 * ExamPulse AI - Behavioral Analytics for Online Assessment Integrity
 * 
 * Routes:
 * - /login - Login page
 * - /register - Registration page
 * - / - Student dashboard (protected)
 * - /exam - Exam interface with behavioral tracking
 * - /baseline-setup - Baseline creation for new students
 * - /exam-submitted - Exam submission confirmation
 * - /results - Student results page
 * - /proctor - Proctor dashboard for live monitoring
 */

// Protected Route Component
function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Student Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam"
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/baseline-setup"
          element={
            <ProtectedRoute>
              <BaselineSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-submitted"
          element={
            <ProtectedRoute>
              <ExamSubmitted />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* Protected Proctor Routes */}
        <Route
          path="/proctor"
          element={
            <ProtectedRoute>
              <ProctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proctor/create-exam"
          element={
            <ProtectedRoute>
              <CreateExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proctor/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </div>
  );
}
