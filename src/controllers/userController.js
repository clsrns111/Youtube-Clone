const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const fetch = require("node-fetch");
const { VideoModel } = require("../models/Video");
require("dotenv").config();

const user_Profile_Controller = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id).populate("videos");
  console.log(user);
  /* const user_Video = await VideoModel.find({ creator: id });*/

  return res.render("profile", { title: "내 정보", user });
};

const user_Edit_Controller = (req, res) => {
  return res.render("edit_profile", {
    title: "Profile Edit",
  });
};

const user_Edit_Controller_Post = async (req, res) => {
  const {
    session: { _id, avatarUrl },
    body: { name, email, nickName },
    file,
  } = req;
  if (
    req.session.user.nickName !== nickName ||
    req.session.user.email !== email
  ) {
    const check = await UserModel.exists({ $or: [{ email }, { nickName }] });
    if (check) {
      const message = "이미 사용중인 이메일 혹은 닉네임입니다.";
      return res.render("edit_profile", {
        title: "Profile Edit",
        message,
      });
    }
  }
  try {
    const newUser = await UserModel.findOneAndUpdate(
      _id,
      {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        nickName,
      },
      { new: true } //바로 업데이트 됨
    );
    req.session.user = newUser;
  } catch (error) {
    console.log(error);
  }
  return res.redirect("/users/edit");
};

const user_Delete_Controller = (req, res) => {
  res.send("userDelete");
};

const user_Join_Controller = (req, res) => {
  res.render("join");
};

const user_Join_Controller_Post = async (req, res) => {
  const { name, nickName, email, password, location, password2 } = req.body;
  const check = await UserModel.exists({ $or: [{ email }, { nickName }] });
  if (password !== password2) {
    const error = "비밀번호가 일치하지 않습니다.";
    return res.status(404).render("join", { error });
  }
  if (check) {
    const error = "중복된 이메일 혹은 닉네임입니다";
    return res.status(404).render("join", { error });
  }

  await UserModel.create({
    name,
    nickName,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};

const user_Login_Controller = (req, res) => {
  res.render("login");
};

const user_Login_Controller_Post = async (req, res) => {
  const { email, password } = req.body;
  const check = await UserModel.findOne({ email });

  if (!check) {
    const error = "존재하지않는 이메일입니다.";
    return res.status(404).render("login", { error });
  }

  const compare = await bcrypt.compare(password, check.password);

  if (!compare) {
    const error = "패스워드가 일치하지 않습니다..";
    return res.render("login", { error });
  }
  req.session.user = check;
  req.session.loggedIn = true;
  return res.redirect("/");
};

const user_Logout_Controller = (req, res) => {
  req.session.destroy();
  req.flash("info", "BYE BYE");
  return res.redirect("/");
};

const user_Controller = (req, res) => {};

const user_Github_Controller = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "f57db8a89753de6a902a",
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const Url = `${baseUrl}?${params}`;
  return res.redirect(Url);
};

const user_Github_Finish_Controller = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: "f57db8a89753de6a902a",
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();
  const Url = `${baseUrl}?${params}`;

  const data = await fetch(Url, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const jsonData = data.json();

  try {
    if ("access_token" in jsonData) {
      const { access_token } = jsonData;
      const apiurl = "https://api.github.com/";
      const userRequest = await await fetch(apiurl + "/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
      console.log(userRequest);
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
};

const user_Change_Password_Controller = (req, res, next) => {
  return res.render("change_password", { title: "비밀번호변경" });
};

const user_Change_Password_Controller_Post = async (req, res, next) => {
  const {
    body: { password, new_password, new_password2 },
    session: {
      user: { _id },
    },
  } = req;

  const DB_password = await UserModel.find({ _id });
  const passwordCheck = await bcrypt.compare(password, DB_password[0].password);

  if (!passwordCheck) {
    const message = "비밀번호가 다릅니다.";
    return res
      .status(404)
      .render("change_password", { title: "비밀번호변경", message });
  }
  if (new_password !== new_password2) {
    const message = "새 비밀번호와 새 비밀번호 확인이 다릅니다.";
    return res
      .status(404)
      .render("change_password", { title: "비밀번호변경", message });
  }
  const user = await UserModel.findById(_id);
  user.password = new_password;
  await user.save(); //pre save() 작동됨.
  return res.redirect("/users/logout");
};

module.exports = {
  user_Profile_Controller,
  user_Controller,
  user_Delete_Controller,
  user_Edit_Controller,
  user_Join_Controller,
  user_Login_Controller,
  user_Logout_Controller,
  user_Join_Controller_Post,
  user_Login_Controller_Post,
  user_Github_Controller,
  user_Edit_Controller_Post,
  user_Github_Finish_Controller,
  user_Change_Password_Controller,
  user_Change_Password_Controller_Post,
};
