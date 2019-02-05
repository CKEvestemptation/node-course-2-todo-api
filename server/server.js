const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/12345
app.get('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        console.log(`Id is invalid`);
        res.status(404).send();
    } else {
        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            if (!todo) {
                res.status(404).send(`Id: ${id} is not found!`);
            } else {
                res.status(200).send(todo);
            }
        }).catch((e) => {
            console.log(e);
            res.status(400).send();
        });
    }
});

//GET /todos
app.get('/todos',authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send(todos)
    }).catch((e) => {
        res.status(400).send();
    });
});

// DELETE /todos/:id
app.delete('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        console.log(`Id is invalid`);
        res.status(404).send();
    } else {
        Todo.fineOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            if (!todo) {
                res.status(404).send(`Id: ${id} not found!`);
            } else {
                console.log(todo);
                res.status(200).send({todo});
            }
        }).catch((e) => {
            console.log(e);
            res.status(400).send();
        });
    }
});

// PATCH
app.patch('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        console.log(`Id is invalid`);
        res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.fineOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        console.log(e);
        res.status(400).send();
    });

});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Started on port ${port}!`);
});


module.exports = {app};

