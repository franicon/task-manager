const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { mongoose } = require('mongoose');

const userSchema = new mongoose.Schema(
    {
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
            unique: true,
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
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
);

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email})

    if (!user) {
        return 'Unable to Login'
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return 'Unable to login, check credentials'
    }

    return user
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'secret')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

// Hash Password
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema);


module.exports = User;
