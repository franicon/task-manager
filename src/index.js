const express = require('express');

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

// User
app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/users/:id', async (req, res) => {
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

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((item) => allowedUpdates.includes(item))

    if (!isValid) {
        return res.status(400).send({error: "Invalid updates"})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.delete('/users/:id', async (req, res) => {
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

// Task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/tasks', async (req, res) => {
   try {
       const tasks = await Task.find({});
       res.status(200).send(tasks);
   } catch (e) {
       res.status(500).send();
   }
})

app.get('/tasks/:id', async (req, res) => {
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

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((item) => allowedUpdates.includes(item));

    if (!isValid) {
        res.status(400).send({ error: "Invalid updates"})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if (!task) {
           return res.status(400).send('Task not found with the given ID')
        }
        res.status(200).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

app.listen(PORT, () => {
    console.log('server started on port ' + PORT)
});

