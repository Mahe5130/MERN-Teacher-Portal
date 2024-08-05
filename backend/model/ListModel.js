const mongoose = require("mongoose");


//creating schema
const todoSchema = new mongoose.Schema({
    title: String,
    subject: String,
    mark: String
})

//create model
const Model = mongoose.model('Todo', todoSchema);

module.exports = Model;
