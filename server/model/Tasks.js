const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
    "task":String
})

const taskModel = new mongoose.model('task', TaskSchema);
module.exports = taskModel;