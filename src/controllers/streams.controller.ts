import { NextFunction, Request, Response } from "express";
import { Episode, Genre, Season, Series, Stream, User } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";

/** GET: STREAMS */
/**
 * @swagger
 * /streams:
 *   get:
 *     tag: stream
 *     summary: Get all streams
 *     description: Returns a list of all streams
 *     tags:
 *       - stream
 *     responses:
 *       '200':
 *         description: A list of streams
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 */
export const getStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stream = await Stream.find();
    res.status(200).json({ stream });
  } catch (error) {
    next(error);
  }
};

/** GET: STREAMS DETAILS */
export const streamDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Stream.findById({ _id: id })
      .populate(["episode_id", "user_id"])
      .exec()
      .then((stream) => {
        if (stream) {
          res.status(200).json({ stream });
        } else {
          res
            .status(404)
            .json({ message: "No stream existed with this id...!" });
        }
      })
      .catch((err) => {
        throw new ErrorHandler(err, 404);
      });
  } catch (error) {
    next(error);
  }
};

/** POST: CREATE STREAMS */
export const createStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    await Episode.findById(data.episode_id).catch(() => {
      throw new ErrorHandler("Episode doesn't exist...!", 400);
    });
    await User.findById(data.user_id).catch(() => {
      throw new ErrorHandler("User doesn't exist...!", 400);
    });

    await Stream.create(data).then((stream) => {
      res.status(201).json({ stream });
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH: UPDATE STREAMS */
export const updateStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: any = req.body;
    const id = req.params.id;

    await Stream.findById(id).catch(() => {
      throw new ErrorHandler("Stream doesn't exist...!", 400);
    });

    await Episode.findById(data.episode_id).catch(() => {
      throw new ErrorHandler("Episode doesn't exist...!", 400);
    });
    await User.findById(data.user_id).catch(() => {
      throw new ErrorHandler("User doesn't exist...!", 400);
    });

    await Stream.findByIdAndUpdate(id, data, { new: true })
      .then((stream) => {
        if (stream) {
          res
            .status(201)
            .json({ stream, message: "Stream Updated Succesfully...!" });
        } else res.status(404).json({ message: "Stream doesn't exist...!" });
      })
      .catch(() => {
        throw new ErrorHandler("Stream doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** DELETE: STREAMS */
export const deleteStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Stream.findByIdAndDelete(id)
      .then((stream) => {
        if (stream)
          res.status(200).json({ message: "Deleted Successfully...!" });
        else res.status(400).json({ message: "Stream Doesn't exist...!" });
      })
      .catch(() => {
        throw new ErrorHandler("Stream Doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

export const streamsEpisodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Stream.findOne({ _id: id })
      .then((stream) => {
        if (stream) {
          Episode.find({ _id: stream.episode_id })
            .then((episode) => {
              return res.status(200).json({ response: "OK", data: episode });
            })
            .catch(() => {
              return res
                .status(404)
                .json({ message: "this stream doesn't have any episode" });
            });
        } else {
          res
            .status(404)
            .json({ message: "No stream existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No stream existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

export const streamsUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Stream.findOne({ _id: id })
      .then((stream) => {
        if (stream) {
          User.find({ _id: stream.user_id })
            .then((user) => {
              return res.status(200).json({ response: "OK", data: user });
            })
            .catch(() => {
              return res
                .status(404)
                .json({ message: "this stream doesn't have any user" });
            });
        } else {
          res
            .status(404)
            .json({ message: "No stream existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No stream existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

export const streamsEpisodesSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Stream.findOne({ _id: id })
      .then((stream) => {
        if (stream) {
          Episode.findOne({ _id: stream.episode_id })
            .then((episode) => {
              if (episode) {
                Season.findById(episode.season_id)
                  .then((season) => {
                    return res
                      .status(200)
                      .json({ response: "OK", data: season });
                  })
                  .catch((err) => next(err));
              }
            })
            .catch(() => {
              return res
                .status(404)
                .json({ message: "this stream doesn't have any episode" });
            });
        } else {
          res
            .status(404)
            .json({ message: "No stream existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No stream existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

export const streamsEpisodesSeasonSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Stream.findOne({ _id: id })
      .then((stream) => {
        if (stream) {
          Episode.findOne({ _id: stream.episode_id })
            .then((episode) => {
              if (episode) {
                Season.findById(episode.season_id)
                  .then((season) => {
                    if (season) {
                      Series.findById(season.series_id)
                        .then((series) => {
                          return res
                            .status(200)
                            .json({ response: "OK", data: series });
                        })
                        .catch((err) => next(err));
                    }
                  })
                  .catch((err) => next(err));
              }
            })
            .catch(() => {
              return res
                .status(404)
                .json({ message: "this stream doesn't have any series" });
            });
        } else {
          res
            .status(404)
            .json({ message: "No stream existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No stream existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};
export const streamsEpisodesSeasonSeriesGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Stream.findOne({ _id: id })
      .then((stream) => {
        if (stream) {
          Episode.findOne({ _id: stream.episode_id })
            .then((episode) => {
              if (episode) {
                Season.findById(episode.season_id)
                  .then((season) => {
                    if (season) {
                      Series.findById(season.series_id)
                        .then((series) => {
                          if (series) {
                            Genre.findById(series.genre_id)
                              .then((genre) => {
                                return res
                                  .status(200)
                                  .json({ response: "OK", data: genre });
                              })
                              .catch((err) => next(err));
                          }
                        })
                        .catch((err) => next(err));
                    }
                  })
                  .catch((err) => next(err));
              }
            })
            .catch(() => {
              return res
                .status(404)
                .json({ message: "this stream doesn't have any genre" });
            });
        } else {
          res
            .status(404)
            .json({ message: "No stream existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No stream existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};
