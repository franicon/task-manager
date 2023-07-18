const  { Schema, mongoose } = require ('mongoose');

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

module.exports = Task;
