
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

let text = 'new todo created from test suite';
let id = '5c6cd5fe9aaa3422ac2b16d9';
let userId = '5c69bf95f99ef6380d091293'; 

/*
Todo.find({text}).then( (docs) => {
    console.log('todo by find ', docs);
}, (err) => {
    console.log('note down the following error');
    console.log(err);
});

Todo.findOne({text}).then( (doc) => {
    console.log('todo by findOne ', doc);
}, (err) => {
    console.log('note down the following error');
    console.log(err);
});

Todo.findById(id).then( (doc) => {
    console.log('todo by findById ');
    if(!doc) return console.log('no document with the specified id');
    console.log(doc);
}, (err) => {
    console.log('note down the following error');
    console.log(err);
});
*/

User.findById(userId).then( (user) => {
    if(!user) return console.log('no user found with the specified id');
    console.log(user);
}, (err)=>{
    console.log('err = ');
    console.log(err);
});
// .catch( (err) => {
//     console.log('error = ');
//     console.log(err);
// });
