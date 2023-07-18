const express = require('express');

require('./db/mongoose');

// Models
const User = require('./models/user');
const Task = require('./models/task');

// Router
const userRouter = require('./routers/user')

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(userRouter)

// User

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

app.delete('/tasks/:id', async (req, res) => {
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

app.listen(PORT, () => {
    console.log('server started on port ' + PORT)
});

