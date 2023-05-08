import mongoose, { Document, Schema } from "mongoose";

export interface StreamSchemaType extends Document {
  user_id: string;
  episode_id: string;
}

const StreamSchema: Schema = new mongoose.Schema(
  {
    episode_id: {
      type: mongoose.Types.ObjectId,
      ref: "Episode",
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Stream = mongoose.model<StreamSchemaType>("Stream", StreamSchema);
