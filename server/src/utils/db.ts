import mongoose from "mongoose";
import logger from "./logger";

const uri = process.env.MONGO_URI!;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(uri);
    return connection;
  } catch (error: any) {
    logger.error(`DB connection failed due to ${error.message || error}`);
    return null;
  }
};

export default connectDB;
