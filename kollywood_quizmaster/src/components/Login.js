import React, { useState } from "react";
import { login, isLoggedIn } from "../auth";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your name.");
      return;
    }
    login(username.trim());
    setError("");
    onSuccess && onSuccess(); // For parent sync.
    navigate("/");
  }

  return (
    <div className="hero" style={{ paddingTop: 100, maxWidth: 420, margin: "0 auto" }}>
      <div className="subtitle" style={{ color: "var(--primary-color)" }}>Kollywood QuizMaster Login</div>
      <h1 className="title" style={{ color: "#0d0d0d", fontSize: "2.2rem" }}>Welcome!</h1>
      <div className="description">
        Please log in to access the Kollywood movie quizzes.
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            padding: 12,
            border: "1px solid var(--primary-color)",
            fontSize: 16,
            borderRadius: 4
          }}
        />
        <button className="btn btn-large" type="submit" style={{ background: "var(--primary-color)" }}>
          Log in
        </button>
        {error && <div style={{ color: "red", fontWeight: 500 }}>{error}</div>}
      </form>
    </div>
  );
}

export default Login;
