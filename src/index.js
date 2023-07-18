const express = require('express');

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

// User
app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e){
        res.status(400).send(e)
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send(_id)
        }
        res.status(200).send(user)
    }).catch((err) => {
        res.status(404).send(err)
    })
})

// Task
app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(200).send(task)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((err) => {
        res.status(500)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404)
        }
        res.status(200).send(task)
    }).catch((err) => {
        res.status(500).send(err)
    })
})


app.listen(PORT, () => {
    console.log('server started on port ' + PORT)
});

