
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');
const {ObjectID} = require('mongodb');

let id = '5c6cd5fe9aaa3422ac2b16d9';

Todo.findByIdAndRemove(id).then( (deletedDoc) => {
    if(!deletedDoc){
        console.log('no document found with the specified id');
        return;
    }
    console.log('the following doc has been removed');
    console.log(deletedDoc);
}).catch( (e) => {
    console.log('note down the following error');
    console.log(e);
});

Todo.remove({
    text : "new todo created from test suite"
}).then( (deletedDocs) => {
    if(!deletedDocs){
        console.log('no document/s found with the specified id');
        return;
    }
    console.log('the following doc/s has been removed');
    console.log(deletedDocs);
}).catch( (err) => {
    console.log('note down the following error');
    console.log(e);
});
