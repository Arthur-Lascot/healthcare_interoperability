import app from "./app";
import logger from "./logger/logger";
import client from "./config/postgresClient";
import { connectMongoDB } from "./config/mongodbClient";

const PORT = process.env.BACKEND_PORT;

const startServer = async () => {
  try {
    await client.connect();
    logger.info("✅ PostgreSQL connecté");
    await connectMongoDB();
    logger.info("✅ MongoDB connecté");

    app.listen(PORT, () => {
      logger.info(`✅ Serveur sur http://localhost:${PORT}`);
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error("Failed to start server: " + errorMessage);
    process.exit(1);
  }
};

startServer();

