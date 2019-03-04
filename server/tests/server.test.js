
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('it should create a new todo', (done)=>{
        let text="new todo created from test suite";

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect( (res)=>{
            expect(res.body.text).toBe(text);
        })
        .end( (err,res) => {
            
            if(err){
                return done(err);
            }

            Todo.find({text})
            .then( (doc) => {
                expect(doc[0].text).toBe(text);
                done();
            })
            .catch( (e)=>done(e) );

        });
    });

    it('should not create a new todo', (done) => {
        let text='';

        request(app)
              .post('/todos')
        .send({text})
        .expect(400)
        .end(done);
    });
});

describe('GET /todos', () => {
    it('should get documents from todos collection', (done) => {
        request(app)
        .get('/todos')
        .send()
        .expect(200)
        .expect( (res) => {
            expect(res.body.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/id', () => {
    it('should find a todo by id, 200', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id}`)
        .expect(200)
        .expect( (res) => {
            // console.log('response = ', res);
            expect(res.body.completedAt).toBe('0');
        })
        .end(done);
    });

    it('should not find a todo by id, 404', (done) => {
        request(app)
        .get('/todos/6c7049717ddf3267fcf602fb')
        .expect(404)
        .expect( (res) => {
            // console.log('response = ', res);
            expect(res.text).toBe('no todos found with the specified id');
        })
        .end(done);
    });

    it('should not find a todo by id, 400', (done) => {
        request(app)
        .get('/todos/5c70490fbc357067b2bb25acc')
        .expect(400)
        .expect( (res) => {
            // console.log('response = ', res);
            expect(res.body.Error).toBe('Invalid ID passed');
        })
        .end(done);
    });
});

describe('DELETE /todos/id', () => {
    it('should delete todos by id, thus 200', (done) => {
        request(app)
        .delete(`/todos/${todos[0]._id}`)
        .expect(200)
         .expect( (res) => {
             expect(res.body._id).toBe(`${todos[0]._id}`);
         })
         .end(done);
    });

    it('should not delete todos by id as it is not found, 404', (done) => {
        request(app)
         .delete('/todos/5c70490fbc357067b2bb25ac')
         .expect(404)
         .expect( (res) => {
             expect(res.text).toBe('no todos found with the specified id');
         })
         .end(done);
    });

    it('should not find a todo by id as it is invalid, 400', (done) => {
        request(app)
        .get('/todos/5c70490fbc357067b2bb25acvv')
        .expect(400)
        .expect( (res) => {
            // console.log('response = ', res);
            expect(res.body.Error).toBe('Invalid ID passed');
        })
        .end(done);
    });
});

describe('PATCH /todos/id', () => {
    
    it('should update todo, and completed is set as true', (done) => {
        request(app)
         .patch(`/todos/${todos[0]._id}`)
         .send({
             text: 'updated through test suite',
             completed: true
         })
         .expect(200)
         .expect( (res) => {
            expect(res.body.completed).toBeTruthy;
            expect(res.body.text).toBe('updated through test suite');
         })
         .end(done);
    });

    it('should update todo, and clear compltedAt when completed is set as false', (done) => {
        request(app)
         .patch(`/todos/${todos[0]._id}`)
         .send({
            text: 'updated through test suite',
         })
         .expect(200)
         .expect( (res) => {
            expect(res.body.completed).toBeFalsy;
            expect(res.body.text).toBe('updated through test suite');
            expect(res.body.completedAt).toBe('0');
         })
         .end(done);
    });

});

describe('POST /users', () => {
    it('create user when valid data is passed', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'test1@gmail.com',
            password: 'test1234'
        })
        .expect(200)
        .expect( (res) => {
            expect(res.body.email).toBe('test1@gmail.com');
            expect(res.headers['x-auth']).toExist;
        })
        .end(done);

        User.findOne({email: 'test1@gmail.com'}).then( (user) => {
            if(user) {
                expect(user).toExist;
                expect(user.password).toNotBe('test1234');
                done();
            }
        }).catch( (e) => {
            done(e);
        });
    });
    it('do not create user when invalid data is passed', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'test2@gmail.com'
        })
        .expect(400)
        .expect( (res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
    it('should not create user if email exists', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'test1@gmail.com'
        })
        .expect(400)
        .end(done);
    });
});

describe('GET /users', () => {
    it('should get documents from users collection', (done) => {
        request(app)
        .get('/users')
        .send()
        .expect(200)
        .expect( (res) => {
            expect(res.body.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('valid token is passed, get the user', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.email).toBe(users[0].email);
            expect(res.body._id).toBe(users[0]._id.toHexString());
        })
        .end(done);
    });
    it('invalid token is passed, cannot authenticate, 401', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect( (res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('GET /users/login', () => {
    it('on valid login, should set x-auth token in header', (done) => {
        request(app)
         .get('/users/login')
         .send({
             email: users[0].email,
             password: users[0].password
         })
         .expect(200)
         .expect( (res) => {
             expect(res.body.email).toBe(users[0].email);
             expect(res.body._id).toBeDefined();
             expect(res.headers['x-auth']).toExist;
         })
         .end( (err,result) => {
             if(err) return done();

             User.findById(users[0]._id).then( (user) => {
                expect(user.tokens[0]).toMatchObject({
                    access: 'auth'
                });
             done();
             }).catch( (e) => {
                done(e);
             });
         });
    });
    it('on invalid credentials, should not set x-auth token in header', (done) => {
        request(app)
         .get('/users/login')
         .send({
             email: users[0].email,
             password: '123456789'
         })
         .expect(400)
         .expect( (res) => {
             expect(res.body).toEqual({});
             expect(res.headers['x-auth']).toNotExist;
         })
         .end( (err, result) => {
             if(err) return done(err);
         
             User.find({email:users[0].email}).then( (user) => {
                if(user) expect(user).toExist;
                done();
            }).catch( (e) => done(e));
         });
    });
});

describe('DELETE /users/me/logout', () => {
    it('should delete the user specified x-auth token', (done) =>{
        request(app)
        .delete('/users/me/logout')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end( (err, result) => {
            if(err) done(err);
            
            User.find({email: users[0].email}).then( (user) => {
                expect(user[0].tokens.length).toBe(0);
                done();
            }).catch( (e) => {
                done(e);
            });
        });
    });
});
