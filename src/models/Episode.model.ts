import mongoose, { Document, Schema, Types } from "mongoose";

export interface EpisodeSchemaType extends Document {
  season_id: Types.ObjectId;
  name: string;
  description: string;
  image: string;
}

const EpisodeSchema: Schema = new mongoose.Schema(
  {
    season_id: {
      type: mongoose.Types.ObjectId,
      ref: "Season",
    },
    name: {
      type: String,
      required: [true, "Name is Required...!"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "description is Required...!"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Episode = mongoose.model<EpisodeSchemaType>(
  "Episode",
  EpisodeSchema
);
