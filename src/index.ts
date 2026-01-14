import express, { Express } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

import postRoute from "./routes/postRoute";
import commentRoute from "./routes/commentRoute";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";

import dotenv from "dotenv";
dotenv.config({path: '.env.dev'});

const app = express();
app.use(express.json());
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const initApp = () => {
  const pr = new Promise<Express>((resolve, reject) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      reject("DATABASE_URL is not defined");
      return;
    }
    mongoose.connect(dbUrl, {})
    .then(() => {
      resolve(app)}
    );
  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to Database"));
  
});
  return pr;
}

export default initApp;