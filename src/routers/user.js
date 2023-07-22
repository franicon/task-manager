const multer = require('multer');
const express = require('express');
const avatar = multer({
    dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Supported files includes: JPG, JPEG, PNG'))
        }
        cb(undefined, true)
    }
})

const auth = require('../middleware/auth');
const User = require("../models/user");

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logouts', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((item) => allowedUpdates.includes(item))

    if (!isValid) {
        return res.status(400).send({error: "Invalid updates"})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        res.status(200).send({msg: 'Your account has been deleted successfully'})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), (req, res) => {
    res.status(200).send()
},(error, req, res, next) => {
    res.status(400).send({error: error.message})
})

module.exports = router
