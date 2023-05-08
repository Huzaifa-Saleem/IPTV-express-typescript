import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
//
import * as middlewares from "./middlewares/middlewares";
import MessageResponse from "./interfaces/MessageResponse";
//
import {
  GenreRouter,
  UserRouter,
  SeriesRouter,
  SeasonRouter,
  EpisodeRouter,
  StreamRouter,
} from "./routes";

//
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/public", express.static("./src/assets"));

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Server is Working🌏",
  });
});

app.use("/users", UserRouter);
app.use("/genres", GenreRouter);
app.use("/series", SeriesRouter);
app.use("/seasons", SeasonRouter);
app.use("/episodes", EpisodeRouter);
app.use("/streams", StreamRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
