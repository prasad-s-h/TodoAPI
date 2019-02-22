
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

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

describe('GET /todos/id', () => {
    it('should find a todo by id, 200', (done) => {
        request(app)
        .get('/todos/5c6cd5fe9aaa3422ac2b16d9')
        .expect(200)
        .expect( (res) => {
            // console.log('response = ', res);
            expect(res.body.completedAt).toBe(9);
        })
        .end(done);
    });

    it('should not find a todo by id, 404', (done) => {
        request(app)
        .get('/todos/5c6cd5fe9aaa3422ac2b16d1')
        .expect(404)
        .expect( (res) => {
            // console.log('response = ', res);
            expect(res.text).toBe('no todos found with the specified id');
        })
        .end(done);
    });

    it('should not find a todo by id, 400', (done) => {
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

describe('DELETE /todos/id', () => {
    it('should delete todos by id, thus 200', (done) => {
        request(app)
        .delete('/todos/5c6b986a16aafa2467c7189e')
        .expect(200)
         .expect( (res) => {
             expect(res.body._id).toBe('5c6b986a16aafa2467c7189e');
         })
         .end(done);
    });

    it('should not delete todos by id as it is not found, 404', (done) => {
        request(app)
         .delete('/todos/6c6b986a16aafa2467c7189e')
         .expect(404)
         .expect( (res) => {
             expect(res.text).toBe('no todos found with the specified id');
         })
         .end(done);
    });

    it('should not find a todo by id as it is invalid, 400', (done) => {
        request(app)
        .get('/todos/5c6cd5fe9aaa3422ac2b16d91f')
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
         .patch('/todos/5c6b979cd9e6cc23a4230f75')
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
         .patch('/todos/5c6b979cd9e6cc23a4230f75')
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

}) ;
