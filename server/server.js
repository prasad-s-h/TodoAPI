
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;
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

    // return mongoose.connection.close();

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

    // return mongoose.connection.close();

});

app.get('/todos/:id', (req, res) => {
    let todoId = req.params.id;
    
    if(!ObjectID.isValid(todoId)){
        return res.status(400).send({Error: 'Invalid ID passed'});
    }

    Todo.findById(todoId).then( (todos) => {
        if(!todos) return res.status(404).send('no todos found with the specified id');
        return res.send(todos);
    }, (e) => {
        return res.status(400).send(`Error:- ${e.message}`);
    });

    // return mongoose.connection.close();

});

app.delete('/todos/:id', (req,res) => {
    let todoId = req.params.id;
    
    if(!ObjectID.isValid(todoId)){
        return res.status(400).send({Error: 'Invalid ID passed'});
    }

    Todo.findByIdAndRemove(todoId).then( (todo) => {
        if(!todo) return res.status(404).send('no todos found with the specified id');
        return res.send(todo);
    }, (e) => {
        return res.status(400).send(`Error:- ${e.message}`);
    });

    // return mongoose.connection.close();

});

app.patch('/todos/:id', (req,res) => {
    let todoId = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);
    
    if(!ObjectID.isValid(todoId)){
        return res.status(400).send({Error: 'Invalid ID passed'});
    }

    if(_.isBoolean(body.completed)  && body.completed  ){
        body.completedAt = new Date().toString();
    }else{
        body.completedAt = 0;
        body.completed = false;
    }

    Todo.findByIdAndUpdate(todoId, {
        text: body.text,
        completed: body.completed,
        completedAt: body.completedAt
    }, {
        new: true
    }).then( (oldDoc) => {
        if(!oldDoc){
            res.status(404).send('no document found with the specified id');
            return;
        }
        res.send(oldDoc);
    }).catch( (e) => {
        res.status(400).send(e);
    });

    // return mongoose.connection.close();

});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});

module.exports = {
    app
};
