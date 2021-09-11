const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideoSchema = new Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hashtag: [{ type: String, trim: true }],
  videoUrl: String,
  imgUrl: String,
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

VideoSchema.pre("save", async function () {
  try {
    this.hashtag = this.hashtag[0]
      .split(",")
      .map((el) => (el.startsWith("#") ? el : `#${el}`));
  } catch (error) {
    console.log(error);
  }
});

VideoSchema.static("formatHashtag", (hashtag) => {
  return hashtag.split(",").map((el) => (el.startsWith("#") ? el : "#" + el));
});

const VideoModel = mongoose.model("Video", VideoSchema);

module.exports = { VideoModel };
