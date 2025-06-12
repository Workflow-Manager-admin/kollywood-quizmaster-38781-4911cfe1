# kollywood-quizmaster-38781-4911cfe1

## TMDB (The Movie Database) API Integration

This project integrates with [TMDB](https://www.themoviedb.org/)'s API to fetch Kollywood (Tamil cinema) movies for quizzes and game features.

- TMDB API Key: `5bc67d3b06aecbd18121a3cbbc16eb59`
- Movie source: Tamil-language (Kollywood) films, filtered using TMDB's `/discover/movie` endpoint

See [`kollywood_quizmaster/src/tmdb.js`](kollywood_quizmaster/src/tmdb.js) for the main fetch functions and a reusable React hook for fetching Kollywood movie data.