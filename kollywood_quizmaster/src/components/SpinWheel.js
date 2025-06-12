import React, { useState } from "react";
import { useKollywoodMovies } from "../tmdb";
import { useNavigate } from "react-router-dom";

const actors = ["Rajinikanth", "Vijay", "Nayanthara", "Vikram", "Dhanush", "Sivakarthikeyan", "Trisha", "Kamal Haasan"];
const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

// PUBLIC_INTERFACE
function SpinWheel() {
  const { movies, loading } = useKollywoodMovies({ page: 1 });
  const [spun, setSpun] = useState(false);
  const [selection, setSelection] = useState({});
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState();
  const navigate = useNavigate();

  function spin() {
    const actor = actors[Math.floor(Math.random() * actors.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    setSelection({ actor, year });
    setSpun(true);
    setAnswer("");
    setResult(undefined);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!spun) return;
    // Look for a movie by this actor & year (demo; in real, would use API)
    const found = movies.find(m =>
      (m.release_date?.includes(String(selection.year)))
      &&
      (m.title?.toLowerCase().includes(selection.actor.toLowerCase()) // (demo heuristic)
      // Or test in overview or other metadata
      || m.overview?.toLowerCase().includes(selection.actor.toLowerCase()))
    );
    const isCorrect = found && answer && answer.toLowerCase().includes(found.title.toLowerCase().slice(0, 5));
    setResult({
      correct: isCorrect,
      expected: found ? found.title : null
    });
  }

  return (
    <div className="hero" style={{ maxWidth: 450, margin: "0 auto" }}>
      <div className="subtitle" style={{ color: "#fa00d9" }}>Spin the Wheel</div>
      {!spun && (
        <button className="btn btn-large" style={{ background: "#fa00d9", fontSize: 22 }} onClick={spin}>
          Spin 🎡
        </button>
      )}
      {spun && (
        <div style={{ margin: "24px 0 10px", fontWeight: 600 }}>
          <span style={{ color: "#a900a5", fontSize: 21 }}>
            Actor/Actress: {selection.actor}
          </span>
          <br />
          <span style={{ color: "#af158a" }}>
            Year: {selection.year}
          </span>
        </div>
      )}
      {spun && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 17 }}>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Guess Kollywood Movie Title"
            style={{ padding: 10, fontSize: 17, border: "1.5px solid #fa00d9", borderRadius: 5 }}
            required
          />
          <button className="btn btn-large" style={{ background: "#fa00d9" }}>Submit</button>
        </form>
      )}
      {result !== undefined && (
        <div style={{ marginTop: 17 }}>
          {result.correct
            ? <span style={{ fontWeight: 700, color: "#09a54a" }}>Correct!</span>
            : <><span style={{ color: "#ba0044", fontWeight: 500 }}>No! Expected: <b>{result.expected || "Any relevant movie"}</b></span></>
          }
          <button className="btn" style={{ marginLeft: 12, background: "#fa00d9" }} onClick={spin}>Next Spin</button>
        </div>
      )}
      <button className="btn" style={{ marginTop: 29, background: "#eee", color: "#ba0072" }} onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default SpinWheel;
