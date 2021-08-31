const user_Edit_Controller = (req, res) => {
  res.send("userEdit");
};
const user_Delete_Controller = (req, res) => {
  res.send("userDelete");
};
const user_Join_Controller = (req, res) => {
  res.send("join");
};
const user_Login_Controller = (req, res) => {
  res.send("login");
};
const user_Logout_Controller = (req, res) => {};
const user_Controller = (req, res) => {
  console.log(req.params);
};

module.exports = {
  user_Controller,
  user_Delete_Controller,
  user_Edit_Controller,
  user_Join_Controller,
  user_Login_Controller,
  user_Logout_Controller,
};
