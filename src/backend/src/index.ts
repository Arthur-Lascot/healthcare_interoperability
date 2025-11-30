import app from "./app";
import logger from "./logger/logger";

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
      logger.info(`✅ Serveur sur http://localhost:${PORT}`);
})

