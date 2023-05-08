import { Router } from "express";
import {
  createSeason,
  deleteSeason,
  getSeason,
  seasonDetails,
  updateSeason,
  seasonEpisodes,
} from "../controllers/season.controller";

const router = Router();

/** GET ROUTES */
router.get("/", getSeason);
router.get("/:id", seasonDetails);
router.get("/:id/episodes", seasonEpisodes);

/** POST ROUTES */
router.post("/create", createSeason);

/** PATCH ROUTES */
router.patch("/:id", updateSeason);

/** DELETE ROUTES */
router.delete("/:id", deleteSeason);

export const SeasonRouter = router;
