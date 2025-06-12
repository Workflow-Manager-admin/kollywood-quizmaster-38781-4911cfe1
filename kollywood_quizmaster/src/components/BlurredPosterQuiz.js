import React, { useEffect, useState } from "react";
import { useKollywoodMovies, fetchKollywoodMovieDetails } from "../tmdb";
import { useNavigate } from "react-router-dom";

// Helpers for clues (simple version, more can be added for real implementation)
function getClues(movie) {
  const clue1 = movie.release_date ? `Released in: ${movie.release_date.split("-")[0]}` : "";
  let clue2 = "";
  if (movie.genre_ids && movie.genre_ids.length) {
    clue2 = "Genre: " + movie.genre_ids.slice(0,2).join(", ");
  } else if (movie.overview) {
    clue2 = "Plot: " + movie.overview.slice(0, 60) + "...";
  }
  return [clue1, clue2];
}

// Quiz constants
const NUM_QUESTIONS = 10;

// PUBLIC_INTERFACE
function BlurredPosterQuiz() {
  const [step, setStep] = useState(0); // which question
  const [answers, setAnswers] = useState([]);
  const [givenAnswer, setGivenAnswer] = useState("");
  const [movies, setMovies] = useState([]);
  const [clues, setClues] = useState([["", ""]]);
  const [reveal, setReveal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  // On mount, fetch random movies
  useEffect(() => {
    setLoading(true);
    // Get a page of movies and shuffle to select 10 unique
    (async () => {
      let result = await fetch('/kollywood_quizmaster/src/kollywood_movie_seed.json');
      let moviesSeed;
      try {
        moviesSeed = await result.json();
      } catch (e) {
        moviesSeed = null;
      }
      let moviesRaw;
      if (moviesSeed && Array.isArray(moviesSeed)) {
        moviesRaw = moviesSeed;
      } else {
        // fallback: use API
        const { movies: loaded, error } = await (await import("../tmdb")).useKollywoodMovies();
        moviesRaw = loaded || [];
      }
      // If >10 movies, randomly sample 10 for quiz
      let movies10 = moviesRaw.slice();
      for (let i = movies10.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movies10[i], movies10[j]] = [movies10[j], movies10[i]];
      }
      movies10 = movies10.slice(0, NUM_QUESTIONS);
      setMovies(movies10);
      setClues(movies10.map(getClues));
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="hero"><div>Loading your quiz...</div></div>
  );

  if (step >= movies.length) {
    // Quiz complete
    setTimeout(() => navigate(`/results/blurred-poster`, { state: { score, total: movies.length } }), 1200);
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: "#fa00d9" }}>Quiz Complete!</div>
        <h1 className="title">Score: {score} / {movies.length}</h1>
        <button className="btn btn-large" onClick={() => navigate("/")}>Go to Dashboard</button>
      </div>
    );
  }

  const movie = movies[step];
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}`
    : null;
  const [clue1, clue2] = clues[step] || ["", ""];

  function handleSubmit(e) {
    e.preventDefault();
    const canonical = x => x.replace(/[\W_]+/gi, "").toLowerCase();
    const isCorrect = movie.title
      && canonical(givenAnswer) === canonical(movie.title);
    setAnswers([...answers, { guess: givenAnswer, correct: movie.title, isCorrect }]);
    setScore(s => s + (isCorrect ? 1 : 0));
    setGivenAnswer("");
    setReveal(false);
    setStep(step + 1);
  }
  function handleReveal() {
    setReveal(true);
    setAnswers([...answers, { guess: null, correct: movie.title, isCorrect: false, revealed: true }]);
    setStep(step + 1);
  }

  return (
    <div style={{ maxWidth: 550, margin: "0 auto", paddingTop: 60 }}>
      <div style={{ fontSize: 15, marginBottom: 16, color: "#fa00d9" }}>Question {step + 1} / {movies.length}</div>
      <div style={{
        background: "#fa00d93b",
        borderRadius: 12,
        padding: 32,
        boxShadow: "0 0 5px 1px #fcd5f7a8"
      }}>
        <h2 style={{ color: "#0d0d0d", fontWeight: 600, fontSize: "1.2rem" }}>Guess the Movie (Kollywood Blurred Poster)</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {posterUrl
            ? (
              <img
                src={posterUrl}
                style={{
                  width: "210px",
                  height: "320px",
                  objectFit: "cover",
                  borderRadius: 11,
                  filter: reveal ? "none" : "blur(14px)",
                  margin: "20px 0"
                }}
                alt="Kollywood movie poster"
              />
            ) : (
              <div style={{ background: "#e8e8e8", width: "210px", height: "320px", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", color: "#ab2e9d" }}>No Poster</div>
            )
          }
        </div>
        <div style={{ margin: "19px 0", fontWeight: 500 }}>Clue 1: <span style={{ color: "#4e085e" }}>{clue1}</span></div>
        <div style={{ marginBottom: 13, fontWeight: 500 }}>Clue 2: <span style={{ color: "#991588" }}>{clue2}</span></div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <input
            type="text"
            value={givenAnswer}
            required
            placeholder="Type movie title"
            onChange={e => setGivenAnswer(e.target.value)}
            style={{ flex: 1, padding: 10, fontSize: 16, border: "1.5px solid #eb07ab", borderRadius: 5 }}
            disabled={reveal}
          />
          <button className="btn" type="submit" style={{ background: "#fa00d9" }} disabled={reveal || !givenAnswer.trim()}>Submit</button>
        </form>
        <button
          className="btn"
          style={{
            background: "#fff",
            color: "#fa00d9",
            border: "1.5px solid #fa00d9",
            marginTop: 10
          }}
          type="button"
          onClick={handleReveal}
        >
          Reveal Answer
        </button>
        {reveal && (
          <div style={{ color: "#d40497", fontWeight: 600, marginTop: 10 }}>
            The answer was: {movie.title}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlurredPosterQuiz;
