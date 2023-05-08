import { NextFunction, Request, Response } from "express";
import { Genre, Season, Series } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";

/** GET: GENRE */
export const getGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const genre = await Genre.find();
    res.status(200).json({ genre });
  } catch (error) {
    next(error);
  }
};

/** GET: GENRE DETAILS */
export const genreDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Genre.findOne({ _id: id })
      .then((genre) => {
        if (genre) {
          res.status(200).json({ genre });
        } else {
          res
            .status(404)
            .json({ message: "No genre existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No genre existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

/** POST: CREATE GENRE */
export const createGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const genreExist = await Genre.find({ name: data.name });
    if (genreExist.length > 0)
      throw new ErrorHandler("Genre already exist...!", 400);

    await Genre.create({
      name: data.name,
    }).then((genre) => {
      res.status(201).json({ genre });
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH: UPDATE GENRE */
export const updateGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: any = req.body;
    const id = req.params.id;

    await Genre.findById(id).catch(() => {
      throw new ErrorHandler("Genre doesn't exist...!", 400);
    });

    await Genre.findByIdAndUpdate(id, data, { new: true })
      .then((genre) => {
        if (genre) {
          res
            .status(201)
            .json({ genre, message: "Genre Updated Succesfully...!" });
        } else res.status(404).json({ message: "Genre doesn't exist...!" });
      })
      .catch(() => {
        throw new ErrorHandler("Genre doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** DELETE: GENRE */
export const deleteGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Genre.findByIdAndDelete(id)
      .then(() => {
        res.status(200).json({ message: "Deleted Successfully...!" });
      })
      .catch((err) => {
        throw new ErrorHandler("Genre Doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

export const genreSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    await Genre.findById(id).catch(() => {
      return res
        .status(404)
        .json({ message: "No Genre existed with this id...!" });
    });

    await Series.find({ genre_id: id })
      .then((series) => {
        if (series.length > 0) {
          return res.status(200).json({ data: series });
        } else {
          return res
            .status(404)
            .json({ message: "This genre doesn't have any series...!" });
        }
      })
      .catch(() => {
        return new ErrorHandler("This genre doesn't have any series...!", 404);
      });
  } catch (error) {
    return next("Cannot find any series...!");
  }
};

export const genreSeriesSeason = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    await Genre.findById(id).catch(() => {
      return res
        .status(404)
        .json({ message: "No Genre existed with this id...!" });
    });

    await Series.find({ genre_id: id })
      .then((series) => {
        if (series.length > 0) {
          const seriesIds = series.map((se) => se._id);

          Season.find({ series_id: seriesIds })
            .then((season) => {
              return res.status(200).json({ data: season });
            })
            .catch((err) => {
              return res
                .status(404)
                .json({ message: "This genre doesn't have any seasons...!" });
            });
        } else {
          return res
            .status(404)
            .json({ message: "This genre doesn't have any seasons...!" });
        }
      })
      .catch(() => {
        return new ErrorHandler("This genre doesn't have any series...!", 404);
      });
  } catch (error) {
    return next("Cannot find any series...!");
  }
};
