import express from "express";
import "dotenv/config";
import cors from "cors";
import logRoute from "./middlewares/logRoute.js";
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import mongoose from "mongoose";
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import bodyParser from "body-parser";
import HttpError from "./models/http-error.js";
import fs from 'fs';
import path from "path";

const app = express();

app.use(logRoute);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('src/uploads/images', express.static(path.join('src', 'uploads', 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  next();
});
app.use("/auth", authRoutes);
app.use("/pet", petRoutes);
app.use("/users", usersRoutes);
app.use(petRoutes)

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unkwon error occured!" });
});


mongoose
  .connect(
"mongodb+srv://garman123:garman123@petapp.pfmn4.mongodb.net/PetsFullStack?retryWrites=true&w=majority")
  .then(() => {
    app.listen(process.env.PORT, () => {});
    console.log(`Pet Adoption Server is working on ${process.env.PORT}`);
  }).catch(err => {
    console.log(err)
  });

