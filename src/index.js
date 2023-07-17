const express = require('express');

require('./db/mongoose');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.status(200).send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.listen(PORT, () => {
    console.log('server started on port ' + PORT)
});
    
