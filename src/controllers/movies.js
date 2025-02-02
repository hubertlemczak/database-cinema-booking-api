const models = require('../models/movies');
const { SUCCESS } = require('../utils/vars');

const getAllMovies = async (req, res) => {
  const [status, dbRes] = await models.getAllMovies(req.query);

  if (status === SUCCESS) {
    return res.status(200).json({
      movies: dbRes,
    });
  }

  res.status(500).json({ error: 'Something went wrong' });
};

const getMovieById = async (req, res) => {
  const movieId = parseInt(req.params.id) || undefined;
  const movieTitle = isNaN(parseInt(req.params.id)) ? req.params.id : undefined;

  const [status, dbRes] = await models.getMovieById(movieId, movieTitle);

  if (status === SUCCESS) {
    return res.status(200).json({ movie: dbRes });
  }

  if (dbRes === 'P2001') {
    return res
      .status(404)
      .json({ error: 'Movie with that id or title does not exist' });
  }

  res.status(500).json({ error: 'Something went wrong' });
};

const createMovie = async (req, res) => {
  const { title, runtimeMins, screenings } = req.body;

  if (!title || !runtimeMins) {
    return res
      .status(400)
      .json({ error: 'Missing fields in the request body' });
  }

  const [status, dbRes] = await models.createMovie(
    title,
    runtimeMins,
    screenings
  );

  if (status === SUCCESS) {
    return res.status(201).json({ movie: dbRes });
  }

  if (dbRes === 'P2002') {
    return res
      .status(409)
      .json({ error: 'A movie with the provided title already exists' });
  }

  res.status(500).json({ error: 'Something went wrong' });
};

const updateMovie = async (req, res) => {
  const { title, runtimeMins } = req.body;

  if (!title && !runtimeMins) {
    return res
      .status(400)
      .json({ error: 'Missing fields in the request body' });
  }

  const movieId = parseInt(req.params.id);

  const [status, dbRes] = await models.updateMovie(movieId, title, runtimeMins);

  if (status === SUCCESS) {
    return res.status(201).json({ movie: dbRes });
  }

  if (dbRes === 'P2025') {
    return res.status(404).json({ error: 'Movie with that id does not exist' });
  }

  if (dbRes === 'P2002') {
    return res
      .status(409)
      .json({ error: 'A movie with the provided title already exists' });
  }

  res.status(500).json({ error: 'Something went wrong' });
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
};
