const express = require('express');

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

// User
app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.status(200).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send(id)
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


app.listen(PORT, () => {
    console.log('server started on port ' + PORT)
});

