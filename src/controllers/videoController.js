const { VideoModel, formatHashtag } = require("../models/Video");
const UserModel = require("../models/User");
const CommentModel = require("../models/Comment");

const video_Watch_Controller = async (req, res) => {
  try {
    let auth;
    let comment_auth;
    let session_user;

    const { id } = req.params;
    const video = await VideoModel.findById(id)
      .populate("creator")
      .populate("comments");
    const user = video.creator;
    const arr = [];

    for (let i = 0; i < video.comments.length; i++) {
      const comment = await UserModel.findById(video.comments[i].owner);
      if (req.session.user._id) {
        if (comment._id.toString() === req.session.user._id) {
          comment_auth = true;
        } else {
          comment_auth = false;
        }
      }
      const comment_user = comment.name;
      const comment_text = video.comments[i].text;
      const comment_img = comment.avatarUrl;
      const comment_id = video.comments[i]._id.toString();

      arr.push({
        comment_user,
        comment_text,
        comment_img,
        comment_auth,
        comment_id,
      });
    }

    if (id) {
      auth =
        video.creator.id.toString() === req.session.user._id ? true : false;
      session_user = req.session.user ? req.session.user.name : false;
    } else {
      auth = false;
    }

    if (!video) {
      return res.render("404");
    }

    return res.render("watch", {
      title: video.title,
      video,
      auth,
      user,
      arr,
      comment_auth,
      session_user,
    });
  } catch (error) {
    console.log(error);
  }
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

const video_Comment = async (req, res) => {
  const { id } = req.params;
  const { text_value } = req.body;
  const { user } = req.session;
  const video = await VideoModel.findById(id).populate("comments");

  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await CommentModel.create({
    owner: user,
    text: text_value,
    video: id,
  });

  video.comments.push(comment._id);
  video.save();

  return res.sendStatus(201);
};

const video_CommentDelete_Controller = async (req, res) => {
  const { comment_Id } = req.body;
  const { id } = req.params;

  const video = await VideoModel.findById(id).populate("comments");

  for (let i = 0; i < video.comments.length; i++) {
    console.log(video.comments[i]._id.toString(), comment_Id);
    if (video.comments[i]._id.toString() === comment_Id) {
      video.comments.splice(i, 1);
      video.save();
    }
  }
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
  const {
    body: { title, description, hashtag },
    files,
  } = req;

  const {
    session: {
      user: { _id },
    },
  } = req;

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
    res.render("home", { title: "home", videos, loggedIn });
  } catch (error) {
    console.log(error);
  }
};

const video_View_Account = async (req, res) => {
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
  video_Comment,
  video_View_Account,
  video_CommentDelete_Controller,
  video_Delete_Controller,
  video_Edit_Controller,
  video_Search_Controller,
  home_Controller,
  video_Watch_Controller,
  video_Upload_Controller,
  video_Edit_Controller_Post,
  video_Upload_Controller_Post,
};
