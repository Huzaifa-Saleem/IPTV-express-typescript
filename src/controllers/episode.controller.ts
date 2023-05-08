import { NextFunction, Request, Response } from "express";
import { Genre, Episode, EpisodeSchemaType, Season, Stream } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";

/** GET: EPISODES */
export const getEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit: number = Number(req.query.limit) || 10;
    const page: number = Number(req.query.page) || 1;
    const episode = await Episode.find()
      .skip(limit * (page - 1))
      .limit(limit);

    const total = await Episode.countDocuments();
    res
      .status(200)
      .json({ response: "OK", data: episode, totalEpisode: total });
  } catch (error) {
    next(error);
  }
};

/** GET: EPISODES DETAILS */
export const episodeDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Episode.findOne({ _id: id })
      .populate("season_id")
      .exec()
      .then((episode) => {
        if (episode) {
          res.status(200).json({ episode });
        } else {
          res
            .status(404)
            .json({ message: "No episode existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No episode existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

/** POST: CREATE EPISODES */
export const createEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: EpisodeSchemaType = req.body;
    const image = req.file;
    if (!image) throw new ErrorHandler("image is required...!", 400);

    const fileLink = `${req.protocol}://${req.get("host")}/public/${
      image.filename
    }`;

    const episodeExist = await Episode.find({ name: data.name });
    if (episodeExist.length > 0)
      throw new ErrorHandler("Episode already exist...!", 400);

    await Season.findById(data.season_id).catch(() => {
      throw new ErrorHandler("Season doesn't exist...!", 400);
    });

    await Episode.create({
      name: data.name,
      description: data.description,
      image: fileLink,
      season_id: data.season_id,
    }).then((episode) => {
      res.status(201).json({ episode });
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH: UPDATE EPISODES */
export const updateEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const data: EpisodeSchemaType = req.body;
    const image = req.file;

    const episodeExist = await Episode.find({ name: data.name });
    if (episodeExist.length > 0)
      throw new ErrorHandler("Episode name already exist...!", 400);

    await Season.findById(data.season_id).catch(() => {
      throw new ErrorHandler("Season doesn't exist...!", 400);
    });

    await Episode.findById(id).catch((err) => {
      throw new ErrorHandler("Episode doesn't exist...!", 400);
    });

    const updatedData = {
      name: data.name,
      description: data.description,
      image: req.file?.filename,
      season_id: data.season_id,
    };
    if (image) {
      updatedData.image = `${req.protocol}://${req.get("host")}/public/${
        image.filename
      }`;
    }

    await Episode.findByIdAndUpdate(id, updatedData, { new: true })
      .then((episode) => {
        if (episode) {
          res
            .status(201)
            .json({ episode, message: "Episode Updated Succesfully...!" });
        } else res.status(404).json({ message: "Episode doesn't exist...!" });
      })
      .catch(() => {
        throw new ErrorHandler("Episode doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** DELETE: EPISODES */
export const deleteEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Episode.findByIdAndDelete(id)
      .then((episode) => {
        if (episode)
          res.status(200).json({ message: "Deleted Successfully...!" });
        else res.status(400).json({ message: "Episode Doesn't exist...!" });
      })
      .catch((err) => {
        throw new ErrorHandler("Episode Doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** GET: EPISODES DETAILS */
export const episodeStreams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Episode.findOne({ _id: id })
      .then((episode) => {
        if (episode) {
          Stream.find({ episode_id: episode._id })
            .then((stream) => {
              return res.status(200).json({ response: "OK", data: stream });
            })
            .catch(() => {
              return res
                .status(404)
                .json({ message: "this Episode doesn't have any stream" });
            });
        } else {
          res
            .status(404)
            .json({ message: "No episode existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No episode existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};
