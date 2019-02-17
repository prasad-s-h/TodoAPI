
const MongoClient = require('mongodb').MongoClient;
// object destructuring
// const {MongoClient, ObjectID} = require('mongodb');

// let objId = new ObjectID();
// console.log('object id = ', objId);
// console.log('object id = ', objId.getTimestamp());
// process.exit(0);

let url = 'mongodb://localhost:27017/ToDoAPI';

MongoClient.connect(url, (err, db) => {
    if(err){
        return console.log('error in establishing connection to the database server');
    }
    console.log('connection established successfuly to the database server');
    
    //used to insert a document in to Todos collecton
    // db.collection('Todos').insertOne({
    //     text: 'to do something1',
    //     completed: false
    // }, (err,result) => {
    //     if(err) return console.log('unable to insert into Todos collection', err);
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //used to insert a document[first way] into the Users collection
    // db.collection('Users').insertOne({
    //     name: 'lmn',
    //     age: 26,
    //     location: 'bangalore'
    // }, (err, result) => {
    //     if(err) return console.log('unable to insert into Users collection', err);
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //used to insert a document[second way] into the Users collection
    db.collection('Users').insertOne({
        name: 'lmn1',
        age: 26,
        location: 'bangalore'
    })
    .then( (result) => {
        console.log(JSON.stringify(result.ops, undefined, 2));
    }, (err) => {
        console.log('unable to insert into Users collection', err);
    });

    db.close();
});
 