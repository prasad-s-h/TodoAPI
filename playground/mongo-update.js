
const {MongoClient, ObjectID} = require('mongodb');

let uri = 'mongodb://localhost:27017/ToDoAPI';

MongoClient.connect(uri, (err, db)=>{
    if(err) {
        console.log('unable to connect to database server');
        console.log(err);
        return;
    }
    console.log('successfully connected to database server');
    
    // db.collection('Users').findOneAndUpdate(
    //     {
    //         _id: new ObjectID('5c6943fe7f39040ded4c3a91')
    //     },
    //     {
    //         $set: {
    //             name: 'xyz_updated'
    //         }
    //     },
    //     {
    //         returnOriginal: false
    //     }
    //     )
    //     .then( (res)=>{
    //         console.log('res = ');
    //         console.log(res);
    //     }, (err)=>{
    //         console.log('unable to update the document of collection Users due to following error');
    //         console.log(err);
    //     });

    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5c6943fe7f39040ded4c3a91')
        },
        {
            $inc: {
                age: -1
            }
        },
        {
            returnOriginal: false
        }
        )
        .then( (res)=>{
            console.log('res = ');
            console.log(res);
        }, (err)=>{
            console.log('unable to update the document of collection Users due to following error');
            console.log(err);
        });

    db.close();
});
