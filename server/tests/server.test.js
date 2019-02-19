
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
