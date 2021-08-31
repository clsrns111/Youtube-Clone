const express = require("express");
const router = express.Router();
const {
  video_Watch_Controller,
  video_Edit_Controller,
  video_Delete_Controller,
  video_Comments_Controller,
  video_CommentDelete_Controller,
  video_Upload_Controller,
  video_Edit_Controller_Post,
  video_Upload_Controller_Post,
} = require("../controllers/videoController");

router
  .route("/:id([0-9a-f]{24})/edit")
  .post(video_Edit_Controller_Post)
  .get(video_Edit_Controller);

router.get("/:id([0-9a-f]{24})", video_Watch_Controller);
router.get("/:id([0-9a-f]{24})/delete", video_Delete_Controller);

router
  .route("/upload")
  .get(video_Upload_Controller)
  .post(video_Upload_Controller_Post);

/* router.post("/comments", video_Comments_Controller);
router.post("/comments/delete", video_CommentDelete_Controller);
 */

module.exports = router;
