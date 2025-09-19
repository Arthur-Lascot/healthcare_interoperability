import express from "express";
import routes from "./routes/files.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`✅ Serveur sur http://localhost:${PORT}`);
});
