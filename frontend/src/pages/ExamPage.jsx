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
  // Use DaisyUI's approach: open the modal via ID
  // const [showSubmitModal, setShowSubmitModal] = useState(false); 
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
          // Use a DaisyUI alert or toast later, but keeping the alert for now
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
    // Close modal if open
    document.getElementById('submit_modal').close();

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
    <div className="min-h-screen bg-base-200">
      {/* Header (DaisyUI Navbar) */}
      <div className="navbar bg-base-100 shadow sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-base-content">Data Structures Midterm</h1>
            <p className="text-sm text-base-content/70 ml-4 hidden sm:block">Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}</p>
          </div>
          <div className="flex-none gap-6">
            <div className="text-right">
              <p className="text-sm text-base-content/70">Time Remaining</p>
              <div className="countdown font-mono text-xl">
                <span className={`stat-value ${timeLeft < 300 ? "text-error" : timeLeft < 600 ? "text-warning" : "text-base-content"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <button
              onClick={() => document.getElementById('submit_modal').showModal()}
              className="btn btn-primary"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content (3/4 width) */}
          <div className="lg:col-span-3">

            {/* Progress */}
            <div className="card bg-base-100 shadow mb-6 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-base-content/70">Progress</span>
                <span className="text-sm font-medium text-base-content">{answered}/{MOCK_QUESTIONS.length} answered</span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={answered}
                max={MOCK_QUESTIONS.length}
              ></progress>
            </div>

            {/* Question Card */}
            <div className="card bg-base-100 shadow-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-base-content">
                  Question {currentQuestion + 1}
                </h2>
                <button
                  onClick={toggleFlag}
                  className={`btn btn-sm ${flagged.has(currentQuestion)
                    ? "btn-warning text-warning-content"
                    : "btn-outline btn-info"
                    }`}
                >
                  <span className="mr-1">🚩</span>
                  {flagged.has(currentQuestion) ? "Flagged for Review" : "Flag for Review"}
                </button>
              </div>

              <p className="text-lg text-base-content mb-8">{question.question}</p>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    // Use DaisyUI Radio styling for options
                    className={`btn w-full justify-start normal-case text-left h-auto min-h-0 py-3 ${answers[currentQuestion] === index ? "btn-active btn-primary text-primary-content" : "btn-outline hover:bg-base-300"}`}
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      className={`radio mr-3 ${answers[currentQuestion] === index ? "checked:bg-primary" : "radio-primary"}`}
                      checked={answers[currentQuestion] === index}
                      readOnly // Radio is visually updated via button click
                    />
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

          {/* Sidebar (1/4 width) */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg sticky top-24 p-6">

              {/* Question Grid */}
              <h3 className="font-semibold text-lg text-base-content mb-4">Question Grid</h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {MOCK_QUESTIONS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`btn btn-square btn-sm font-medium transition-all ${index === currentQuestion
                      ? "btn-primary" // Current question
                      : answers[index] !== undefined
                        ? "bg-success text-success-content hover:bg-success/80 border-success" // Answered
                        : flagged.has(index)
                          ? "bg-warning text-warning-content hover:bg-warning/80 border-warning" // Flagged
                          : "btn-outline btn-neutral" // Unanswered
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="stats stats-vertical w-full bg-base-200">
                <div className="stat p-3">
                  <div className="stat-title">Answered</div>
                  <div className="stat-value text-success">{answered}</div>
                </div>
                <div className="stat p-3">
                  <div className="stat-title">Flagged</div>
                  <div className="stat-value text-warning">{flaggedCount}</div>
                </div>
                <div className="stat p-3">
                  <div className="stat-title">Remaining</div>
                  <div className="stat-value text-primary">{MOCK_QUESTIONS.length - answered}</div>
                </div>
              </div>

              {/* Behavioral Tracking Status */}
              <div className="mt-6 pt-6 border-t border-base-300">
                <p className="text-xs text-base-content/50 mb-2 font-semibold">Proctoring Status 🔒</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-success font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span>Typing tracked (Keystroke dynamics)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-success font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 18H7a2 2 0 01-2-2V8a2 2 0 012-2h.93a2 2 0 00.707-.293l1.115-1.115A2 2 0 0111.414 4h1.172a2 2 0 011.414.586l1.115 1.115A2 2 0 0015.07 8H16a2 2 0 012 2v6a2 2 0 01-2 2z" /></svg>
                    <span>Window focus monitored</span>
                  </div>
                  {tabSwitches > 0 && (
                    <div className="flex items-center gap-2 text-xs text-error font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5c-.334.736-.559 1.54-.784 2.34-.67.243-1.077 1.127-1.175 1.706C8.01 12.336 8 13.568 8 14.5a1 1 0 002 0c0-1.07.01-2.07-.11-2.924-.098-.579-.505-1.463-1.175-1.706-.225-.8-.45-1.604-.784-2.34A1 1 0 0010 7z" clipRule="evenodd" /></svg>
                      <span>**{tabSwitches} Tab Switches** logged!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal (DaisyUI Modal) */}
      <dialog id="submit_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-2xl font-bold text-base-content mb-4">Confirm Exam Submission</h3>
          <p className="text-base-content/80 mb-6">
            You are about to submit your exam.
            <br /><br />
            You have answered **{answered}** out of {MOCK_QUESTIONS.length} questions.
            {flaggedCount > 0 && ` **${flaggedCount}** questions are flagged for review.`}
          </p>

          {/* Incident Alert */}
          {incidents.length > 0 && (
            <div role="alert" className="alert alert-error mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <h3 className="font-bold">Warning: Behavioral Incidents Detected!</h3>
                <div className="text-sm">
                  **{incidents.length}** abnormal activities (like tab switches, copy/paste attempts) were logged. This data will be part of the proctor's review.
                </div>
              </div>
            </div>
          )}

          <div className="modal-action mt-6 flex gap-3">
            <form method="dialog">
              {/* Button to close the modal */}
              <button
                className="btn btn-secondary"
                onClick={() => document.getElementById('submit_modal').close()}
              >
                Review More
              </button>
            </form>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}