import Joi from "joi";
import mongoose, { Document, Schema } from "mongoose";

export interface UserSchemaType extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is Required...!"],
    },
    lastname: {
      type: String,
      required: [true, "lastname is Required...!"],
    },
    email: {
      type: String,
      required: [true, "Email is Required...!"],
      lowercase: true,
      unique: true,
      validate: {
        validator: (email: string) => {
          Joi.string().email().validate(email).error === undefined;
        },
      },
    },
    password: {
      type: String,
      minlength: [7, "Password Length is shorte than 7...!"],
      required: [true, "Password is Required...!"],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserSchemaType>("User", UserSchema);
