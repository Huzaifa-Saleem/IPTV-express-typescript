import { NextFunction, Request, Response } from "express";
import passwordHash from "password-hash";
import { Stream, User, UserSchemaType } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";
import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_SECRET } from "../config/Constants.env";

/** GET: USER */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

/** GET: USER DETAILS */
export const userDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await User.findOne({ _id: id })
      .then((user) => {
        if (user) {
          const { password, ...data } = user.toJSON();
          res.status(200).json({ data });
        } else {
          res.status(404).json({ message: "No User existed with this id...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("No User existed with this id...!", 404);
      });
  } catch (error) {
    next(error);
  }
};

/** POST: REGISTER USER */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: UserSchemaType = req.body;
    const hashedPass = passwordHash.generate(data.password);

    const userExit = await User.find({ email: data.email });
    if (userExit.length > 0)
      throw new ErrorHandler("User already exist...!", 400);

    await User.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPass,
    }).then((user) => {
      const { password, ...tokenData } = data;
      const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: JWT_EXPIRE });
      res.status(201).json({ user, token });
    });
  } catch (error) {
    next(error);
  }
};

/** POST: LOGIN USER */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });
    if (!user) throw new ErrorHandler("Invalid email and password...!", 401);

    const { password, ...restData } = user.toJSON();
    const isMatched: boolean = passwordHash.verify(data.password, password);
    if (!isMatched)
      throw new ErrorHandler("Invalid email and password...!", 401);
    const token = jwt.sign(restData, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    res.status(200).json({ user: restData, token });
  } catch (error) {
    next(error);
  }
};

/** PATCH: UPDATE USER */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: any = req.body;
    const { id } = req.params;

    const userExit = await User.findById(id);
    if (!userExit) throw new ErrorHandler("User doesn't exist...!", 400);

    await User.findByIdAndUpdate(id, data, { new: true })
      .then((user) => {
        if (user) {
          const { password, ...restData } = user.toJSON();
          res
            .status(201)
            .json({ restData, message: "User Updated Succesfully...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("User doesn't exist...!", 400);
      });
  } catch (error) {
    next(error);
  }
};

/** DELETE: USER */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const deleted = await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Deleted Successfully...!" });
  } catch (error) {
    next(error);
  }
};

/** GET: USER STREAMS */
export const userStreams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    await User.findById(id).catch(() => {
      res.status(404).json({ message: "No User existed with this id...!" });
    });

    await Stream.find({ user_id: id })
      .then((stream) => {
        if (stream.length > 0) {
          res.status(200).json({ data: stream });
        } else {
          res.status(404).json({ message: "User doesn't have any stream...!" });
        }
      })
      .catch(() => {
        throw new ErrorHandler("User doesn't have any stream...!", 404);
      });
  } catch (error) {
    next("Cannot find any Stream...!");
  }
};

/** GET: USER STREAM WITH STREAM AND USER ID*/
export const userStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, streamId } = req.params;

    await User.findById(id).catch(() => {
      return res
        .status(404)
        .json({ message: "No User existed with this id...!" });
    });

    await Stream.findById(streamId)
      .then((stream) => {
        if (!stream)
          return res
            .status(404)
            .json({ message: "Cannot find any Stream...!" });
        if (stream?.user_id !== id)
          throw new ErrorHandler("User doesn't have this stream...!", 404);

        return res.status(200).json({ data: stream });
      })
      .catch(() => {
        throw new ErrorHandler("User doesn't have this stream...!", 404);
      });
  } catch (error) {
    return res.status(404).json({ message: "Cannot find any Stream...!" });
  }
};

/** DELETE: USER STREAM WITH STREAM AND USER ID*/
export const deleteUserStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, streamId } = req.params;

    await User.findById(id).catch(() => {
      return res
        .status(404)
        .json({ message: "No User existed with this id...!" });
    });

    await Stream.findById(streamId)
      .then((stream) => {
        if (!stream)
          res
            .status(404)
            .json({ message: "No Stream existed with this id...!" });
      })
      .catch(() => {
        return res
          .status(404)
          .json({ message: "No Stream existed with this id...!" });
      });

    await Stream.findOneAndDelete({ _id: streamId, user_id: id })
      .then((stream) => {
        return res
          .status(200)
          .json({ response: "OK", message: "Stream Deleted Succesfully...!" });
      })
      .catch(() => {
        return new ErrorHandler("User doesn't have this stream...!", 404);
      });
  } catch (error) {
    next(error);
  }
};
