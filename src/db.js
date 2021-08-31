const mongoose = require("mongoose");
const db = mongoose.connection;
require("dotenv").config();

mongoose.connect(
  `mongodb+srv://clsrns111:${process.env.MONGODB_PASSWORD}@cluster0.vqh13.mongodb.net/youtube?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

db.on("error", (err) => {
  console.log("DB Error", err);
});

db.once("open", () => {
  console.log("DB connected");
});
