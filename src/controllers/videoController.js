const { VideoModel, formatHashtag } = require("../models/Video");
const FileAPI = require("file-api");

const video_Watch_Controller = async (req, res) => {
  const _id = req.params.id;
  const video = await VideoModel.findById(_id);
  if (!video) {
    return res.render("404");
  }
  return res.render("watch", {
    title: video.title,
    video,
  });
};

const video_Edit_Controller = async (req, res) => {
  const _id = req.params.id;
  const video = await VideoModel.findById(_id);
  return res.render("edit", { title: `Edit: ${video.title} `, video, _id });
};

const video_Edit_Controller_Post = async (req, res) => {
  const _id = req.params.id;
  const { title, description, hashtag } = req.body;
  const video = await VideoModel.exists({ _id });
  if (!video) {
    return res.render("404");
  }
  await VideoModel.findByIdAndUpdate(_id, {
    title,
    description,
    hashtag: VideoModel.formatHashtag(hashtag),
  });
  return res.redirect(`/video/${_id}`);
};

const video_Delete_Controller = async (req, res) => {
  const _id = req.params.id;
  await VideoModel.findByIdAndDelete(_id);
  return res.redirect("/");
};

const video_Comments_Controller = (req, res) => {
  res.send("videoComments");
};

const video_CommentDelete_Controller = (req, res) => {
  res.send("videoDelete");
};

const video_Search_Controller = async (req, res) => {
  const { search } = req.query;
  if (search) {
    const regex = new RegExp(search, "i");
    const videos = await VideoModel.find({ title: regex });

    res.render("search", { title: "Search", videos });
  } else {
  }
  res.render("search", { title: "Search" });
};

const video_Upload_Controller = (req, res) => {
  res.render("upload", { title: "Upload Video" });
};

const video_Upload_Controller_Post = async (req, res) => {
  const { title, description, hashtag, video } = req.body;
  const reader = new global.FileReader().readAsDataURL(video);

  console.log(reader);
  try {
    await VideoModel.create({
      title,
      video,
      description,
      hashtag: VideoModel.formatHashtag(hashtag),
    });
    return res.redirect("/");
  } catch (error) {
    res.render("upload", error);
  }
};

const home_Controller = async (req, res) => {
  try {
    const videos = await VideoModel.find();
    const loggedIn = req.session.loggedIn;
    res.render("home", { title: "home", videos, loggedIn });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  video_CommentDelete_Controller,
  video_Delete_Controller,
  video_Edit_Controller,
  video_Search_Controller,
  home_Controller,
  video_Watch_Controller,
  video_Comments_Controller,
  video_Upload_Controller,
  video_Edit_Controller_Post,
  video_Upload_Controller_Post,
};
