import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connectDB.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

// start the server only upon successful MongoDB Connection ☑️
connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`🟢 Server running on PORT - http://localhost:${PORT} ✅`);
    })
  )
  .catch((err) => {
    console.error("🔴 MongoDB Connection Error: ", err);
    process.exit(1);
  });
