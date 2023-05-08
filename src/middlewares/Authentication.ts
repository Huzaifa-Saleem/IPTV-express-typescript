import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/Constants.env";
import { User } from "../models";

interface genre {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) res.status(401).json({ message: "Authorization required...!" });
    if (token) {
      const decodedtoken = jwt.verify(token, JWT_SECRET);
      if (
        typeof decodedtoken === "object" &&
        decodedtoken !== null &&
        "_id" in decodedtoken
      ) {
        await User.findById(decodedtoken._id)
          .then((user) => {
            next();
          })
          .catch((err) => {
            res
              .status(401)
              .json({ message: "token is invalid or expired...!" });
          });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "token is invalid or expired...!" });
  }
};
