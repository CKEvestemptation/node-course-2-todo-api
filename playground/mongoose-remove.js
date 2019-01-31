const {ObjectID} = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5c534a173c0825c14f7b7388').then((todo)=>{
    console.log(todo);
});
