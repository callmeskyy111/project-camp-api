import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("🔴 ERR: MongoDB Connection Error - ", err);
    process.exit(1);
  }
}
