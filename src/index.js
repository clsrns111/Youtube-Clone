const express = require("express");
const app = express();
const morgan = require("morgan");
const globalRouter = require("./routes/global");
const videoRouter = require("./routes/video");
const usersRouter = require("./routes/users");
const path = require("path");
const session = require("express-session");
const { middleware } = require("./middleware");
const MongoDb = require("connect-mongo");
const apiRouter = require("./routes/apiRouter");
const fs = require("fs");

app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/assets", express.static("node_modules/@ffmpeg/core/dist"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoDb.create({
      mongoUrl: `mongodb+srv://clsrns111:${process.env.MONGODB_PASSWORD}@cluster0.vqh13.mongodb.net/youtube?retryWrites=true&w=majority`,
    }),
  })
);

app.use(middleware);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/video", videoRouter);
app.use("/api", apiRouter);
app.set("view engine", "pug");
app.set("views", path.join("src", "views"));

module.exports = app;
