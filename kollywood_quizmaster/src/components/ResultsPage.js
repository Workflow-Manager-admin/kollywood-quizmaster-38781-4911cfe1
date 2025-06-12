import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// PUBLIC_INTERFACE
function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizType } = useParams();
  const score = location.state?.score ?? "-";
  const total = location.state?.total ?? "-";

  const quizNameMap = {
    "blurred-poster": "Blurred Poster Quiz",
    "character-match": "Character-Movie Match",
    "movie-bingo": "Movie Bingo",
    "timeline": "Movie Timeline Challenge",
    "spin-wheel": "Spin the Wheel",
    "cast-combo": "Cast Combo"
  };

  return (
    <div className="hero" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="subtitle" style={{ color: "#fa00d9" }}>{quizNameMap[quizType] || "Kollywood Quiz"}</div>
      <h1 className="title" style={{ fontSize: "2rem" }}>Quiz Complete!</h1>
      <div style={{ margin: "17px 0", fontWeight: 500 }}>
        Your Score: <span style={{ color: "#c6138c" }}>{score} / {total}</span>
      </div>
      <button className="btn btn-large" onClick={() => navigate("/")}>Return to Dashboard</button>
    </div>
  );
}

export default ResultsPage;
