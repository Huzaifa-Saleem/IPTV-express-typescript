import { Router } from "express";

import {
  createGenre,
  deleteGenre,
  genreDetails,
  genreSeries,
  genreSeriesSeason,
  getGenre,
  updateGenre,
} from "../controllers/genre.controller";
import { authenticated } from "../middlewares/Authentication";
const router = Router();

/** GET ROUTES */
router.get("/", getGenre);
router.get("/:id", authenticated, genreDetails);
router.get("/:id/series", genreSeries);
router.get("/:id/series/seasons", genreSeriesSeason);

/** POST ROUTES */
router.post("/create", authenticated, createGenre);

/** PATCH ROUTES */
router.patch("/:id", authenticated, updateGenre);

/** DELETE ROUTES */
router.delete("/:id", authenticated, deleteGenre);

export const GenreRouter = router;
