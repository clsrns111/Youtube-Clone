require("./db");
require("./models/Video"); //model precomplie 하기위함
require("./models/User"); //model precomplie 하기위함
require("./models/Comment"); //model precomplie 하기위함

const app = require("./index");

app.listen(3000, () => console.log(`Example app listening on port port!`));
