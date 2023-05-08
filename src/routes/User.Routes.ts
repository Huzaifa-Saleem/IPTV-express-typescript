import { Router } from "express";
import {
  deleteUser,
  getUser,
  loginUser,
  registerUser,
  updateUser,
  userStreams,
  userStream,
  userDetails,
  deleteUserStream,
} from "../controllers/User.controller";
const router = Router();

/** GET ROUTES */
router.get("/", getUser);
router.get("/:id", userDetails);
router.get("/:id/streams", userStreams);
router.get("/:id/streams/:streamId", userStream);

/** POST ROUTES */
router.post("/register", registerUser);
router.post("/login", loginUser);

/** PATCH ROUTES */
router.patch("/:id", updateUser);

/** DELETE ROUTES */
router.delete("/:id", deleteUser);
router.delete("/:id/streams/:streamId", deleteUserStream);

export const UserRouter = router;
