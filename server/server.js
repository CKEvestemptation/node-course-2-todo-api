var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/12345
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        console.log(`Id is invalid`);
        res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
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
app.get('/todos', (req, res) => {
    Todo.find().then((todos)=>{
        res.send(todos)
    }).catch((e)=>{
        res.status(400).send();
    });
});

// DELETE /todos/:id
app.delete('/todos/:id',(req, res)=>{
    var id = req.params.id;
    
    if ( !ObjectID.isValid(id)) {
        console.log(`Id is invalid`);
        res.status(404).send();
    }else {
        Todo.findByIdAndRemove(id).then((todo)=>{
            if (!todo){
                res.status(404).send(`Id: ${id} not found!`);
            } else {
                console.log(todo);
                res.status(200).send(todo);
            }
        }).catch((e)=>{
            console.log(e);
            res.status(400).send();
        });
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}!`);
});


module.exports = {app};

