// src/pages/ExamPage.jsx - UPDATED with typing tracker integration
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { startTypingTracker, stopTypingTracker } from "../behavior/typing";

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which data structure uses LIFO principle?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is inheritance in OOP?",
    options: ["Data hiding", "Code reusability", "Encapsulation", "Polymorphism"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "System Query Language", "Standard Query Language"],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "Which sorting algorithm has O(n²) worst-case time complexity?",
    options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
    correctAnswer: 2
  }
];

export default function ExamPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [tabSwitches, setTabSwitches] = useState(0);

  const userId = localStorage.getItem("user_id");
  const examId = "exam_123"; // Replace with actual exam ID

  useEffect(() => {
    // Join exam via socket
    socket.emit("join_exam", {
      user_id: userId,
      exam_id: examId,
      role: "student"
    });

    // 🔥 START TYPING TRACKER
    startTypingTracker({
      user_id: userId,
      exam_id: examId
    });
    console.log("✅ Typing tracker started");

    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Behavioral tracking - Tab switches
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const incident = {
          type: "tab_switch",
          timestamp: new Date().toISOString()
        };
        setIncidents(prev => [...prev, incident]);
        setTabSwitches(prev => prev + 1);

        // Emit via socket
        socket.emit("suspicious_activity", {
          user_id: userId,
          exam_id: examId,
          type: "tab_switch",
          count: tabSwitches + 1,
          timestamp: incident.timestamp
        });

        // Also emit as behavior_event for consistency
        socket.emit("behavior_event", {
          user_id: userId,
          exam_id: examId,
          event_type: "tab_switch",
          payload: { count: tabSwitches + 1 },
          ts: Date.now()
        });

        if (tabSwitches + 1 === 3) {
          alert("⚠️ Warning: Multiple tab switches detected. This will be reported to your proctor.");
        }
      }
    };

    // Behavioral tracking - Right-click prevention
    const handleContextMenu = (e) => {
      e.preventDefault();
      const incident = {
        type: "right_click_attempt",
        timestamp: new Date().toISOString()
      };
      setIncidents(prev => [...prev, incident]);

      socket.emit("behavior_event", {
        user_id: userId,
        exam_id: examId,
        event_type: "right_click",
        payload: {},
        ts: Date.now()
      });

      alert("Right-click is disabled during the exam.");
    };

    // Behavioral tracking - Copy prevention
    const handleCopy = (e) => {
      e.preventDefault();
      const incident = {
        type: "copy_attempt",
        timestamp: new Date().toISOString()
      };
      setIncidents(prev => [...prev, incident]);

      socket.emit("behavior_event", {
        user_id: userId,
        exam_id: examId,
        event_type: "copy_attempt",
        payload: {},
        ts: Date.now()
      });

      alert("⚠️ Copy operations are not allowed during the exam.");
    };

    // Behavioral tracking - Paste prevention
    const handlePaste = (e) => {
      e.preventDefault();
      const incident = {
        type: "paste_attempt",
        timestamp: new Date().toISOString()
      };
      setIncidents(prev => [...prev, incident]);

      socket.emit("behavior_event", {
        user_id: userId,
        exam_id: examId,
        event_type: "paste_attempt",
        payload: {},
        ts: Date.now()
      });

      alert("⚠️ Paste operations are not allowed during the exam.");
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    // Cleanup function
    return () => {
      clearInterval(timer);

      // 🔥 STOP TYPING TRACKER
      stopTypingTracker();
      console.log("✅ Typing tracker stopped");

      // Remove event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [tabSwitches, userId, examId]); // Added dependencies

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlagged(newFlagged);
  };

  const handleSubmit = () => {
    // Stop typing tracker before submitting
    stopTypingTracker();

    socket.emit("submit_exam", {
      user_id: userId,
      exam_id: examId,
      answers: answers,
      incidents: incidents,
      time_taken: 1800 - timeLeft,
      timestamp: new Date().toISOString()
    });

    navigate("/exam-submitted");
  };

  const question = MOCK_QUESTIONS[currentQuestion];
  const answered = Object.keys(answers).length;
  const flaggedCount = flagged.size;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-slate-900">Data Structures Midterm</h1>
              <p className="text-sm text-slate-600">Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-slate-600">Time Remaining</p>
                <p className={`text-lg font-bold ${timeLeft < 300 ? "text-red-600" : timeLeft < 600 ? "text-orange-600" : "text-slate-900"
                  }`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn btn-primary"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Progress */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Progress</span>
                <span className="text-sm font-medium text-slate-900">{answered}/{MOCK_QUESTIONS.length} answered</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(answered / MOCK_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="question-card">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Question {currentQuestion + 1}
                </h2>
                <button
                  onClick={toggleFlag}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${flagged.has(currentQuestion)
                      ? "bg-orange-100 text-orange-700 border border-orange-300"
                      : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                >
                  <span className="mr-1">🚩</span>
                  {flagged.has(currentQuestion) ? "Flagged" : "Flag for Review"}
                </button>
              </div>

              <p className="text-lg text-slate-800 mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`option-button ${answers[currentQuestion] === index ? "selected" : ""}`}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center">
                      {answers[currentQuestion] === index && (
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="btn btn-secondary"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
                disabled={currentQuestion === MOCK_QUESTIONS.length - 1}
                className="btn btn-secondary"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Question Grid</h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {MOCK_QUESTIONS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full aspect-square rounded-lg text-sm font-medium transition-all ${index === currentQuestion
                        ? "bg-blue-600 text-white"
                        : answers[index] !== undefined
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : flagged.has(index)
                            ? "bg-orange-100 text-orange-700 border border-orange-300"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Answered</span>
                  <span className="font-medium text-slate-900">{answered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Flagged</span>
                  <span className="font-medium text-slate-900">{flaggedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Remaining</span>
                  <span className="font-medium text-slate-900">{MOCK_QUESTIONS.length - answered}</span>
                </div>
              </div>

              {/* Behavioral Tracking Status */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Behavioral Monitoring Active</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Typing tracked</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Window monitored</span>
                  </div>
                  {tabSwitches > 0 && (
                    <div className="flex items-center gap-2 text-xs text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{tabSwitches} tab switches detected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Submit Exam?</h2>
            <p className="text-slate-600 mb-6">
              You have answered {answered} out of {MOCK_QUESTIONS.length} questions.
              {flaggedCount > 0 && ` ${flaggedCount} questions are flagged for review.`}
              <br /><br />
              Are you sure you want to submit?
            </p>
            {incidents.length > 0 && (
              <div className="alert alert-warning mb-4">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm">
                  <strong className="text-orange-900">{incidents.length} behavioral incidents logged</strong>
                  <p className="text-orange-800 mt-1">These will be reviewed by your proctor.</p>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary flex-1"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}