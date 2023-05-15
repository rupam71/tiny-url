import express from "express";
import cors from "cors";
import db from "./config/db";
import tinyUrl from "./route/tinyUrl";
import userDb from "./route/userDb";
import count from "./route/count";
require("dotenv").config();

db();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res
    .send({
      message: "Welcome to tiny url",
    })
    .status(200);
});

tinyUrl(app);
userDb(app);
count(app)

console.log("Hello world");

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Listening at port : ${PORT}`);
