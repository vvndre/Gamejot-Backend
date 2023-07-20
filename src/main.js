let express = require("express");

let app = express();

require("dotenv").config();

app.use(express.json());

let PORT = process.env.PORT || 3000;

let routes = require("./routes");
app.get;

app.listen(PORT, function () {
  console.log("Gamejot is Locked & Loaded", PORT);
});
