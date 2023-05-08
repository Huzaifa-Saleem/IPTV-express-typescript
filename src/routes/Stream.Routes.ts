import { Router } from "express";
import { createStream, deleteStream, getStream, streamDetails, updateStream } from "../controllers/streams.controller";


const router = Router();

/** GET ROUTES */
router.get("/", getStream);
router.get("/:id", streamDetails);

/** POST ROUTES */
router.post("/create", createStream);

/** PATCH ROUTES */
router.patch("/:id", updateStream);

/** DELETE ROUTES */
router.delete("/:id", deleteStream);

export const StreamRouter = router;
