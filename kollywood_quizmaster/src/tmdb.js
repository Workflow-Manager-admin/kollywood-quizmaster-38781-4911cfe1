//
// TMDB Movie API integration for Kollywood QuizMaster
//
// This module provides the main functions for querying Kollywood (Tamil cinema) movies using TMDB V3 API.
//
// API Reference: https://developer.themoviedb.org/reference/movie-popular-list
//

const TMDB_API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TAMIL_LANGUAGE_CODE = "ta";

/**
 * Helper to construct TMDB API URL with query params.
 * @param {string} path - endpoint path (starting with /)
 * @param {object} params - query parameters
 * @returns {string}
 */
function buildTmdbUrl(path, params = {}) {
  const url = new URL(TMDB_BASE_URL + path);
  url.searchParams.set("api_key", TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

/**
 * Makes a GET request to the TMDB API.
 * @param {string} url
 * @returns {Promise<any>}
 */
async function tmdbFetch(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`TMDB API error: ${response.status} ${errText}`);
  }
  return response.json();
}

/**
 * PUBLIC_INTERFACE
 * Fetches Kollywood (Tamil) movies from TMDB.
 * By default fetches most popular Tamil-language movies released in India.
 * Can be filtered with criteria as needed for the quiz.
 *
 * @param {object} options - Optional filter/sort parameters:
 *   - page (number): Pagination (default 1)
 *   - year (number): Filter by release year
 *   - withGenres (string): Comma separated genre-ids string
 *   - query (string): For search mode (if provided, will fetch search results)
 *   - [other TMDB /discover or /search params]
 * @returns {Promise<Array>} An array of Tamil movie objects
 */
export async function fetchKollywoodMovies(options = {}) {
  // Default: Tamil language, India origin, sorted by popularity, movie type
  const {
    page = 1,
    year,
    withGenres,
    query,
    ...rest
  } = options;

  let url;
  if (query) {
    // Use search mode if query is specified
    url = buildTmdbUrl("/search/movie", {
      language: "en-US",
      query,
      page,
      include_adult: false,
      region: "IN",
      with_original_language: TAMIL_LANGUAGE_CODE,
      ...rest
    });
  } else {
    // Discover mode for movies in Tamil language, from India
    url = buildTmdbUrl("/discover/movie", {
      language: "en-US",
      sort_by: "popularity.desc",
      page,
      with_original_language: TAMIL_LANGUAGE_CODE,
      region: "IN",
      year,
      with_genres: withGenres,
      ...rest
    });
  }
  const data = await tmdbFetch(url);

  // The results array contains movies. TMDB docs: https://developer.themoviedb.org/reference/discover-movie
  // You may want to filter further to ensure they're Kollywood (India) [as needed].
  return Array.isArray(data.results) ? data.results : [];
}

/**
 * PUBLIC_INTERFACE
 * Fetches details for a specific Kollywood movie from TMDB.
 * @param {number|string} movieId - TMDB movie ID
 * @returns {Promise<object>}
 */
export async function fetchKollywoodMovieDetails(movieId) {
  if (!movieId) throw new Error("movieId is required");
  const url = buildTmdbUrl(`/movie/${movieId}`, {
    language: "en-US",
  });
  return tmdbFetch(url);
}

/**
 * PUBLIC_INTERFACE
 * (React) Custom Hook: useKollywoodMovies
 * Fetches Kollywood movies and provides state for loading/error/data.
 *
 * Usage (in React component):
 *   const { movies, loading, error, refetch } = useKollywoodMovies({ year: 2022 });
 */
import { useEffect, useState, useCallback } from "react";

export function useKollywoodMovies(options = {}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchKollywoodMovies(options);
      setMovies(results);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  }, [JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { movies, loading, error, refetch: fetchData };
}
