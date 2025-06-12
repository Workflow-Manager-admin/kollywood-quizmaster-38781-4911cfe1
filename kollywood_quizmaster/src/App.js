import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, getUsername, logout } from "./auth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import BlurredPosterQuiz from "./components/BlurredPosterQuiz";
import CharacterMovieMatch from "./components/CharacterMovieMatch";
import MovieBingo from "./components/MovieBingo";
import TimelineQuiz from "./components/TimelineQuiz";
import SpinWheel from "./components/SpinWheel";
import CastCombo from "./components/CastCombo";
import ResultsPage from "./components/ResultsPage";

// PUBLIC_INTERFACE
function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [username, setUsername] = useState(getUsername());

  useEffect(() => {
    setAuthed(isLoggedIn());
    setUsername(getUsername());
  }, []);

  function handleLogout() {
    logout();
    setAuthed(false);
    setUsername(null);
  }

  return (
    <Router>
      <div className="app kq-theme">
        <nav className="navbar" style={{ backgroundColor: "var(--primary-color)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div className="logo">
                <span className="logo-symbol" style={{ color: "#fa00d9" }}>🎬</span>
                Kollywood QuizMaster
              </div>
              {authed ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 500 }}>Hi, {username}</span>
                  <button className="btn" onClick={handleLogout} style={{ background: "#0d0d0d", color: "#fff" }}>
                    Logout
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </nav>
        <main>
          <div className="container" style={{ paddingTop: 90, minHeight: "calc(100vh - 100px)" }}>
            <Routes>
              {!authed && (
                <>
                  <Route path="/login" element={<Login onSuccess={() => { setAuthed(true); setUsername(getUsername()); }} />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </>
              )}
              {authed && (
                <>
                  <Route path="/" element={<Dashboard username={username} />} />
                  <Route path="/quiz/blurred-poster" element={<BlurredPosterQuiz />} />
                  <Route path="/quiz/character-match" element={<CharacterMovieMatch />} />
                  <Route path="/quiz/movie-bingo" element={<MovieBingo />} />
                  <Route path="/quiz/timeline" element={<TimelineQuiz />} />
                  <Route path="/quiz/spin-wheel" element={<SpinWheel />} />
                  <Route path="/quiz/cast-combo" element={<CastCombo />} />
                  <Route path="/results/:quizType" element={<ResultsPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;