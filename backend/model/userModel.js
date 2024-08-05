const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
});


let Model = mongoose.model("user", UserSchema);

module.exports = Model;
