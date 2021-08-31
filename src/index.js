const express = require("express");
const app = express();
const morgan = require("morgan");
const globalRouter = require("./routes/global");
const videoRouter = require("./routes/video");
const usersRouter = require("./routes/users");
const path = require("path");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/video", videoRouter);
app.set("view engine", "pug");
app.set("views", path.join("src", "views"));

module.exports = app;
