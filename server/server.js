
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    
    let newTodo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });
    
    newTodo.save().then( (doc)=>{
        res.send(doc);
    }, (e)=>{
        let errorString = '';
        errorString += 'unable to save the data into todos collection \n';
        errorString += 'note down the following error \n';
        res.status(400).send(`${errorString} \n ${e}`);
        // res.status(400).send(errorString + e);
        // res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {

    Todo.find().then( (todos) => {
        res.send(todos);
        // res.send({
        //     todos,
        //     statusCode: 200
        // });
    }, (err) => {
        res.status(400).send('unable to fetch the todos collection');
    });

});

app.get('/todos/:id', (req, res) => {
    let todoId = req.params.id;
    
    if(!ObjectID.isValid(todoId)){
        return res.status(400).send({Error: 'Invalid ID passed'});
    }

    Todo.findById(todoId).then( (todos) => {
        if(!todos) return res.status(404).send('no todos found with the specified id');
        return res.send({todos});
    }, (e) => {
        return res.status(400).send(`Error:- ${e.message}`);
    });
});

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});

// let newUser = new User({
//     userName: 'prasad_s_h',
//     email: 'prasad_s_h@hotmail.com'
// });


// newUser.save().then( (doc)=>{
//     console.log('document saved successfully into users collection');
//     console.log(doc);
// }, (e)=>{
//     console.log('unable to save the into users collection');
//     console.log('note down the following error');
//     console.log(e);
// });

module.exports = {
    app
};
