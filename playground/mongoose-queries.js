const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// var id = '6c5246db3c0825c14f7b6ed3111';
//
// if (!ObjectID.isValid(id)) {
//     console.log(`Id is not valid!`);
// }

var id = '5c4ea02c7d31adc03b875b59';

if (! ObjectID.isValid(id)) {
    console.log(`Id is invalid`);
} else {
    User.findById(id).then((user)=>{
        if (!user){
            console.log(`Id: ${id} is not found!`);
        } else  {
            console.log(`User by Id ${user}`);
        }
    }).catch((e)=>{
       console.log(e);
    });
}




// Todo.find({
//     _id: id
// }).then((todos)=>{
//    console.log(`Todos ${todos}`);
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log(`Todo ${todo}`);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log(`Id not found`);
//     }
//     console.log(`Todo by Id ${todo}`);
// }).catch((e) => {
//     console.log(e);
// });