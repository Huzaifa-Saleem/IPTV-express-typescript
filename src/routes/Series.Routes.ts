import { Router } from "express";
import {
  createSeries,
  deleteSeries,
  getSeries,
  seriesDetails,
  seriesSeasons,
  updateSeries,
  getSeriesEpisodes,
} from "../controllers/series.controller";

const router = Router();

/** GET ROUTES */
router.get("/", getSeries);
router.get("/:id", seriesDetails);
router.get("/:id/seasons", seriesSeasons);
router.get("/:id/seasons/episodes", getSeriesEpisodes);

/** POST ROUTES */
router.post("/create", createSeries);

/** PATCH ROUTES */
router.patch("/:id", updateSeries);

/** DELETE ROUTES */
router.delete("/:id", deleteSeries);

export const SeriesRouter = router;
