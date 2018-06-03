var mongoose = require('mongoose');

// this creates schema in DB
module.exports = mongoose.model('task',{
    taskType: String,
    taskPriority: String,
    taskDueDate: String,
    taskDescription: String,
})