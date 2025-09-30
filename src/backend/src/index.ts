import app from "./app";
import { initDb } from "./db";

const PORT = process.env.BACKEND_PORT;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
