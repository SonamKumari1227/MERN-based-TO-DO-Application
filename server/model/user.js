const mongoose = require("mongoose");

const user = new mongoose.Schema({
   
    "name": String,
    "email": String,
    "password":String
})
const userModel = new mongoose.model('myuser', user);
module.exports = userModel;