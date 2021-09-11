const { VideoModel, formatHashtag } = require("../models/Video");
const UserModel = require("../models/User");

const video_Watch_Controller = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findById(id).populate("creator");
    const user = video.creator;

    const auth = video.creator.id.toString() === req.session.user.id;

    if (!video) {
      return res.render("404");
    }

    return res.render("watch", {
      title: video.title,
      video,
      auth,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const video_Edit_Controller = async (req, res) => {
  const _id = req.params.id;
  const video = await VideoModel.findById(_id);
  console.log(typeof _id);
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
  try {
    const { search } = req.query;
    if (search) {
      const regex = new RegExp(search, "i");
      const videos = await VideoModel.find({ title: regex });

      res.render("search", { title: "Search", videos });
    } else {
    }
    res.render("search", { title: "Search" });
  } catch (error) {
    console.log(error);
  }
};

const video_Upload_Controller = (req, res) => {
  res.render("upload", { title: "Upload Video" });
};

const video_Upload_Controller_Post = async (req, res, next) => {
  console.log(req.files[0]);

  const {
    body: { title, description, hashtag },
    files,
  } = req;

  const {
    session: {
      user: { _id },
    },
  } = req;
  console.log(files.thumnail[0].path);
  try {
    const newVideo = await VideoModel.create({
      creator: _id,
      videoUrl: files.video[0].path,
      imgUrl: files.thumnail[0].path,
      title,
      description,
      hashtag: VideoModel.formatHashtag(hashtag),
    });

    const user = await UserModel.findById(_id);

    user.videos.push(newVideo);
    user.save(next); // hash가 다시한번 되는 버그발생.

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("upload", error);
  }
};

const home_Controller = async (req, res) => {
  try {
    const videos = await VideoModel.find();
    const loggedIn = req.session.loggedIn;
    console.log(videos);
    res.render("home", { title: "home", videos, loggedIn });
  } catch (error) {
    console.log(error);
  }
};

const video_View_Account = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views++;
  await video.save();
  return res.sendStatus(200);
};

module.exports = {
  video_View_Account,
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
