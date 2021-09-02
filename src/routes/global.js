const express = require("express");
const router = express.Router();

const {
  user_Join_Controller,
  user_Login_Controller,
  user_Join_Controller_Post,
  user_Login_Controller_Post,
} = require("../controllers/userController");

const {
  home_Controller,
  video_Search_Controller,
} = require("../controllers/videoController");
const { publicMiddleware } = require("../middleware");

router.get("/", home_Controller);

router
  .route("/login")
  .all(publicMiddleware)
  .get(user_Login_Controller)
  .post(user_Login_Controller_Post);
router.get("/search", video_Search_Controller);
router
  .route("/join")
  .all(publicMiddleware)
  .get(user_Join_Controller)
  .post(user_Join_Controller_Post);

module.exports = router;
