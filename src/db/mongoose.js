const mongoose = require('mongoose');
const { Schema } = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27016/task-manager-api')



const Task = mongoose.model('Task', new Schema({
    description: {
        type: String,
        required: true,
        unique: true,
    },
    completed: {
        type: Boolean,
        default: false,
        required: false
    }
}));

const newTask = new Task({description: 'Build a Project'})

newTask.save().then(() => {
    console.log(newTask)
}).catch((err) => {
    console.log(err)
}).finally(() => mongoose.disconnect())
