import app from "./app";

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`✅ Serveur sur http://localhost:${PORT}`);
});
