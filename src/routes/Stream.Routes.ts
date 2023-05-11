import { Router } from "express";
import {
  createStream,
  deleteStream,
  getStream,
  streamDetails,
  streamsEpisodes,
  streamsEpisodesSeason,
  streamsEpisodesSeasonSeries,
  streamsEpisodesSeasonSeriesGenre,
  streamsUser,
  updateStream,
} from "../controllers/streams.controller";

const router = Router();

/** GET ROUTES */
router.get("/", getStream);
router.get("/:id", streamDetails);
router.get("/:id/episode", streamsEpisodes);
router.get("/:id/user", streamsUser);
router.get("/:id/episode/season", streamsEpisodesSeason);
router.get("/:id/episode/season/series", streamsEpisodesSeasonSeries);
router.get(
  "/:id/episode/season/series/genre",
  streamsEpisodesSeasonSeriesGenre
);

/** POST ROUTES */
router.post("/create", createStream);

/** PATCH ROUTES */
router.patch("/:id", updateStream);

/** DELETE ROUTES */
router.delete("/:id", deleteStream);

export const StreamRouter = router;
