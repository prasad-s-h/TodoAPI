
// const MongoClient = require('mongodb').MongoClient;

//object destructuring
const { MongoClient, ObjectID } = require('mongodb');

//object destructuring example
// let user = {name:'prasad', stack:'MEAN'};
// let {stack} = user;
// console.log('stack = ', stack);
// process.exit(0);

let url = 'mongodb://localhost:27017/ToDoAPI';

MongoClient.connect(url, (err, db) => {
    if(err){
        return console.log('error in establishing connection to the database server');
    }
    console.log('connection established successfuly to the database server');
    
    //first way of fetching the documents from Users collection
    db.collection('Users').find({name: 'xyz'}).toArray().then( (docs)=>{
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
        console.log('getting the time it was created');
        let id = docs[0]._id;
        console.log('_id is = ', id);
        console.log('timestamp = ', id.getTimestamp());
    }, (err)=>{
        console.log('unable to fetch the collections from Users');
        console.log(err);
    });

    //second way of fetching the documents from Users collection
    // db.collection('Users').find({name: 'xyz'}).toArray( (err, docs) => {
    //     if(err) return console.log('error ', err)
    //     console.log('docs = ');
    //     console.log(docs);
    // });

    // db.collection('Users').find().count().then( (count)=>{
    //     console.log('count in users');
    //     console.log(count);
    // }, (err)=>{
    //     console.log('unable to fetch the collections from Users');
    // });
    
    db.close();
});
 