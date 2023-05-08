import mongoose, { Document, Schema, Types } from "mongoose";

export interface SeriesSchemaType extends Document {
  genre_id: Types.ObjectId;
  name: string;
  description: string;
  trailer: string;
}

const SeriesSchema: Schema = new mongoose.Schema(
  {
    genre_id: {
      type: mongoose.Types.ObjectId,
      ref: "Genre",
    },
    name: {
      type: String,
      required: [true, "Name is Required...!"],
    },
    description: {
      type: String,
      required: [true, "description is Required...!"],
    },
    trailer: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Series = mongoose.model<SeriesSchemaType>("Series", SeriesSchema);
