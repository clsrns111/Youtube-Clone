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

app.use(morgan("dev"));

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
app.set("view engine", "pug");
app.set("views", path.join("src", "views"));

module.exports = app;
