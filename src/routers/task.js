const express = require('express');

const Task = require("../models/task");
const auth = require('../middleware/auth');

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send('No task found with the given ID')
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((item) => allowedUpdates.includes(item));

    if (!isValid) {
        res.status(400).send({ error: "Invalid updates"})
    }

    try {

        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])

        await task.save();

        if (!task) {
            return res.status(400).send('Task not found with the given ID')
        }
        res.status(200).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send({error: 'No task could be found with the ID'})
        }
        res.status(200).send({msg: 'Task Deleted Successfully'})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
