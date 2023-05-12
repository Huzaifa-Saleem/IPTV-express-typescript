import { NextFunction, Request, Response } from "express";
import passwordHash from "password-hash";
import { Stream, User, UserSchemaType } from "../models";
import ErrorHandler from "../middlewares/ErrorHandler";
import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_SECRET } from "../config/Constants.env";
import { UserServices } from "../services";
import { httpResponse } from "../util/httpRespoonse";

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
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.getAll();
    httpResponse.SUCCESS(res, user, "Users Retrieve Successfully...!");
  } catch (error) {
    httpResponse.INTERNAL_SERVER_ERROR(res, {}, "Internel Server Error...!");
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
export const userDetails = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.getUserDetails(req.params.id);
    httpResponse.SUCCESS(
      res,
      { user },
      "User Details Retrieve Succesfully...!"
    );
  } catch (error) {
    httpResponse.BAD_REQUEST(res, "User Doesn't Exist...!");
  }
};

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     parameters:
 *       - in: formData
 *         name: firstname
 *       - in: formData
 *         name: lastname
 *       - in: formData
 *         name: email
 *       - in: formData
 *         name: password
 *     tags:
 *       - user
 *     requestBodies:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               email: johndoe@example.com
 *               password: password123
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json: {}
 *       '400':
 *         description: Bad Request. The request is invalid or malformed.
 *       '500':
 *         description: Internal Server Error. The server encountered an unexpected condition that prevented it from fulfilling the request.
 */
/** POST: REGISTER USER */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = UserServices.registerUser(req.body);
    httpResponse.CREATED(res, user, "User Register Successfully...!");
  } catch (error) {
    httpResponse.BAD_REQUEST(res, {}, String(error));
  }
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - user
 *     summary: Login user
 *     parameters:
 *       - in: formData
 *         name: email
 *       - in: formData
 *         name: password
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginSchema'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       '400':
 *         description: Bad Request. The request is invalid or malformed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid email or password
 */
/** POST: LOGIN USER */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.loginUser(req.body);
    httpResponse.SUCCESS(res, user, "Logged In Succesfully...!");
  } catch (error: any) {
    httpResponse.BAD_REQUEST(res, error);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Register a new user
 *     parameters:
 *       - in: formData
 *         name: firstname
 *       - in: formData
 *         name: lastname
 *       - in: formData
 *         name: email
 *       - in: formData
 *         name: password
 *       - in: path
 *         name: id
 *     tags:
 *       - user
 *     requestBodies:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               email: johndoe@example.com
 *               password: password123
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json: {}
 *       '400':
 *         description: Bad Request. The request is invalid or malformed.
 *       '500':
 *         description: Internal Server Error. The server encountered an unexpected condition that prevented it from fulfilling the request.
 */
/** PATCH: UPDATE USER */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await UserServices.updateUser(req.body, req.params.id);
    httpResponse.SUCCESS(res, { updatedUser }, "User Updated Successfully...!");
  } catch (error) {
    httpResponse.NOT_FOUND(res, {}, String(error));
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
