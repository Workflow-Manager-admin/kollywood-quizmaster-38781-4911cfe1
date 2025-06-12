import React, { useState, useEffect } from "react";
import { useKollywoodMovies } from "../tmdb";
import { useNavigate } from "react-router-dom";

// Quiz categories (dummy; you can use TMDB data for dynamic categories)
const categories = [
  { name: "National Award Winner", test: m => m.overview && /award/i.test(m.overview) },
  { name: "Released after 2015", test: m => parseInt(m.release_date, 10) > 2015 },
  { name: "Super Hit", test: m => m.vote_average > 7.5 },
  { name: "Comedy Genre", test: m => m.genre_ids && m.genre_ids.some(id => id === 35) },
  { name: "Blockbuster", test: m => m.vote_count > 500 },
  { name: "Debut Film", test: m => m.overview && /debut/i.test(m.overview) },
  { name: "Viral Song", test: m => m.overview && /song/i.test(m.overview) },
  { name: "Family Drama", test: m => m.genre_ids && m.genre_ids.some(id => id === 18) },
  { name: "Female Lead", test: m => m.overview && /heroin/i.test(m.overview) }
];

function randomize(arr, n) {
  let tmp = arr.slice();
  for (let i = tmp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tmp[i], tmp[j]] = [tmp[j], tmp[i]];
  }
  return tmp.slice(0, n);
}

// PUBLIC_INTERFACE
function MovieBingo() {
  const { movies, loading } = useKollywoodMovies({ page: 1 });
  const [bingoGrid, setBingoGrid] = useState([]);
  const [clicked, setClicked] = useState({});
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && movies.length) {
      // Fill grid with random 3x3 movies for categories
      setBingoGrid(randomize(movies, 9));
    }
  }, [loading, movies]);

  function handleCellClick(i) {
    setClicked(old => ({ ...old, [i]: true }));
    // If all grid cells have been clicked, mark as complete
    if (Object.keys(clicked).length + 1 === 9) setComplete(true);
  }

  if (loading || !bingoGrid.length) return <div className="hero">Loading Kollywood Movie Bingo...</div>;

  return (
    <div className="hero" style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="subtitle" style={{ color: "#fa00d9" }}>Movie Bingo</div>
      <div className="description">
        Click all Kollywood movies matching the criteria: <strong>{categories[0].name}</strong>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        margin: "20px 0 30px"
      }}>
        {bingoGrid.map((movie, idx) => (
          <div
            key={movie.id}
            onClick={() => handleCellClick(idx)}
            style={{
              background: clicked[idx] ? "#fa00d9" : "#ffe0fa",
              color: clicked[idx] ? "#fff" : "#991588",
              borderRadius: 7,
              minHeight: 80,
              padding: "18px 10px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: clicked[idx]
                ? "0 2px 10px #fa00d97a"
                : "0 2px 8px #ecd7ed44"
            }}
          >
            {movie.title}
          </div>
        ))}
      </div>
      {complete && (
        <div style={{ fontWeight: 600, color: "#fa00d9", marginBottom: 19 }}>
          Bingo completed! 🎉
          <button className="btn btn-large" style={{ marginLeft: 22, background: "#fa00d9" }} onClick={() => navigate("/")}>
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieBingo;
