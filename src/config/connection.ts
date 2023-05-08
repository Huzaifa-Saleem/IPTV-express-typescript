import mongoose from "mongoose";
import { MONGO_URI } from "./Constants.env";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

export const ConnectDB = async () => {
  await mongoose
    .connect(MONGO_URI, options)
    .then(() => {
      console.log("MONGODB connected...!");
    })
    .catch((err) => {
      console.log("Connection Error: " + err);
    });
};
