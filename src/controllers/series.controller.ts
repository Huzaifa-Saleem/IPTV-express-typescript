import { NextFunction, Request, Response } from "express";
import { Episode, Genre, Season, Series } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";

/** GET: SERIES */
/**
 * @swagger
 * /series:
 *   get:
 *     tag: series
 *     summary: Get all series
 *     description: Returns a list of all series
 *     tags:
 *       - series
 *     responses:
 *       '200':
 *         description: A list of series
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 */
export const getSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const series = await Series.find();
    res.status(200).json({ series });
  } catch (error) {
    next(error);
  }
};

/** GET: SERIES DETAILS */
export const seriesDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Series.findOne({ _id: id })
      .populate("genre_id")
      .exec()
      .then((series) => {
        if (series) {
          res.status(200).json({ series });
        } else {
          res
            .status(404)
            .json({ message: "No series existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No series existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

/** POST: CREATE SERIES */
export const createSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const seriesExist = await Series.find({ name: data.name });
    if (seriesExist.length > 0)
      throw new ErrorHandler("Series already exist...!", 400);

    await Series.create(data).then((series) => {
      res.status(201).json({ series });
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH: UPDATE SERIES */
export const updateSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: any = req.body;
    const id = req.params.id;

    console.log({ genre: data.genre_id });
    await Genre.findById(data.genre_id).catch((err) => {
      throw new ErrorHandler("Genre doesn't exist...!", 400);
    });

    await Series.findById(id).catch((err) => {
      throw new ErrorHandler("Series doesn't exist...!", 400);
    });

    await Series.findByIdAndUpdate(id, data, { new: true })
      .then((series) => {
        if (series) {
          res
            .status(201)
            .json({ series, message: "Series Updated Succesfully...!" });
        } else res.status(404).json({ message: "Series doesn't exist...!" });
      })
      .catch(() => {
        throw new ErrorHandler("Series doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** DELETE: SERIES */
export const deleteSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Series.findByIdAndDelete(id)
      .then(() => {
        res.status(200).json({ message: "Deleted Successfully...!" });
      })
      .catch((err) => {
        throw new ErrorHandler("Series Doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** GET: SERIES SEASONS */
export const seriesSeasons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Series.findOne({ _id: id })
      .then((series) => {
        if (series) {
          Season.find({ series_id: series._id })
            .then((season) => {
              return res.status(200).json({ response: "OK", data: season });
            })
            .catch(() =>
              res
                .status(404)
                .json({ message: "this series doesn't have any seasons...!" })
            );
        } else {
          res
            .status(404)
            .json({ message: "No series existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No series existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

/** GET: SERIES SEASONS */
export const getSeriesEpisodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Series.findOne({ _id: id })
      .then((series) => {
        if (series) {
          Season.find({ series_id: series._id })
            .then((season) => {
              const seasonIds = season.map((seas) => seas._id);

              Episode.find({ season_id: seasonIds })
                .then((episodes) => {
                  return res
                    .status(200)
                    .json({ response: "OK", data: episodes });
                })
                .catch(() => {
                  return res.status(404).json({
                    message: "this season doesn't have any episodes...!",
                  });
                });
            })
            .catch(() =>
              res
                .status(404)
                .json({ message: "this series doesn't have any seasons...!" })
            );
        } else {
          res
            .status(404)
            .json({ message: "No series existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No series existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};
