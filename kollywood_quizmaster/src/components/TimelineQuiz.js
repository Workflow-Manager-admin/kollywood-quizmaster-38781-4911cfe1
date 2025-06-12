import React, { useEffect, useState } from "react";
import { useKollywoodMovies } from "../tmdb";
import { useNavigate } from "react-router-dom";

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

const NUM_QUESTIONS = 7;

// PUBLIC_INTERFACE
function TimelineQuiz() {
  const { movies, loading, refetch } = useKollywoodMovies({ page: 1 });
  const [timeline, setTimeline] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && movies.length) {
      // Sample 7 random movies for timeline
      const picked = shuffle(movies).slice(0, NUM_QUESTIONS);
      setTimeline(picked);
    }
  }, [loading, movies]);

  function handleDragStart(idx) {
    setDraggedIdx(idx);
  }
  function handleDrop(idx) {
    if (draggedIdx === undefined || draggedIdx === idx) return;
    let arr = timeline.slice();
    const [item] = arr.splice(draggedIdx, 1);
    arr.splice(idx, 0, item);
    setTimeline(arr);
    setDraggedIdx(undefined);
  }

  function handleSubmit() {
    // Score = sequential movies in strictly ascending release year (by position)
    let correct = 0;
    for (let i = 0; i < timeline.length - 1; ++i) {
      const left = timeline[i].release_date;
      const right = timeline[i+1].release_date;
      if (left && right &&
          parseInt(left) <= parseInt(right)) correct++;
    }
    setScore(correct);
    setSubmitted(true);
  }

  if (loading || !timeline.length) return <div className="hero">Loading Timeline Challenge...</div>;

  if (submitted) {
    return (
      <div className="hero" style={{ maxWidth: 650, margin: "0 auto" }}>
        <div className="subtitle" style={{ color: "#fa00d9" }}>Ordered Timeline</div>
        <div className="description" style={{ marginBottom: 24 }}>
          Here is the correct order:
        </div>
        <ol style={{ textAlign: "left", fontSize: "1.05rem", maxWidth: 370, margin: "0 auto", color: "#ba0077" }}>
        {[...timeline].sort((a, b) => (a.release_date || "").localeCompare(b.release_date || "")).map((m, idx) => (
          <li key={m.id}>{m.title} <em>({m.release_date?.slice(0, 4)})</em></li>
        ))}
        </ol>
        <h2 style={{ marginTop: 23, color: "#0d0d0d" }}>Score: {score} / {timeline.length - 1}</h2>
        <button className="btn btn-large" style={{ marginTop: 15, background: "#fa00d9" }} onClick={() => navigate("/")}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="hero" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="subtitle" style={{ color: "#fa00d9" }}>Movie Timeline Challenge</div>
      <div className="description" style={{ marginBottom: 16 }}>
        Drag and drop Kollywood movies into order from oldest (top) to newest (bottom).
      </div>
      <div style={{
        display: "flex", flexDirection: "column", gap: 8, maxWidth: 370, margin: "0 auto"
      }}>
        {timeline.map((movie, idx) => (
          <div
            key={movie.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            style={{
              background: "#fff",
              color: "#A70083",
              borderRadius: 8,
              boxShadow: "0 2px 10px #f5dbe6aa",
              padding: "13px 16px",
              fontWeight: 600,
              border: "2px solid #eb07ab",
              cursor: "grab",
              opacity: draggedIdx === idx ? 0.5 : 1
            }}
          >
            <span>{movie.title}</span>
            <span style={{ float: "right", color: "#be158a" }}>
              {movie.release_date?.slice(0, 4) || "?"}
            </span>
          </div>
        ))}
      </div>
      <button className="btn btn-large" style={{ marginTop: 23, background: "#fa00d9" }} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default TimelineQuiz;
