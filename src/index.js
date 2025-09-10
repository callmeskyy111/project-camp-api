import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("<h1>Hello Project Camp API ✅</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT - http://localhost:${PORT} ✅`);
});
