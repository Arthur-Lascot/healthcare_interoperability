import app from "./app";
import { initDb } from "./db";

const PORT = process.env.PORT || 3002;

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
