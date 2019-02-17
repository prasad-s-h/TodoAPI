
const { MongoClient, ObjectID } = require('mongodb');

let uri = 'mongodb://localhost:27017/ToDoAPI';

MongoClient.connect(uri, (err, db) => {
    if(err){
        return console.log('error in establishing connection to the database server');
    }
    console.log('connection established successfuly to the database server');

    //deleteOne record 
    // db.collection('Users').deleteOne({name: 'abc'}).then( (res) => {
    //     console.log('result = ');
    //     console.log(res);
    // }, (err) => {
    //     console.log('unable to delete the record/document due to = ');
    //     console.log(err);
    // });

    //deleteMany
    // db.collection('Users').deleteMany({name: 'abc'}).then( (res) => {
    //     console.log('result = ');
    //     console.log(res);
    // }, (err) => {
    //     console.log('unable to delete multiple records/documents due to = ');
    //     console.log(err);
    // });

    //findOneAndDelete
    db.collection('Users').findOneAndDelete({ name: 'prasad'}).then( (res) => {
        console.log('deleted record is = ');
        console.log(res);
    }, (err) => {
        console.log('unable to delete a record/document due to = ');
        console.log(err);
    });

    db.close();
});
