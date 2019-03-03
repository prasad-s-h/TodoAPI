
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: '0'
}];

let user1Id = new ObjectID();
let user2Id = new ObjectID();

const users = [{
    _id: user1Id,
    email: 'prasad_s_h@hotmail.com',
    password: 'prasads@123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: user1Id.toHexString(), access: 'auth'}, 'secretKey').toString()
    }]
    }, {
        _id: user2Id,
        email: 'prasad_s@hotmail.com',
        password: 'prasads@123'
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then( () => done());
};

const populateUsers = (done) => {
    User.remove({}).then( () => {
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();
        
        return Promise.all([user1, user2]);
    }).then( () => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};
