import app from "./app";
import connectDB from "./utils/db";
import logger from "./utils/logger";

const port = process.env.PORT!;

const startServer = async () => {
  const db = await connectDB();

  if (db) {
    app.listen(port, () => logger.info(`Server is running at ${port}, DB connected to host ${db.connection.host}`));
  } else {
    logger.fatal("Shutting down the server, due to failure in DB connection");
    process.exit(1);
  }
};

startServer();
