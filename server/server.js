
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
        return res.send(todos);
    }, (e) => {
        return res.status(400).send(`Error:- ${e.message}`);
    });

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
        body.completedAt = "0";
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

});

app.post('/users', (req,res) => {
    
    let body = _.pick(req.body, ['email','password']);

    //first type
    // let newUser = new User({
    //     email: body.email,
    //     password: body.password
    // });

    //second type
    let newUser = new User(body);

    // call genarateAuthToken() - responsible for creating user specific auth token, saving and returning to the user

    newUser.save().then( () => {
        // res.send(user.email);
        return newUser.generateAuthToken();
    }).then( (token) => {
        res.header('x-auth',token).send(newUser);
    }).catch( (e) => {
        let errorString = '';
        errorString += 'unable to save the data into users collection \n';
        errorString += 'note down the following error \n';
        res.status(400).send(`${errorString} \n${e}`);
    });

});

app.get('/users' , (req, res) => {

    User.find().then( (users) => {
        if(!users) {
            return res.send('no documents found from users collection');
        }
        return res.send(users);
    }).catch( (e) => {
        return res.status(400).send('unable to fetch the users collection')
    });

});

app.get('/users/me', authenticate, (req,res) => {    
    res.send(req.user);
});

app.get('/users/login', (req,res) => {
    
    const body = _.pick(req.body, ['email','password']);
    
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
    User.findByCredentials(body.email, body.password).then( (result)=> {
        return result.generateAuthToken().then( (token) => {
            res.header('x-auth',token).send(result);
        });
    }).catch( (e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then( () => {
        res.send('token removed successfully');
    }).catch( (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

module.exports = {
    app
};
