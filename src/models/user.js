const  mongoose  = require('mongoose');
const { Schema } = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('you can not use the word password')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be a positive number')
            }
        }
    }
}))


module.exports = User;
