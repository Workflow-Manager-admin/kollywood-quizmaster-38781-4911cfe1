import React from "react";
import { useNavigate } from "react-router-dom";

// List of quiz games
const games = [
  {
    path: "/quiz/blurred-poster",
    name: "Blurred Poster Quiz",
    description: "Unblur Kollywood posters, guess titles, use clues or reveal the answer.",
    icon: "🖼️",
    bg: "#FFF0FB"
  },
  {
    path: "/quiz/character-match",
    name: "Character-Movie Match",
    description: "Drag and drop character names into correct Kollywood movie titles.",
    icon: "🤝",
    bg: "#F7E8FF"
  },
  {
    path: "/quiz/movie-bingo",
    name: "Movie Bingo",
    description: "Bingo grid: click Kollywood movies matching categories (awards, themes, etc).",
    icon: "🎰",
    bg: "#FFEFFD"
  },
  {
    path: "/quiz/timeline",
    name: "Movie Timeline Challenge",
    description: "Arrange movies in the order of Kollywood release dates.",
    icon: "🗓️",
    bg: "#EDF8FF"
  },
  {
    path: "/quiz/spin-wheel",
    name: "Spin the Wheel",
    description: "Spin the wheel for a combo and guess the Kollywood movie!",
    icon: "🎡",
    bg: "#E7F8FD"
  },
  {
    path: "/quiz/cast-combo",
    name: "Cast Combo",
    description: "Guess Kollywood movies by cast combos and reverse, spot the odd actor.",
    icon: "🎬",
    bg: "#FFF9E9"
  }
];

// PUBLIC_INTERFACE
function Dashboard({ username }) {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <div className="hero" style={{ paddingTop: 40, paddingBottom: 20 }}>
        <div className="subtitle" style={{ color: "var(--primary-color)" }}>Welcome, {username}!</div>
        <h1 className="title" style={{ color: "#fa00d9", fontSize: "2.5rem" }}>Choose your Kollywood Quiz!</h1>
        <div className="description" style={{ color: "#444", marginBottom: 32 }}>
          Ready to challenge your Kollywood movie knowledge? Select a game below to get started!
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
          gap: "24px",
          marginTop: 30
        }}>
          {games.map(g => (
            <div key={g.name}
              style={{
                background: g.bg,
                borderRadius: 12,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
                border: "2px solid #f5d9fd"
              }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>{g.icon}</div>
              <h2 style={{
                fontWeight: 600,
                fontSize: "1.2rem",
                color: "#0d0d0d",
                margin: 0
              }}>{g.name}</h2>
              <div style={{
                fontSize: "1rem",
                color: "#6a287c",
                margin: "12px 0 24px"
              }}>{g.description}</div>
              <button className="btn" style={{
                background: "var(--primary-color)",
                color: "#fff",
                fontWeight: "bold",
                alignSelf: "flex-end"
              }}
                onClick={() => navigate(g.path)}
              >
                Play
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
