const express = require("express");
const router = express.Router();
const {
  user_Logout_Controller,
  user_Edit_Controller,
  user_Delete_Controller,
  user_Controller,
} = require("../controllers/userController");

router.get("/logout", user_Logout_Controller);
router.get("/:id", user_Controller);
router.get("/:id/edit", user_Edit_Controller);
router.post("/:id/delete", user_Delete_Controller);

module.exports = router;
