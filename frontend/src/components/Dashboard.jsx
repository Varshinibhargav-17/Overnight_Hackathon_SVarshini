// src/components/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
// import StatCard from "./StatCard"; // Replaced with inline DaisyUI cards for consistent theming

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "Student";

  const stats = [
    {
      label: "Exams Completed",
      value: "12",
      trend: "up",
      trendValue: "+2 this month",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: "Average Score",
      value: "85%",
      trend: "up",
      trendValue: "+5% improvement",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    },
    {
      label: "Integrity Score",
      value: "94%",
      trend: "up",
      trendValue: "Excellent",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
      label: "Upcoming Exams",
      value: "3",
      trend: null,
      trendValue: "This week",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    }
  ];

  const upcomingExams = [
    { id: 1, name: "Data Structures Final", date: "Dec 8, 2024", time: "10:00 AM", duration: "120 min", status: "scheduled" },
    { id: 2, name: "Machine Learning Midterm", date: "Dec 10, 2024", time: "2:00 PM", duration: "90 min", status: "scheduled" },
    { id: 3, name: "Database Systems Quiz", date: "Dec 12, 2024", time: "11:00 AM", duration: "60 min", status: "scheduled" }
  ];

  const recentActivity = [
    { type: "exam", message: "Completed Operating Systems Exam", time: "2 days ago", status: "success" },
    { type: "baseline", message: "Baseline profile updated", time: "5 days ago", status: "info" },
    { type: "exam", message: "Completed Algorithms Quiz", time: "1 week ago", status: "success" }
  ];

  return (
    <div className="min-h-screen bg-base-200 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Welcome back, <span className="text-primary">{userName}</span>! 👋
          </h1>
          <p className="text-base-content/70">Here's what's happening with your exams today.</p>
        </div>

        {/* Stats Grid - Redesigned as DaisyUI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl border-b-4 border-primary hover:-translate-y-1 transition-transform duration-200">
              <div className="card-body p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-base-content/60 uppercase tracking-wide">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-base-content mt-2">{stat.value}</h3>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {stat.icon}
                  </div>
                </div>
                {stat.trendValue && (
                  <div className={`mt-4 text-xs font-semibold ${stat.trend === "up" ? "text-success" : "text-base-content/50"}`}>
                    {stat.trend === "up" && "▲ "} {stat.trendValue}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Upcoming Exams */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-xl">Upcoming Exams</h2>
                  <button className="btn btn-sm btn-ghost hover:bg-base-200">View All</button>
                </div>

                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="group flex flex-col md:flex-row items-center justify-between p-4 bg-base-100 border border-base-200 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Date Box */}
                        <div className="w-14 h-14 rounded-xl bg-secondary/10 flex flex-col items-center justify-center text-secondary font-bold shadow-sm">
                          <span className="text-sm uppercase">{exam.date.split(' ')[0]}</span>
                          <span className="text-xl leading-none">{exam.date.split(' ')[1].replace(',', '')}</span>
                        </div>

                        {/* Info */}
                        <div>
                          <h3 className="font-bold text-base-content group-hover:text-primary transition-colors">{exam.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/60 mt-1">
                            <span className="badge badge-ghost badge-sm gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {exam.time}
                            </span>
                            <span className="text-xs">• {exam.duration}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate("/exam")}
                        className="btn btn-primary btn-sm mt-4 md:mt-0 w-full md:w-auto"
                      >
                        Start Exam
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-2">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigate("/baseline-setup")} className="btn btn-ghost justify-start bg-base-200/50 hover:bg-base-200 gap-3 normal-case font-normal">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Update Baseline
                  </button>
                  <button onClick={() => navigate("/results")} className="btn btn-ghost justify-start bg-base-200/50 hover:bg-base-200 gap-3 normal-case font-normal">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Results
                  </button>
                  <button onClick={() => navigate("/profile")} className="btn btn-ghost justify-start bg-base-200/50 hover:bg-base-200 gap-3 normal-case font-normal">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Recent Activity</h3>
                <ul className="steps steps-vertical w-full">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className={`step ${activity.status === 'success' ? 'step-primary' : 'step-secondary'} !min-h-12`}>
                      <div className="text-left w-full ml-2 pb-4">
                        <p className="text-sm font-medium text-base-content">{activity.message}</p>
                        <p className="text-xs text-base-content/50">{activity.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exam Tips */}
            <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl border border-primary/10">
              <div className="card-body">
                <h3 className="card-title text-lg mb-2 text-primary">💡 Exam Tips</h3>
                <ul className="space-y-3">
                  {[
                    "Keep your focus on the exam window",
                    "Avoid switching tabs during the test",
                    "Review flagged questions before submitting"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-base-content/80">
                      <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}