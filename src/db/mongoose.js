const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27016/task-manager-api')

// const User = mongoose.model('User', new Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         minLength: 7,
//         trim: true,
//         validate(value) {
//             if (value.includes('password')) {
//                 throw new Error('you can not use the word password')
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('age must be a positive number')
//             }
//         }
//     }
// }))

// const me = new User({name: 'Mike', email: ' mike@Gmail.Com ', password:'!icon++'})
//
// me.save().then((me) => {
//     console.log('User', me)
// }).catch((err) => {
//     console.log('error', err)
// }).finally(() => mongoose.disconnect())

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
