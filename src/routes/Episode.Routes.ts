import { Router } from "express";

import { upload } from "../middlewares/upload";
import {
  createEpisode,
  deleteEpisode,
  episodeDetails,
  getEpisode,
  episodeStreams,
  updateEpisode,
} from "../controllers/episode.controller";

const router = Router();

/** GET ROUTES */
router.get("/", getEpisode);
router.get("/:id", episodeDetails);
router.get("/:id/streams", episodeStreams);

/** POST ROUTES */
router.post("/create", upload.single("image"), createEpisode);

/** PATCH ROUTES */
router.patch("/:id", upload.single("image"), updateEpisode);

/** DELETE ROUTES */
router.delete("/:id", deleteEpisode);

export const EpisodeRouter = router;
