import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const myusername = process.env.USER_NAME;
const db = process.env.DB;

console.log("Start of the project ✅");
console.log("env username:", myusername);
console.log("env db:", db);
