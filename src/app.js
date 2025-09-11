import express from "express";

const app = express();

app.get('/',(_,res)=>{
    res.send("Welcome to HomePage ✅")
})

export default app;
