import express from "express";
import file_routes from "./routes/files.routes";
import { authMiddleware } from "./middlewares/auth_handler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//app.use("/api", user_routes);
app.use(authMiddleware);
app.use("/api", file_routes);   

app.listen(PORT, () => {
  console.log(`✅ Serveur sur http://localhost:${PORT}`);
});
