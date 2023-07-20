const express = require('express');

// Model
const User = require("../models/user");

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
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

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((item) => allowedUpdates.includes(item))

    if (!isValid) {
        return res.status(400).send({error: "Invalid updates"})
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save()

        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({error: 'user not found'})
        }
        res.status(200).send({msg: 'Deleted successfully'})
    }catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
