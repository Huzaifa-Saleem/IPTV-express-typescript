import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import SwaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
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
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("./src/assets"));

// // Swagger
const swaggerOptions = {
  definition: {
    openApi: "3.0.1",
    info: {
      title: "IPTV",
      version: "1.3.0",
      description: "iptv swagger documentation...",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
        },
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  schemas: "http",
  apis: ["./src/controllers/*"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));
// app.use("/api-doc", SwaggerUI.serve, SwaggerUI.setup(swaggerData));

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
