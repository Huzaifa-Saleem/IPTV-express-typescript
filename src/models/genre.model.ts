import mongoose, { Document, Schema } from "mongoose";

export interface GenreSchemaType extends Document {
  name: string;
}

const GenreSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Name is Required...!"],
    },
  },
  { timestamps: true }
);

export const Genre = mongoose.model<GenreSchemaType>("Genre", GenreSchema);
