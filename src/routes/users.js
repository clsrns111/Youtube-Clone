const express = require("express");
const router = express.Router();
const {
  user_Logout_Controller,
  user_Edit_Controller,
  user_Delete_Controller,
  user_Controller,
  user_Github_Controller,
  user_Github_Finish_Controller,
  user_Edit_Controller_Post,
  user_Change_Password_Controller,
  user_Change_Password_Controller_Post,
} = require("../controllers/userController");
const { protectorMiddleware, publicMiddleware } = require("../middleware");

router
  .route("/edit")
  .all(protectorMiddleware)
  .get(user_Edit_Controller)
  .post(user_Edit_Controller_Post);

router
  .route("/change_password")
  .all(protectorMiddleware)
  .get(user_Change_Password_Controller)
  .post(user_Change_Password_Controller_Post);

router.get("/logout", protectorMiddleware, user_Logout_Controller);
router.get("/github/start", publicMiddleware, user_Github_Controller);
router.get("/github/finish", publicMiddleware, user_Github_Finish_Controller);
router.get("/:id", user_Controller);
router.post("/:id/delete", user_Delete_Controller);

module.exports = router;
