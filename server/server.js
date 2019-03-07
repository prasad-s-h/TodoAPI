
require('./config/config');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res) => {
    
    try {
        const newTodo = new Todo({
            text: req.body.text,
            completed: req.body.completed,
            completedAt: req.body.completed ? new Date().toString() : "0",
            _creator: req.user._id
        });
        const doc = await newTodo.save();
        res.send(doc);
    } catch (error) {
        let errorString = '';
        errorString += 'unable to save the data into todos collection \n';
        errorString += 'note down the following error \n';
        res.status(400).send(`${errorString} \n ${error}`);
    }

});

app.get('/todos', authenticate, async (req, res) => {

    try {
        const todos = await Todo.find({_creator: req.user._id});    
        res.send(todos);
    } catch (error) {
        res.status(400).send('unable to fetch the todos collection');
    }

});

app.get('/todos/:id', authenticate, async (req, res) => {

    try {
        const todoId = req.params.id;
    
        if(!ObjectID.isValid(todoId)){
            return res.status(400).send({Error: 'Invalid ID passed'});
        }
        const todos = await Todo.findOne({
            _id: todoId,
            _creator: req.user._id
        });
        if(!todos) return res.status(404).send('no todos found with the specified id');
        return res.send(todos);
    } catch (error) {
        return res.status(400).send(`Error:- ${error.message}`);    
    }

});

app.patch('/todos/:id', authenticate, async (req,res) => {
    
    try {
        let todoId = req.params.id;
        let body = _.pick(req.body, ['text', 'completed']);
        
        if(!ObjectID.isValid(todoId)){
            return res.status(400).send({Error: 'Invalid ID passed'});
        }

        if(_.isBoolean(body.completed)  && body.completed  ){
            body.completedAt = new Date().toString();
        }else{
            body.completedAt = "0";
            body.completed = false;
        }

        const oldDoc = await Todo.findOneAndUpdate({
            _id: todoId,
            _creator: req.user._id
        }, {
            text: body.text,
            completed: body.completed,
            completedAt: body.completedAt
        }, {
            new: true
        });

        if(!oldDoc){
            res.status(404).send('no document found with the specified id');
            return;
        }
        res.send(oldDoc);

    } catch (error) {
        res.status(400).send(error);
    }

});

app.delete('/todos/:id', authenticate, async (req,res) => {
    
    try {
        const todoId = req.params.id;
        if(!ObjectID.isValid(todoId)){
            return res.status(400).send({Error: 'Invalid ID passed'});
        }
        const todo = await Todo.findOneAndDelete({
            _id: todoId,
            _creator: req.user._id
        });
        if(!todo) return res.status(404).send('no todos found with the specified id');
        return res.send(todo);
    } catch (e) {
        return res.status(400).send(`Error:- ${e.message}`);
    }

});

app.post('/users', async (req,res) => {
    
    try {
        let body = _.pick(req.body, ['email','password']);            
        let newUser = new User(body);

        // call genarateAuthToken() - responsible for creating user specific auth token, saving and returning to the user

        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.header('x-auth',token).send(newUser);

    } catch (e) {
        let errorString = '';
        errorString += 'unable to save the data into users collection \n';
        errorString += 'note down the following error \n';
        res.status(400).send(`${errorString} \n${e}`);
    }

});

app.get('/users' , async (req, res) => {

    try {
        const users = await User.find();    
        if(!users) {
            return res.send('no documents found from users collection');
        }
        return res.send(users);
    } catch (error) {
        return res.status(400).send('unable to fetch the users collection')
    }

});

app.get('/users/me', authenticate, (req,res) => {    
    res.send(req.user);
});

app.post('/users/login', async (req,res) => {
    
    /* first way
    User.findOne({
        email: body.email
    }).then( (user) => {
        if(!user) {
            return res.send('incorrect email/password');
        }else {
            let hashedDbUserPwd = user.password;
            console.log('hashedDbUserPwd = ', hashedDbUserPwd);
            bcrypt.compare(body.password, hashedDbUserPwd, (err, success) => {
                console.log('res = ', success);
                if(!success) return res.send('incorrect email/password');
                return res.send(user);
            });
        }
    }).catch( (e) => {
        res.status(400).send(e);
    });
    */        
   
    // second way
    try {
        const body = _.pick(req.body, ['email','password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
    } catch (error) {
        res.status(400).send(error);
    }

});

app.delete('/users/me/logout', authenticate, async (req, res) => {
    
    try {
        await req.user.removeToken(req.token);
        res.send('token removed successfully');    
    } catch (error) {
        res.status(400).send(error);
    }

});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

module.exports = {
    app
};
