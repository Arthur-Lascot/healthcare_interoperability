import app from "./app";
import { initDb } from "./db";
import logger from "./logger";

const PORT = process.env.BACKEND_PORT;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`✅ Serveur sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
