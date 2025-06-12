import React, { useState, useEffect } from "react";
import { fetchKollywoodMovies } from "../tmdb";
import { useNavigate } from "react-router-dom";

// Minimal drag/drop (not using a library for brevity)
function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

const NUM_QUESTIONS = 10;

// Dummy character names for matching, since TMDB API doesn't give character names directly
const sampleChars = [
  { char: "Chitti", movie: "Enthiran" },
  { char: "Bhavani", movie: "Master" },
  { char: "Anniyan", movie: "Anniyan" },
  { char: "Azhagar", movie: "Paruthiveeran" },
  { char: "Pariyerum Perumal", movie: "Pariyerum Perumal" },
  { char: "Vikram", movie: "Vikram" },
  { char: "Suriya", movie: "Soorarai Pottru" },
  { char: "Subramaniapuram", movie: "Subramaniapuram" },
  { char: "Durai Singam", movie: "Singam" },
  { char: "Sivagami", movie: "Baahubali: The Beginning" }
];

// PUBLIC_INTERFACE
function CharacterMovieMatch() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [dragChar, setDragChar] = useState("");
  const [userMap, setUserMap] = useState({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Select 5 to 8 random pairs for each game
    setMatches(shuffle(sampleChars).slice(0, NUM_QUESTIONS));
  }, []);

  function handleDrop(char, movie) {
    setUserMap(old => ({ ...old, [char]: movie }));
  }

  function handleSubmit() {
    const correctCount = matches.reduce(
      (sum, m) => sum + (userMap[m.char] === m.movie ? 1 : 0), 0);
    setScore(correctCount);
    setCompleted(true);
  }

  if (completed)
    return (
      <div className="hero" style={{ maxWidth: 500, margin: "0 auto" }}>
        <div className="subtitle" style={{ color: "#fa00d9" }}>Results</div>
        <h1 className="title" style={{ fontSize: "2rem" }}>Score: {score} / {matches.length}</h1>
        <button className="btn btn-large" onClick={() => navigate("/")}>
          Return to Dashboard
        </button>
      </div>
    );

  const chars = matches.map(m => m.char);
  const movies = shuffle(matches.map(m => m.movie));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingTop: 60 }}>
      <div style={{ fontSize: 15, marginBottom: 16, color: "#fa00d9" }}>
        Character-Movie Match
      </div>
      <div style={{
        display: "flex",
        gap: 30,
        alignItems: "flex-start"
      }}>
        <div>
          <h3 style={{ color: "#6a287c", fontSize: "1.1rem" }}>Characters</h3>
          {chars.map(char => (
            <div
              key={char}
              draggable
              onDragStart={() => setDragChar(char)}
              style={{
                padding: "10px 18px",
                marginBottom: 6,
                background: "#fa00d9",
                color: "#fff",
                borderRadius: 6,
                cursor: "grab",
                boxShadow: "0 2px 5px #fa00d944"
              }}
            >
              {char}
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ color: "#2d0736", fontSize: "1.1rem" }}>Movie Titles</h3>
          {movies.map(movie => (
            <div
              key={movie}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(dragChar, movie)}
              style={{
                minHeight: 40,
                marginBottom: 10,
                padding: "10px 20px",
                borderRadius: 6,
                border: "1.5px dashed #fa00d9",
                background: "#ffe7fa",
                color: "#af1780",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <span style={{ flex: 1 }}>{movie}</span>
              <span>
                {Object.entries(userMap).find(([, v]) => v === movie) &&
                  <span style={{ background: "#fae3fa", color: "#df13bc", borderRadius: 4, padding: "3px 7px" }}>
                    {Object.entries(userMap).find(([, v]) => v === movie)[0]}
                  </span>}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="btn"
        style={{ marginTop: 38, background: "#fa00d9" }}
        onClick={handleSubmit}
        disabled={Object.keys(userMap).length !== matches.length}
      >
        Submit
      </button>
    </div>
  );
}

export default CharacterMovieMatch;
