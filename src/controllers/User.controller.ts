import { NextFunction, Request, Response } from "express";
import passwordHash from "password-hash";
import { Stream, User, UserSchemaType } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";
import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_SECRET } from "../config/Constants.env";

/**
 * @swagger
 * /users:
 *   get:
 *     tag: User
 *     summary: Get all users
 *     description: Returns a list of all users
 *     tags:
 *       - user
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 */
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tag: User
 *     summary: Get user details
 *     description: Returns a object of the user
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 64536396d05f4ee511d8e44a
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve.
 *     tags:
 *       - user
 *     responses:
 *       '200':
 *         description: A object of user
 *         content:
 *           application/json:
 *               type: object
 */
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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details
 *     tags:
 *       - user
 *     requestBody:
 *       description: User object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tag: User
 *     summary: Get user details
 *     description: Returns a object of the user
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 6458bd7696aeec9d9f0beafa
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve.
 *     tags:
 *       - user
 *     responses:
 *       '200':
 *         description: A object of user
 *         content:
 *           application/json:
 *               type: object
 */
/** DELETE: USER */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    await User.findById(id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User doesn't exist...!" });
        }
      })
      .catch(() => {
        return res.status(404).json({ message: "User doesn't exist...!" });
      });

    const deleted = await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Deleted Successfully...!" });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /users/{id}/streams:
 *   get:
 *     tag: User
 *     summary: Get user streams
 *     description: Returns a array of the user streams
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 64536396d05f4ee511d8e44a
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve.
 *     tags:
 *       - user
 *     responses:
 *       '200':
 *         description: A object of user
 *         content:
 *           application/json:
 *               type: array
 */
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

/**
 * @swagger
 * /users/{id}/streams/{streamId}:
 *   get:
 *     tag: User
 *     summary: Get user details
 *     description: Returns a object of the user
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 64536396d05f4ee511d8e44a
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve the stream.
 *       - in: path
 *         name: streamId
 *         example: 6458904b6e4d0c6eba4c7556
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the stream to retrieve.
 *     tags:
 *       - user
 *     responses:
 *       '200':
 *         description: A object of user
 *         content:
 *           application/json:
 *               type: object
 */
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
        console.log(stream);
        if (!stream)
          return res
            .status(404)
            .json({ message: "Cannot find any Stream...!" });
        if (stream!.user_id != id)
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

/**
 * @swagger
 * /users/{id}/streams/{streamId}:
 *   delete:
 *     tag: User
 *     summary: Get user details
 *     description: Returns a object of the user
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 64536396d05f4ee511d8e44a
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve.
 *       - in: path
 *         name: streamId
 *         example: 6458b8e7450f10118ef4d7a6
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve.
 *     tags:
 *       - user
 *     responses:
 *       '200':
 *         description: A object of user
 *         content:
 *           application/json:
 *               type: object
 */
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
