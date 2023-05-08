import { NextFunction, Request, Response } from "express";
import { Series, Season, Genre, Episode } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";

/** GET: SEASONS */
export const getSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const season = await Season.find();
    res.status(200).json({ season });
  } catch (error) {
    next(error);
  }
};

/** GET: SEASONS DETAILS */
export const seasonDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Season.findOne({ _id: id })
      .populate("series_id")
      .exec()
      .then((season) => {
        if (season) {
          res.status(200).json({ season });
        } else {
          res
            .status(404)
            .json({ message: "No season existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No series existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

/** POST: CREATE SEASONS */
export const createSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const seriesExist = await Season.find({ name: data.name });
    if (seriesExist.length > 0)
      throw new ErrorHandler("Season already exist...!", 400);

    await Series.findById(data.series_id).catch((err) => {
      throw new ErrorHandler("Series doesn't exist...!", 400);
    });

    await Season.create(data).then((season) => {
      res.status(201).json({ season });
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH: UPDATE SEASONS */
export const updateSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: any = req.body;
    const id = req.params.id;

    await Genre.findById(data.genre_id).catch((err) => {
      throw new ErrorHandler("Genre doesn't exist...!", 400);
    });

    await Season.findById(id).catch((err) => {
      throw new ErrorHandler("Season doesn't exist...!", 400);
    });

    const seasonExist = await Season.find({ name: data.name });
    if (seasonExist.length > 0)
      throw new ErrorHandler("Season name already exist...!", 400);

    await Season.findByIdAndUpdate(id, data, { new: true })
      .then((season) => {
        if (season) {
          res
            .status(201)
            .json({ season, message: "Season Updated Succesfully...!" });
        } else res.status(404).json({ message: "Season doesn't exist...!" });
      })
      .catch(() => {
        throw new ErrorHandler("Season doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** DELETE: SEASONS */
export const deleteSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Season.findByIdAndDelete(id)
      .then(() => {
        res.status(200).json({ message: "Deleted Successfully...!" });
      })
      .catch((err) => {
        throw new ErrorHandler("Season Doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** GET: SEASONS DETAILS */
export const seasonEpisodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Season.findOne({ _id: id })
      .then((season) => {
        if (season) {
          Episode.find({ season_id: season._id })
            .then((episodes) => {
              return res.status(200).json({ response: "OK", data: episodes });
            })
            .catch(() => {
              return res
                .status(404)
                .json({ message: "this season doesn't have any episodes" });
            });
        } else {
          res
            .status(404)
            .json({ message: "No season existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No series existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};
