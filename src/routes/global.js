const express = require("express");
const router = express.Router();

const {
  user_Join_Controller,
  user_Login_Controller,
} = require("../controllers/userController");

const {
  home_Controller,
  video_Search_Controller,
} = require("../controllers/videoController");

router.get("/", home_Controller);
router.get("/join", user_Join_Controller);
router.get("/login", user_Login_Controller);
router.post("/search", video_Search_Controller);

module.exports = router;
