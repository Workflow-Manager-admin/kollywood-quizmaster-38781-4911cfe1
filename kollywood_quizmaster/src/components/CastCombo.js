import React, { useState } from "react";
import { useKollywoodMovies } from "../tmdb";
import { useNavigate } from "react-router-dom";

// Sample data for demo (real implementation would use API credits/cast)
const combos = [
  {
    actors: ["Vijay", "Samantha", "Sathyaraj"],
    movie: "Mersal",
    odd: "Dhanush"
  },
  {
    actors: ["Rajinikanth", "Nayanthara", "Vijay Sethupathi"],
    movie: "Petta",
    odd: "Keerthy Suresh"
  },
  {
    actors: ["Kamal Haasan", "Trisha", "Vijay Sethupathi"],
    movie: "Vikram",
    odd: "Sivakarthikeyan"
  },
  {
    actors: ["Suriya", "Aparna Balamurali", "Paresh Rawal"],
    movie: "Soorarai Pottru",
    odd: "Dulquer Salmaan"
  }
];

// PUBLIC_INTERFACE
function CastCombo() {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState("direct"); // or reverse
  const [score, setScore] = useState(0);
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  if (step >= combos.length)
    return (
      <div className="hero" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="subtitle" style={{ color: "#fa00d9" }}>Quiz Finished</div>
        <h1 className="title" style={{ fontSize: "2rem" }}>Score: {score} / {combos.length}</h1>
        <div className="description" style={{ margin: "17px 0" }}>
          {result.map((r, i) =>
            <div key={i}>{r}</div>
          )}
        </div>
        <button className="btn btn-large" onClick={() => navigate("/")}>Return to Dashboard</button>
      </div>
    );

  const combo = combos[step];
  const handleSubmit = e => {
    e.preventDefault();
    let correct = false, msg = "";
    if (mode === "direct") {
      correct = answer && answer.toLowerCase().includes(combo.movie.toLowerCase().slice(0, 5));
      msg = correct ? "✅ Correct!" : `❌ The answer was: ${combo.movie}`;
    } else {
      correct = answer && answer.toLowerCase().includes(combo.odd.toLowerCase().slice(0, 5));
      msg = correct ? "✅ Correct!" : `❌ The odd actor/actress out was: ${combo.odd}`;
    }
    setResult([...result, msg]);
    setScore(s => s + (correct ? 1 : 0));
    setStep(step + 1);
    setAnswer("");
  };

  return (
    <div className="hero" style={{ maxWidth: 500, margin: "0 auto" }}>
      <div className="subtitle" style={{ color: "#fa00d9" }}>Cast Combo</div>
      <div style={{ marginBottom: 21, fontWeight: 600, color: "#970e68" }}>
        {mode === "direct"
          ? `Which Kollywood movie starred ${combo.actors.join(", ")}?`
          : `Which actor/actress did NOT act in "${combo.movie}"?`
        }
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 7 }}>
        <input
          type="text"
          value={answer}
          required
          placeholder="Your answer"
          onChange={e => setAnswer(e.target.value)}
          style={{ flex: 1, padding: 10, fontSize: 16, border: "1.5px solid #fa00d9", borderRadius: 4 }}
        />
        <button className="btn" style={{ background: "#fa00d9" }}>Submit</button>
      </form>
      <button className="btn" style={{
        marginTop: 16,
        background: "#fff",
        color: "#fa00d9",
        border: "1.5px solid #fa00d9"
      }}
        onClick={() => setMode(mode === "direct" ? "reverse" : "direct")}
        type="button"
      >
        Switch to {mode === "direct" ? "Odd-actor-out" : "Combo"} mode
      </button>
    </div>
  );
}

export default CastCombo;
