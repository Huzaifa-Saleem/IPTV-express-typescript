import mongoose, { Document, Schema, Types } from "mongoose";

export interface SeasonSchemaType extends Document {
  series_id: Types.ObjectId;
  name: string;
  description: string;
}

const SeasonSchema: Schema = new mongoose.Schema(
  {
    series_id: {
      type: mongoose.Types.ObjectId,
      ref: "Series",
    },
    name: {
      type: String,
      required: [true, "Name is Required...!"],
    },
    description: {
      type: String,
      required: [true, "description is Required...!"],
    },
  },
  { timestamps: true }
);

export const Season = mongoose.model<SeasonSchemaType>("Season", SeasonSchema);
