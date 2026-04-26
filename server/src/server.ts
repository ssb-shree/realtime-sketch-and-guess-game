import app from "./app";
import connectDB from "./utils/db";
import logger from "./utils/logger";

import { server } from "./socket";

const port = process.env.PORT!;

const startServer = async () => {
  // const db = await connectDB(); - db is not needed
  server.listen(port, () => logger.info(`Server is running at ${port}`));
};

startServer();
