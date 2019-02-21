
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

/*
describe('POST /todos', ()=>{
    it('it should create a new todo', (done)=>{
        let text="new todo created from test suite";

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect( (res)=>{
            expect(res.body.text).toBe(text);
        })
        // .end(done);
        .end( (err,res)=>{
            
            if(err){
                return done(err);
            }

            Todo.find({text})
            .then( (doc)=>{
                expect(doc[0].text).toBe(text);
                done();
            })
            .catch( (e)=>done(e) );

        });
    });

    it('should not create a new todo', (done)=>{
        let text='';

        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .end(done);
    });
});
*/

describe('GET /todos', () => {
    it('should get documents from todos collection', (done) => {
        request(app)
        .get('/todos')
        .send()
        .expect(200)
        .expect( (res) => {
            expect(res.body.length).toBe(19);
        })
        .end(done);
    });
});

describe('GET /todos/id 200', () => {
    it('should find a todo by id', (done) => {
        request(app)
         .get('/todos/5c6cd5fe9aaa3422ac2b16d9')
         .expect(200)
         .expect( (res) => {
            // console.log('response = ', res);
            expect(res.body.completedAt).toBe(9);
         })
         .end(done);
    });
});

describe('GET /todos/id 404', () => {
    it('should not find a todo by id', (done) => {
        request(app)
         .get('/todos/5c6cd5fe9aaa3422ac2b16d1')
         .expect(404)
         .expect( (res) => {
            // console.log('response = ', res);
            expect(res.text).toBe('no todos found with the specified id');
         })
         .end(done);
    });
});

describe('GET /todos/id 400', () => {
    it('should not find a todo by id', (done) => {
        request(app)
         .get('/todos/5c6cd5fe9aaa3422ac2b16d91')
         .expect(400)
         .expect( (res) => {
            // console.log('response = ', res);
            expect(res.body.Error).toBe('Invalid ID passed');
         })
         .end(done);
    });
});
