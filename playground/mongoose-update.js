
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');
const {ObjectID} = require('mongodb');

let id = '5c6b981157cbe72416162d61';

Todo.findByIdAndUpdate(id, {
    text: "updated thrice"
}, {
    new: true
}).then( (oldDoc) => {
    if(!oldDoc){
        console.log('no document found with the specified id');
        return;
    }
    console.log('the following doc has been updated');
    console.log(oldDoc);
}).catch( (e) => {
    console.log('note down the following error');
    console.log(e);
});
